import Link from "next/link";
import { LayoutGrid, Palette, Pencil, QrCode, UtensilsCrossed } from "lucide-react";
import { notFound } from "next/navigation";
import {
  getRestaurantAction,
  getRestaurantStatsAction,
} from "@/actions/restaurants";
import { DeleteRestaurantButton } from "@/components/admin/delete-restaurant-button";
import { QrCodeCard } from "@/components/admin/qr-code-card";
import { RestaurantInfoForm } from "@/components/admin/restaurant-info-form";
import { ThemeEditor } from "@/components/admin/theme-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function RestaurantDetailPage({
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
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {restaurant.name}
          </h1>
          <p dir="ltr" className="font-mono text-sm text-muted-foreground">
            fmnu.ir/{restaurant.slug}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/${restaurant.id}/menu`}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            <UtensilsCrossed className="size-4" />
            مدیریت منو
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">
            <LayoutGrid className="size-4" />
            نمای کلی
          </TabsTrigger>
          <TabsTrigger value="edit">
            <Pencil className="size-4" />
            ویرایش
          </TabsTrigger>
          <TabsTrigger value="theme">
            <Palette className="size-4" />
            تم
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <LayoutGrid className="size-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.categories}
                  </p>
                  <p className="text-xs text-muted-foreground">دسته‌بندی</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UtensilsCrossed className="size-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.products}
                  </p>
                  <p className="text-xs text-muted-foreground">محصول</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <QrCode className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    <a
                      href={`/${restaurant.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      مشاهده منو
                    </a>
                  </p>
                  <p className="text-xs text-muted-foreground">لینک عمومی</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QR Code */}
          <QrCodeCard slug={restaurant.slug} />

          {/* Danger Zone */}
          <Separator />
          <div className="rounded-lg border border-destructive/20 p-4">
            <h3 className="font-semibold text-destructive">منطقه خطر</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              حذف رستوران قابل بازگشت نیست و تمام اطلاعات منو هم حذف میشه.
            </p>
            <div className="mt-3">
              <DeleteRestaurantButton
                restaurantId={restaurant.id}
                restaurantName={restaurant.name}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="edit" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <RestaurantInfoForm restaurant={restaurant} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <ThemeEditor
                restaurantId={restaurant.id}
                theme={restaurant.theme as Record<string, string> | null}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
