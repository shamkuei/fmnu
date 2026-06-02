import { asc, eq } from "drizzle-orm";
import { db } from "@/db/index";
import { restaurants, siteSettings, testimonials } from "@/db/schema";

// ============================================================================
// Site Settings
// ============================================================================

export async function getSiteSettings() {
  let settings = await db.query.siteSettings.findFirst();
  if (!settings) {
    await db.insert(siteSettings).values({ id: 1 });
    settings = { id: 1, showSocialProof: true, showTestimonials: true };
  }
  return settings;
}

export async function updateSiteSettings(data: {
  showSocialProof?: boolean;
  showTestimonials?: boolean;
}) {
  const existing = await getSiteSettings();
  await db
    .update(siteSettings)
    .set(data)
    .where(eq(siteSettings.id, existing.id));
  return getSiteSettings();
}

// ============================================================================
// Testimonials
// ============================================================================

export async function getVisibleTestimonials() {
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.isVisible, true))
    .orderBy(asc(testimonials.sortOrder), asc(testimonials.createdAt));
}

export async function getAllTestimonials() {
  return db
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.sortOrder), asc(testimonials.createdAt));
}

export async function createTestimonial(data: {
  name: string;
  role: string;
  text: string;
  rating: number;
}) {
  const [created] = await db.insert(testimonials).values(data).returning();
  return created;
}

export async function updateTestimonial(
  id: string,
  data: {
    name?: string;
    role?: string;
    text?: string;
    rating?: number;
    isVisible?: boolean;
    sortOrder?: number;
  },
) {
  await db.update(testimonials).set(data).where(eq(testimonials.id, id));
  const [result] = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.id, id));
  return result;
}

export async function deleteTestimonial(id: string) {
  await db.delete(testimonials).where(eq(testimonials.id, id));
}

export async function getRestaurantCount() {
  const rows = await db.select({ id: restaurants.id }).from(restaurants);
  return rows.length;
}
