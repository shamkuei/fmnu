import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getRestaurantBySlug } from "@/modules/restaurants/restaurants.service";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ restaurantSlug: string }>;
}) {
  const { restaurantSlug } = await params;
  const restaurant = await getRestaurantBySlug(restaurantSlug);

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

  return (
    <div style={themeVars as React.CSSProperties}>
      <main className="mx-auto min-h-screen max-w-3xl px-4 py-8">
        {restaurant.heroImageUrl && (
          <div className="mb-8 overflow-hidden rounded-2xl">
            <img
              src={restaurant.heroImageUrl}
              alt={restaurant.name}
              className="h-48 w-full object-cover sm:h-64"
            />
          </div>
        )}

        <div className="mb-8 flex items-center gap-4">
          {restaurant.logoUrl && (
            <img
              src={restaurant.logoUrl}
              alt=""
              className="h-16 w-16 rounded-xl object-cover"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {restaurant.name}
            </h1>
            {restaurant.brandText && (
              <p className="mt-1 text-sm text-muted-foreground">
                {restaurant.brandText}
              </p>
            )}
          </div>
        </div>

        {restaurant.description && (
          <p className="mb-8 text-muted-foreground">{restaurant.description}</p>
        )}

        {restaurant.categories.length === 0 && (
          <p className="text-center text-muted-foreground">منو به زودی...</p>
        )}

        {restaurant.categories.map((category) => (
          <section key={category.id} className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              {category.name}
            </h2>
            <Separator className="mb-4" />
            <div className="grid gap-4 sm:grid-cols-2">
              {category.products.map((product) => (
                <Card
                  key={product.id}
                  className={!product.available ? "opacity-50" : ""}
                >
                  <CardContent>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">
                            {product.name}
                          </h3>
                          {!product.available && (
                            <Badge variant="destructive">ناموجود</Badge>
                          )}
                        </div>
                        {product.description && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {product.description}
                          </p>
                        )}
                      </div>
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt=""
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      )}
                    </div>
                    <div className="mt-3 font-semibold text-primary">
                      {formatPrice(product.price)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

function formatPrice(toman: number) {
  return `${new Intl.NumberFormat("fa-IR").format(toman)} تومان`;
}
