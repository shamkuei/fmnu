import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { zPhoneNumber } from "@/lib/phone-zod";
import { hashPassword } from "@/modules/auth/password.service";
import { getFullUserByPhone } from "@/modules/users/users.service";

/**
 * Ensures the permanent platform superadmin ("useradmin") exists.
 *
 * Driven by ROOT_PHONE + ROOT_PASSWORD env vars. Idempotent and runs on every
 * server boot (after migrations, from instrumentation): the env is the source of
 * truth, so changing ROOT_PASSWORD updates the stored hash. Missing env vars are
 * a warning (so dev without them still boots); a malformed ROOT_PHONE fails loud.
 */
export async function ensureRootSuperadmin() {
  const phoneRaw = process.env.ROOT_PHONE?.trim();
  const password = process.env.ROOT_PASSWORD;

  if (!phoneRaw || !password) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[bootstrap] ROOT_PHONE/ROOT_PASSWORD not set — no superadmin ensured. Set them in the environment to enable the platform admin.",
      );
    }
    return;
  }

  const phone = zPhoneNumber.parse(phoneRaw);
  const passwordHash = await hashPassword(password);

  const existing = await getFullUserByPhone(phone);
  if (existing) {
    await db
      .update(users)
      .set({ role: "superadmin", passwordHash })
      .where(eq(users.id, existing.id));
    console.log(`[bootstrap] superadmin ensured: ${phone}`);
    return;
  }

  await db.insert(users).values({
    phone,
    role: "superadmin",
    passwordHash,
    firstName: "مدیر",
    lastName: "سامانه",
    hasLogined: true,
  });
  console.log(`[bootstrap] superadmin created: ${phone}`);
}
