import { db } from "@/db/index";
import { sessions } from "@/db/schema";
import type { UserWithRoles } from "./complete-user.type";

export async function loginUser(user: Omit<UserWithRoles, "currentSession">) {
  const [session] = await db
    .insert(sessions)
    .values({
      userId: user.id,
      expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
    .returning();
  return { sessionId: session.id, user };
}
