import { randomBytes } from "node:crypto";
import { sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import type { VerificationReason } from "@/modules/verification/reasons";

// ============================================================================
// Users & Auth
// ============================================================================

export const users = sqliteTable("user", {
  id: text()
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  phone: text().unique().notNull(),
  name: text(),
  hasLogined: integer({ mode: "boolean" }).default(false).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const sessions = sqliteTable(
  "session",
  {
    id: text()
      .$defaultFn(() => randomBytes(30).toString("base64url"))
      .primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expireAt: integer("expire_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    revokedAt: integer("revoked_at", { mode: "timestamp" }),
  },
  (self) => [index("idx_sessions_user").on(self.userId)],
);

export const verifications = sqliteTable(
  "verification",
  {
    id: text()
      .$defaultFn(() => crypto.randomUUID())
      .primaryKey(),
    code: text().notNull(),
    phone: text(),
    reason: text().$type<VerificationReason>().notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    expireAt: integer("expire_at", { mode: "timestamp" }).notNull(),
    nextResend: integer("next_resend", { mode: "timestamp" }).notNull(),
    resendCount: integer("resend_count").notNull().default(0),
    usedAt: integer("used_at", { mode: "timestamp" }),
  },
  (table) => [index("idx_verifications_phone").on(table.phone)],
);

// ============================================================================
// Restaurants
// ============================================================================

export const restaurants = sqliteTable("restaurant", {
  id: text()
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  slug: text().unique().notNull(),
  name: text().notNull(),
  brandText: text("brand_text"),
  description: text(),
  logoUrl: text("logo_url"),
  heroImageUrl: text("hero_image_url"),
  address: text(),
  phone: text(),
  socialMedia: text("social_media", { mode: "json" }).$type<
    Record<string, string>
  >(),
  isAvailable: integer("is_available", { mode: "boolean" })
    .default(true)
    .notNull(),
  theme: text({ mode: "json" }).$type<Record<string, string>>(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const restaurantAdmins = sqliteTable(
  "restaurant_admin",
  {
    restaurantId: text("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (self) => [
    primaryKey({ columns: [self.restaurantId, self.userId] }),
    index("idx_restaurant_admins_user").on(self.userId),
  ],
);

// ============================================================================
// Menu
// ============================================================================

export const categories = sqliteTable(
  "category",
  {
    id: text()
      .$defaultFn(() => crypto.randomUUID())
      .primaryKey(),
    restaurantId: text("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    name: text().notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (self) => [index("idx_categories_restaurant").on(self.restaurantId)],
);

export const products = sqliteTable(
  "product",
  {
    id: text()
      .$defaultFn(() => crypto.randomUUID())
      .primaryKey(),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    restaurantId: text("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    name: text().notNull(),
    description: text(),
    price: integer().notNull(),
    imageUrl: text("image_url"),
    available: integer({ mode: "boolean" }).default(true).notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (self) => [
    index("idx_products_category").on(self.categoryId),
    index("idx_products_restaurant").on(self.restaurantId),
  ],
);
