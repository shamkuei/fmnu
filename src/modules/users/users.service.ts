import { db } from "@/db/index";
import { users } from "@/db/schema";

export const userRolesWith = {
  restaurantAdmins: {
    with: {
      restaurant: true,
    },
  },
} as const;

export function getFullUser(id: string) {
  return db.query.users.findFirst({
    where: { id },
    with: userRolesWith,
  });
}

export function getFullUserByPhone(phone: string) {
  return db.query.users.findFirst({
    where: { phone },
    with: userRolesWith,
  });
}

export async function findOrCreateByPhone(phone: string) {
  const existing = await getFullUserByPhone(phone);
  if (existing) return existing;

  const [user] = await db.insert(users).values({ phone }).returning();

  const fullUser = await getFullUser(user.id);
  if (!fullUser) throw new Error("Failed to retrieve user after creation");
  return fullUser;
}
