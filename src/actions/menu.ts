"use server";

import { cookies } from "next/headers";
import { db } from "@/db/index";
import { categories as categoriesTable, products as productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ForbiddenException } from "@/lib/errors";
import { getSessionFromSessionId } from "@/modules/auth/authorizer.service";
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  getRestaurantBySlug,
  isRestaurantAdmin,
  updateCategory,
  updateProduct,
} from "@/modules/restaurants/restaurants.service";
import { userRolesWith } from "@/modules/users/users.service";

async function getAuthUser() {
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

export async function getMenuAction(slug: string) {
  return getRestaurantBySlug(slug);
}

export async function createCategoryAction(input: {
  restaurantId: string;
  name: string;
  sortOrder?: number;
}) {
  const user = await getAuthUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");
  const admin = await isRestaurantAdmin(user.id, input.restaurantId);
  if (!admin) throw new ForbiddenException("NOT_RESTAURANT_ADMIN");
  return createCategory(input.restaurantId, input);
}

export async function updateCategoryAction(input: {
  restaurantId: string;
  categoryId: string;
  name?: string;
  sortOrder?: number;
}) {
  const user = await getAuthUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");
  const admin = await isRestaurantAdmin(user.id, input.restaurantId);
  if (!admin) throw new ForbiddenException("NOT_RESTAURANT_ADMIN");
  return updateCategory(input.categoryId, input);
}

export async function deleteCategoryAction(
  restaurantId: string,
  categoryId: string,
) {
  const user = await getAuthUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");
  const admin = await isRestaurantAdmin(user.id, restaurantId);
  if (!admin) throw new ForbiddenException("NOT_RESTAURANT_ADMIN");
  await deleteCategory(categoryId);
  return { success: true };
}

export async function createProductAction(input: {
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  sortOrder?: number;
}) {
  const user = await getAuthUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");
  const admin = await isRestaurantAdmin(user.id, input.restaurantId);
  if (!admin) throw new ForbiddenException("NOT_RESTAURANT_ADMIN");
  return createProduct(input.restaurantId, input);
}

export async function updateProductAction(
  restaurantId: string,
  productId: string,
  updates: Parameters<typeof updateProduct>[1],
) {
  const user = await getAuthUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");
  const admin = await isRestaurantAdmin(user.id, restaurantId);
  if (!admin) throw new ForbiddenException("NOT_RESTAURANT_ADMIN");
  return updateProduct(productId, updates);
}

export async function deleteProductAction(
  restaurantId: string,
  productId: string,
) {
  const user = await getAuthUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");
  const admin = await isRestaurantAdmin(user.id, restaurantId);
  if (!admin) throw new ForbiddenException("NOT_RESTAURANT_ADMIN");
  await deleteProduct(productId);
  return { success: true };
}

export async function reorderCategoriesAction(
  restaurantId: string,
  orderedIds: string[],
) {
  const user = await getAuthUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");
  const admin = await isRestaurantAdmin(user.id, restaurantId);
  if (!admin) throw new ForbiddenException("NOT_RESTAURANT_ADMIN");

  for (let i = 0; i < orderedIds.length; i++) {
    await db
      .update(categoriesTable)
      .set({ sortOrder: i })
      .where(eq(categoriesTable.id, orderedIds[i]));
  }
  return { success: true };
}

export async function reorderProductsAction(
  restaurantId: string,
  orderedIds: string[],
) {
  const user = await getAuthUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");
  const admin = await isRestaurantAdmin(user.id, restaurantId);
  if (!admin) throw new ForbiddenException("NOT_RESTAURANT_ADMIN");

  for (let i = 0; i < orderedIds.length; i++) {
    await db
      .update(productsTable)
      .set({ sortOrder: i })
      .where(eq(productsTable.id, orderedIds[i]));
  }
  return { success: true };
}
