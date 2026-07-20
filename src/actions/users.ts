"use server";

import z from "zod";
import { getMeAction } from "@/actions/auth";
import { verifyOrigin } from "@/lib/csrf";
import { ForbiddenException } from "@/lib/errors";
import {
  createUser,
  listUsers,
  resetPassword,
} from "@/modules/users/users.admin.service";
import { isPlatformAdmin } from "@/modules/users/users.service";

/**
 * Gate for mutating, client-invoked actions. verifyOrigin (CSRF) is correct here:
 * these are triggered from the browser, which sends Origin/Host headers.
 */
async function requirePlatformAdmin() {
  await verifyOrigin();
  const user = await getMeAction();
  if (!isPlatformAdmin(user)) throw new ForbiddenException("ACCESS_DENIED");
  return user;
}

/**
 * Read action invoked during SSR (server component). No verifyOrigin — it would
 * throw CSRF_ORIGIN_MISSING during server-side rendering where there is no
 * Origin header. Mirrors getMyRestaurantsAction / getMeAction (reads skip CSRF).
 */
export async function listUsersAction() {
  const user = await getMeAction();
  if (!isPlatformAdmin(user)) throw new ForbiddenException("ACCESS_DENIED");
  return listUsers();
}

const CreateUserSchema = z.object({
  phone: z.string().min(1, "شماره موبایل الزامی است"),
  firstName: z.string().min(1, "نام الزامی است").max(100),
  lastName: z.string().min(1, "نام خانوادگی الزامی است").max(100),
  password: z.string().min(6, "رمز عبور حداقل ۶ کاراکتر است").max(200),
  role: z.literal("superadmin").optional(),
  restaurantName: z.string().min(1).max(100).optional(),
  restaurantSlug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "اسلاگ نامعتبر است")
    .optional(),
});

export async function createUserAction(
  input: z.input<typeof CreateUserSchema>,
) {
  await requirePlatformAdmin();
  const data = CreateUserSchema.parse(input);
  return createUser(data);
}

const ResetPasswordSchema = z.object({
  userId: z.string().min(1),
  password: z.string().min(6, "رمز عبور حداقل ۶ کاراکتر است").max(200),
});

export async function resetPasswordAction(
  input: z.input<typeof ResetPasswordSchema>,
) {
  await requirePlatformAdmin();
  const data = ResetPasswordSchema.parse(input);
  await resetPassword(data.userId, data.password);
}
