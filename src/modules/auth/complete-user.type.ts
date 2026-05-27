import type { restaurantAdmins, sessions, users } from "@/db/schema";

export type UserWithRoles = typeof users.$inferSelect & {
  currentSession: typeof sessions.$inferSelect;
  restaurantAdmins: (typeof restaurantAdmins.$inferSelect & {
    restaurant: typeof import("@/db/schema").restaurants.$inferSelect;
  })[];
};

export type UserWithRolesOptional = UserWithRoles | null;
