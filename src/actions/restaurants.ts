"use server";

import { cookies } from "next/headers";
import { db } from "@/db/index";
import { ForbiddenException } from "@/lib/errors";
import {
	createRestaurant,
	getRestaurantsForAdmin,
	isRestaurantAdmin,
	updateRestaurant,
} from "@/modules/restaurants/restaurants.service";
import { getSessionFromSessionId } from "@/modules/auth/authorizer.service";
import { userRolesWith } from "@/modules/users/users.service";
import z from "zod";

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

const CreateRestaurantSchema = z.object({
	slug: z.string().min(3).max(50).regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/),
	name: z.string().min(1).max(100),
	brandText: z.string().max(500).optional(),
	description: z.string().max(1000).optional(),
});

export async function createRestaurantAction(input: z.input<typeof CreateRestaurantSchema>) {
	const user = await getAuthUser();
	if (!user) throw new Error("NOT_AUTHENTICATED");
	const data = CreateRestaurantSchema.parse(input);
	return createRestaurant(data, user.id);
}

const UpdateRestaurantSchema = z.object({
	restaurantId: z.string(),
	name: z.string().min(1).max(100).optional(),
	slug: z.string().min(3).max(50).regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/).optional(),
	brandText: z.string().max(500).nullable().optional(),
	description: z.string().max(1000).nullable().optional(),
	logoUrl: z.string().url().nullable().optional(),
	heroImageUrl: z.string().url().nullable().optional(),
	theme: z.record(z.string(), z.string()).nullable().optional(),
});

export async function updateRestaurantAction(input: z.input<typeof UpdateRestaurantSchema>) {
	const user = await getAuthUser();
	if (!user) throw new Error("NOT_AUTHENTICATED");
	const data = UpdateRestaurantSchema.parse(input);
	const admin = await isRestaurantAdmin(user.id, data.restaurantId);
	if (!admin) throw new ForbiddenException("NOT_RESTAURANT_ADMIN");
	const { restaurantId, ...updates } = data;
	return updateRestaurant(restaurantId, updates);
}

export async function getMyRestaurantsAction() {
	const user = await getAuthUser();
	if (!user) return [];
	return getRestaurantsForAdmin(user.id);
}
