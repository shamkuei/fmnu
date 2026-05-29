import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRestaurantBySlug } from "@/modules/restaurants/restaurants.service";
import { ContactInfo } from "@/components/menu/contact-info";
import { MenuContent } from "@/components/menu/menu-content";
import { MenuHeader } from "@/components/menu/menu-header";

const getCachedRestaurant = cache(getRestaurantBySlug);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ restaurantSlug: string }>;
}): Promise<Metadata> {
  const { restaurantSlug } = await params;
  const restaurant = await getCachedRestaurant(restaurantSlug);

  if (!restaurant) {
    return { title: "یافت نشد" };
  }

  const title = `${restaurant.name} | منو`;
  const description =
    restaurant.description || `منوی آنلاین ${restaurant.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: restaurant.heroImageUrl ? [{ url: restaurant.heroImageUrl }] : [],
      type: "website",
    },
  };
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ restaurantSlug: string }>;
}) {
  const { restaurantSlug } = await params;
  const restaurant = await getCachedRestaurant(restaurantSlug);

  if (!restaurant) notFound();

  const themeVars = {
    "--background": "var(--bg-base, #ffffff)",
    "--foreground": "var(--text-primary, #111827)",
    "--card": "var(--bg-card, #ffffff)",
    "--card-foreground": "var(--text-primary, #111827)",
    "--primary": "var(--text-accent, #171717)",
    "--primary-foreground": "var(--bg-base, #ffffff)",
    "--muted-foreground": "var(--text-secondary, #6b7280)",
    "--border": "var(--border, #e5e7eb)",
    ...((restaurant.theme as Record<string, string>) || {}),
  };

  const socials = restaurant.socialMedia as Record<string, string> | null;

  return (
    <div style={themeVars as React.CSSProperties} className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl">
        {!restaurant.isAvailable && (
          <div className="mx-4 mt-8 rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">
            این رستوران در حال حاضر فعال نیست
          </div>
        )}

        <MenuHeader
          name={restaurant.name}
          brandText={restaurant.brandText}
          logoUrl={restaurant.logoUrl}
          heroImageUrl={restaurant.heroImageUrl}
        />

        <div className="px-4 py-6 space-y-6">
          {restaurant.description && (
            <p className="text-muted-foreground">{restaurant.description}</p>
          )}

          <ContactInfo
            restaurantName={restaurant.name}
            address={restaurant.address}
            phone={restaurant.phone}
            socialMedia={socials}
          />

          <MenuContent categories={restaurant.categories} />
        </div>
      </main>
    </div>
  );
}
