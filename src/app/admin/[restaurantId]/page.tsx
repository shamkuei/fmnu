import { notFound } from "next/navigation";
import {
  getRestaurantAction,
  getRestaurantStatsAction,
} from "@/actions/restaurants";
import { QrCodeCard } from "@/components/admin/qr-code-card";
import { QuickActions } from "@/components/admin/quick-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, LayoutGrid, QrCode, UtensilsCrossed } from "lucide-react";

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;

  let restaurant;
  try {
    restaurant = await getRestaurantAction(restaurantId);
  } catch {
    notFound();
  }

  if (!restaurant) notFound();

  let stats = { categories: 0, products: 0, available: 0 };
  try {
    stats = await getRestaurantStatsAction(restaurantId);
  } catch {
    // ignore stats error
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card>
          <CardContent className="flex flex-col items-center gap-2 pt-6 text-center">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <LayoutGrid className="size-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {stats.categories}
            </p>
            <p className="text-xs text-muted-foreground">دسته‌بندی</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-2 pt-6 text-center">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UtensilsCrossed className="size-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {stats.products}
            </p>
            <p className="text-xs text-muted-foreground">محصول</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-2 pt-6 text-center">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
              <QrCode className="size-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {stats.available}/{stats.products}
            </p>
            <p className="text-xs text-muted-foreground">فعال</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-2 pt-6 text-center">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Eye className="size-5" />
            </div>
            <a
              href={`/${restaurant.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary underline"
            >
              مشاهده منو
            </a>
            <p className="text-xs text-muted-foreground">لینک عمومی</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <QuickActions
        restaurantId={restaurant.id}
        categories={restaurant.categories}
      />

      {/* QR Code */}
      <QrCodeCard slug={restaurant.slug} />

      {/* Last Updated */}
      <p className="text-xs text-muted-foreground">
        آخرین تغییر:{" "}
        {restaurant.updatedAt?.toLocaleDateString("fa-IR")} -{" "}
        {restaurant.updatedAt?.toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}
