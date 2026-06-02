"use server";

import { cookies } from "next/headers";
import z from "zod";
import { db } from "@/db/index";
import { verifyOrigin } from "@/lib/csrf";
import { getSessionFromSessionId } from "@/modules/auth/authorizer.service";
import { userRolesWith } from "@/modules/users/users.service";
import {
  createTestimonial,
  deleteTestimonial,
  getAllTestimonials,
  getRestaurantCount,
  getSiteSettings,
  getVisibleTestimonials,
  updateSiteSettings,
  updateTestimonial,
} from "@/modules/site/site.service";

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

  return user;
}

// ============================================================================
// Public actions
// ============================================================================

export async function getLandingDataAction() {
  const [settings, visibleTestimonials, restaurantCount] = await Promise.all([
    getSiteSettings(),
    getVisibleTestimonials(),
    getRestaurantCount(),
  ]);

  return {
    showSocialProof: settings.showSocialProof,
    showTestimonials: settings.showTestimonials,
    testimonials: visibleTestimonials,
    restaurantCount,
  };
}

// ============================================================================
// Admin: Site Settings
// ============================================================================

const UpdateSiteSettingsSchema = z.object({
  showSocialProof: z.boolean().optional(),
  showTestimonials: z.boolean().optional(),
});

export async function updateSiteSettingsAction(
  input: z.input<typeof UpdateSiteSettingsSchema>,
) {
  await verifyOrigin();
  const user = await getAuthUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");
  const data = UpdateSiteSettingsSchema.parse(input);
  return updateSiteSettings(data);
}

export async function getSiteSettingsAction() {
  const user = await getAuthUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");
  return getSiteSettings();
}

// ============================================================================
// Admin: Testimonials
// ============================================================================

const CreateTestimonialSchema = z.object({
  name: z.string().min(1).max(100),
  role: z.string().min(1).max(200),
  text: z.string().min(1).max(1000),
  rating: z.number().int().min(1).max(5),
});

export async function createTestimonialAction(
  input: z.input<typeof CreateTestimonialSchema>,
) {
  await verifyOrigin();
  const user = await getAuthUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");
  const data = CreateTestimonialSchema.parse(input);
  return createTestimonial(data);
}

const UpdateTestimonialSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  role: z.string().min(1).max(200).optional(),
  text: z.string().min(1).max(1000).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  isVisible: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function updateTestimonialAction(
  input: z.input<typeof UpdateTestimonialSchema>,
) {
  await verifyOrigin();
  const user = await getAuthUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");
  const data = UpdateTestimonialSchema.parse(input);
  const { id, ...updates } = data;
  return updateTestimonial(id, updates);
}

export async function deleteTestimonialAction(id: string) {
  await verifyOrigin();
  const user = await getAuthUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");
  return deleteTestimonial(id);
}

export async function getAllTestimonialsAction() {
  const user = await getAuthUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");
  return getAllTestimonials();
}
