"use server";

import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { sessions } from "@/db/schema";
import { otpLogin } from "@/modules/auth/flows/otp-login";
import { requestOtp } from "@/modules/auth/flows/request-otp";
import { checkCodeFlow } from "@/modules/auth/flows/check-code";
import { resendCode } from "@/modules/verification/verification.service";
import { getSessionFromSessionId } from "@/modules/auth/authorizer.service";
import { userRolesWith } from "@/modules/users/users.service";

export async function requestOtpAction(phone: string) {
	return requestOtp({ rawInput: { phone } });
}

export async function checkCodeAction(phone: string, code: string) {
	return checkCodeFlow({ rawInput: { phone, code } });
}

export async function otpLoginAction(phone: string, code: string) {
	const result = await otpLogin({ rawInput: { phone, code } });

	const cookieStore = await cookies();
	cookieStore.set("session-id", result.sessionId, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
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
	return resendCode(verificationId);
}
