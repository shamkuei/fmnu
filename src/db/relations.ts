import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    sessions: r.many.sessions(),
    verifications: r.many.verifications(),
    restaurantAdmins: r.many.restaurantAdmins(),
  },

  sessions: {
    user: r.one.users({
      from: r.sessions.userId,
      to: r.users.id,
    }),
  },

  verifications: {
    user: r.one.users({
      from: r.verifications.phone,
      to: r.users.phone,
    }),
  },

  restaurants: {
    admins: r.many.restaurantAdmins(),
    categories: r.many.categories(),
    products: r.many.products(),
  },

  restaurantAdmins: {
    restaurant: r.one.restaurants({
      from: r.restaurantAdmins.restaurantId,
      to: r.restaurants.id,
      optional: false,
    }),
    user: r.one.users({
      from: r.restaurantAdmins.userId,
      to: r.users.id,
      optional: false,
    }),
  },

  categories: {
    restaurant: r.one.restaurants({
      from: r.categories.restaurantId,
      to: r.restaurants.id,
      optional: false,
    }),
    products: r.many.products(),
  },

  products: {
    category: r.one.categories({
      from: r.products.categoryId,
      to: r.categories.id,
      optional: false,
    }),
    restaurant: r.one.restaurants({
      from: r.products.restaurantId,
      to: r.restaurants.id,
      optional: false,
    }),
  },
}));
