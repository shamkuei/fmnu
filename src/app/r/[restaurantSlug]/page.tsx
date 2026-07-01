import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRestaurantBySlug } from "@/modules/restaurants/restaurants.service";
import { trackPageView } from "@/modules/restaurants/restaurants.service";
import { ContactInfo } from "@/components/menu/contact-info";
import { MenuContent } from "@/components/menu/menu-content";
import { MenuHeader } from "@/components/menu/menu-header";
import { getRestaurantUrl } from "@/lib/urls";

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

  const title = `${restaurant.name} | منوی آنلاین رستوران`;
  const description =
    restaurant.description ||
    `مشاهده منوی آنلاین ${restaurant.name}. قیمت‌ها، دسته‌بندی‌ها و اطلاعات تماس`;
  const url = getRestaurantUrl(restaurantSlug);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "فستمنو",
      locale: "fa_IR",
      type: "website",
      images: restaurant.heroImageUrl
        ? [
            {
              url: restaurant.heroImageUrl,
              width: 1200,
              height: 630,
              alt: restaurant.name,
            },
          ]
        : [],
    },
    twitter: {
      card: restaurant.heroImageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: restaurant.heroImageUrl ? [restaurant.heroImageUrl] : [],
    },
    alternates: { canonical: url },
    robots: restaurant.isAvailable
      ? { index: true, follow: true }
      : { index: false, follow: false },
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

  trackPageView(restaurant.id);

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
            province={restaurant.province}
            city={(restaurant as any).city ?? null}
            socialMedia={socials}
          />

          <MenuContent categories={restaurant.categories} />
        </div>
      </main>
    </div>
  );
}
