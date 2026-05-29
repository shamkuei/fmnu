import { and, count, eq, like, or, sql } from "drizzle-orm";
import { db } from "@/db/index";
import {
  categories,
  products,
  restaurantAdmins,
  restaurants,
} from "@/db/schema";

export function searchPublicRestaurants(query?: string) {
  const cols = {
    id: restaurants.id,
    slug: restaurants.slug,
    name: restaurants.name,
    brandText: restaurants.brandText,
    description: restaurants.description,
    logoUrl: restaurants.logoUrl,
    address: restaurants.address,
  };

  if (query) {
    return db
      .select(cols)
      .from(restaurants)
      .where(
        and(
          eq(restaurants.isAvailable, true),
          sql`(${restaurants.name} LIKE ${`%${query}%`} OR COALESCE(${restaurants.brandText}, '') LIKE ${`%${query}%`} OR COALESCE(${restaurants.description}, '') LIKE ${`%${query}%`})`,
        ),
      )
      .orderBy(sql`${restaurants.createdAt} DESC`);
  }

  return db
    .select(cols)
    .from(restaurants)
    .where(eq(restaurants.isAvailable, true))
    .orderBy(sql`${restaurants.createdAt} DESC`);
}

export function getRestaurantBySlug(slug: string) {
  return db.query.restaurants.findFirst({
    where: { slug },
    with: {
      categories: {
        orderBy: (c, { asc }) => [asc(c.sortOrder)],
        with: {
          products: {
            orderBy: (p, { asc }) => [asc(p.sortOrder)],
          },
        },
      },
    },
  });
}

export function getRestaurantById(id: string) {
  return db.query.restaurants.findFirst({
    where: { id },
    with: {
      categories: {
        orderBy: (c, { asc }) => [asc(c.sortOrder)],
        with: {
          products: {
            orderBy: (p, { asc }) => [asc(p.sortOrder)],
          },
        },
      },
    },
  });
}

export function getRestaurantsForAdmin(userId: string) {
  return db.query.restaurantAdmins.findMany({
    where: { userId },
    with: {
      restaurant: true,
    },
  });
}

export async function createRestaurant(
  data: {
    slug: string;
    name: string;
    brandText?: string;
    description?: string;
    address?: string;
    phone?: string;
    socialMedia?: Record<string, string>;
    isAvailable?: boolean;
  },
  userId: string,
) {
  const [restaurant] = await db.insert(restaurants).values(data).returning();

  await db.insert(restaurantAdmins).values({
    restaurantId: restaurant.id,
    userId,
  });

  return restaurant;
}

export async function updateRestaurant(
  restaurantId: string,
  data: Partial<{
    name: string;
    slug: string;
    brandText: string | null;
    description: string | null;
    logoUrl: string | null;
    heroImageUrl: string | null;
    address: string | null;
    phone: string | null;
    socialMedia: Record<string, string> | null;
    isAvailable: boolean;
    theme: Record<string, string> | null;
  }>,
) {
  const [updated] = await db
    .update(restaurants)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(restaurants.id, restaurantId))
    .returning();
  return updated;
}

export async function deleteRestaurant(restaurantId: string) {
  await db.delete(restaurants).where(eq(restaurants.id, restaurantId));
}

export async function getRestaurantStats(restaurantId: string) {
  const [cat] = await db
    .select({ count: count() })
    .from(categories)
    .where(eq(categories.restaurantId, restaurantId));
  const [prod] = await db
    .select({ count: count() })
    .from(products)
    .where(eq(products.restaurantId, restaurantId));
  const [avail] = await db
    .select({ count: count() })
    .from(products)
    .where(
      and(
        eq(products.restaurantId, restaurantId),
        eq(products.available, true),
      ),
    );
  return {
    categories: cat.count,
    products: prod.count,
    available: avail.count,
  };
}

export function isRestaurantAdmin(userId: string, restaurantId: string) {
  return db.query.restaurantAdmins.findFirst({
    where: { AND: [{ userId }, { restaurantId }] },
  });
}

// Categories

export async function createCategory(
  restaurantId: string,
  data: { name: string; sortOrder?: number },
) {
  const [category] = await db
    .insert(categories)
    .values({ ...data, restaurantId })
    .returning();
  return category;
}

export async function updateCategory(
  categoryId: string,
  data: Partial<{ name: string; sortOrder: number }>,
) {
  const [updated] = await db
    .update(categories)
    .set(data)
    .where(eq(categories.id, categoryId))
    .returning();
  return updated;
}

export async function deleteCategory(categoryId: string) {
  await db.delete(categories).where(eq(categories.id, categoryId));
}

// Products

export async function createProduct(
  restaurantId: string,
  data: {
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    sortOrder?: number;
  },
) {
  const [product] = await db
    .insert(products)
    .values({ ...data, restaurantId })
    .returning();
  return product;
}

export async function updateProduct(
  productId: string,
  data: Partial<{
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    available: boolean;
    sortOrder: number;
    categoryId: string;
  }>,
) {
  const [updated] = await db
    .update(products)
    .set(data)
    .where(eq(products.id, productId))
    .returning();
  return updated;
}

export async function deleteProduct(productId: string) {
  await db.delete(products).where(eq(products.id, productId));
}
