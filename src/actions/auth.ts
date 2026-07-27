"use server";

import { eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import z from "zod";
import { db } from "@/db/index";
import { sessions, users } from "@/db/schema";
import { verifyOrigin } from "@/lib/csrf";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@/lib/errors";
import { setImpersonation } from "@/modules/auth/auth.service";
import { getSessionFromSessionId } from "@/modules/auth/authorizer.service";
import { checkCodeFlow } from "@/modules/auth/flows/check-code";
import { otpLogin } from "@/modules/auth/flows/otp-login";
import { passwordLogin } from "@/modules/auth/flows/password-login";
import { requestOtp } from "@/modules/auth/flows/request-otp";
import { userRolesWith } from "@/modules/users/users.service";
import { resendCode } from "@/modules/verification/verification.service";

/**
 * Whether the current request arrived over HTTPS. The session cookie's `secure`
 * flag must mirror this: a Secure cookie is silently rejected by the browser
 * over plain HTTP (e.g. when the app is reached directly on :3000 without a
 * TLS-terminating proxy). Behind a proxy (Caddy/Cloudflare/nginx) we trust the
 * standard `x-forwarded-proto` header.
 */
async function isRequestHttps(): Promise<boolean> {
  const proto = (await headers()).get("x-forwarded-proto");
  return proto?.split(",")[0].trim().toLowerCase() === "https";
}

export async function requestOtpAction(phone: string) {
  await verifyOrigin();
  return requestOtp({ rawInput: { phone } });
}

export async function checkCodeAction(phone: string, code: string) {
  return checkCodeFlow({ rawInput: { phone, code } });
}

export async function otpLoginAction(phone: string, code: string) {
  await verifyOrigin();
  const result = await otpLogin({ rawInput: { phone, code } });

  const cookieStore = await cookies();
  cookieStore.set("session-id", result.sessionId, {
    httpOnly: true,
    secure: await isRequestHttps(),
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });

  return { user: result.user };
}

export async function passwordLoginAction(phone: string, password: string) {
  await verifyOrigin();
  const result = await passwordLogin({ rawInput: { phone, password } });

  const cookieStore = await cookies();
  cookieStore.set("session-id", result.sessionId, {
    httpOnly: true,
    secure: await isRequestHttps(),
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });

  return { user: result.user };
}

export async function getMeAction() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session-id")?.value;
  if (!sessionId) return null;

  const session = await getSessionFromSessionId(sessionId);
  if (!session || !session.user) return null;

  const user = await db.query.users.findFirst({
    where: { id: session.user.id },
    with: userRolesWith,
  });
  if (!user) return null;

  return { ...user, currentSession: session };
}

export async function logoutAction() {
  await verifyOrigin();
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session-id")?.value;
  if (sessionId) {
    await db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(eq(sessions.id, sessionId));
  }
  cookieStore.delete("session-id");
}

export async function resendOtpAction(verificationId: string) {
  await verifyOrigin();
  return resendCode(verificationId);
}

// ----------------------------------------------------------------------------
// Impersonation — superadmin "enters" another user's panel, then switches back.
// Both actions gate on the REAL session owner (session.realUserId), never on the
// effective user, because during impersonation the effective user is the target
// (not a superadmin) and would otherwise lock the admin out of switching back.
// ----------------------------------------------------------------------------

async function getCurrentSessionOrFail() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session-id")?.value;
  if (!sessionId) throw new Error("NOT_AUTHENTICATED");
  const session = await getSessionFromSessionId(sessionId);
  if (!session) throw new Error("NOT_AUTHENTICATED");
  return { sessionId, session };
}

export async function impersonateUserAction(targetUserId: string) {
  await verifyOrigin();
  const { sessionId, session } = await getCurrentSessionOrFail();

  const realUser = await db.query.users.findFirst({
    where: { id: session.realUserId },
  });
  if (realUser?.role !== "superadmin") {
    throw new ForbiddenException("ACCESS_DENIED");
  }

  if (session.realUserId === targetUserId) {
    throw new BadRequestException("CANNOT_IMPERSONATE_SELF");
  }

  const target = await db.query.users.findFirst({
    where: { id: targetUserId },
  });
  if (!target) throw new NotFoundException("USER_NOT_FOUND");
  if (target.role === "superadmin") {
    throw new ForbiddenException("CANNOT_IMPERSONATE_ADMIN");
  }

  await setImpersonation(sessionId, targetUserId);
}

export async function endImpersonationAction() {
  await verifyOrigin();
  const { sessionId, session } = await getCurrentSessionOrFail();
  if (!session.impersonatedUserId) return; // not impersonating — nothing to do
  await setImpersonation(sessionId, null);
}

const UpdateProfileSchema = z.object({
  firstName: z.string().min(1, "نام الزامی است").max(100),
  lastName: z.string().min(1, "نام خانوادگی الزامی است").max(100),
  email: z.string().email("ایمیل نامعتبر است").nullable().optional(),
});

export async function updateProfileAction(
  input: z.input<typeof UpdateProfileSchema>,
) {
  await verifyOrigin();
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session-id")?.value;
  if (!sessionId) throw new Error("NOT_AUTHENTICATED");

  const session = await getSessionFromSessionId(sessionId);
  if (!session?.user) throw new Error("NOT_AUTHENTICATED");

  const data = UpdateProfileSchema.parse(input);
  await db
    .update(users)
    .set({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email ?? null,
    })
    .where(eq(users.id, session.user.id));
}
