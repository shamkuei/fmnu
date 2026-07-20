import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { ConflictException } from "@/lib/errors";
import { zPhoneNumber } from "@/lib/phone-zod";
import { hashPassword } from "@/modules/auth/password.service";
import { createRestaurant } from "@/modules/restaurants/restaurants.service";
import { getFullUser, getFullUserByPhone } from "@/modules/users/users.service";

export type AdminUserRow = {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: string | null;
  restaurantCount: number;
  createdAt: Date;
};

export async function listUsers(): Promise<AdminUserRow[]> {
  const rows = await db.query.users.findMany({
    with: { restaurantAdmins: true },
    orderBy: (u, { desc }) => [desc(u.createdAt)],
  });
  return rows.map((u) => ({
    id: u.id,
    phone: u.phone,
    firstName: u.firstName,
    lastName: u.lastName,
    role: u.role,
    restaurantCount: u.restaurantAdmins.length,
    createdAt: u.createdAt,
  }));
}

export async function createUser(input: {
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: "superadmin";
  restaurantName?: string;
  restaurantSlug?: string;
}) {
  const phone = zPhoneNumber.parse(input.phone);

  const existing = await getFullUserByPhone(phone);
  if (existing) throw new ConflictException("PHONE_ALREADY_EXISTS");

  const passwordHash = await hashPassword(input.password);
  const [user] = await db
    .insert(users)
    .values({
      phone,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      passwordHash,
      hasLogined: true,
    })
    .returning();

  // Optionally create + link a restaurant owned by the new user.
  if (input.restaurantName && input.restaurantSlug) {
    await createRestaurant(
      { name: input.restaurantName, slug: input.restaurantSlug },
      user.id,
    );
  }

  const full = await getFullUser(user.id);
  if (!full) throw new Error("Failed to retrieve user after creation");
  return full;
}

export async function resetPassword(userId: string, newPassword: string) {
  const passwordHash = await hashPassword(newPassword);
  await db.update(users).set({ passwordHash }).where(eq(users.id, userId));
}
