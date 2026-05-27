import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db/index";

export default async function RestaurantEditor({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;
  const restaurant = await db.query.restaurants.findFirst({
    where: { id: restaurantId },
  });

  if (!restaurant) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {restaurant.name}
        </h1>
        <Button render={<a href={`/admin/${restaurant.id}/menu`} />}>
          مدیریت منو
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>اطلاعات رستوران</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                نام
              </p>
              <p className="text-foreground">{restaurant.name}</p>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                آدرس زیردامنه
              </p>
              <p dir="ltr" className="font-mono text-sm text-muted-foreground">
                {restaurant.slug}.fmnu.ir
              </p>
            </div>
          </div>

          {restaurant.description && (
            <>
              <Separator />
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  توضیحات
                </p>
                <p className="text-foreground">{restaurant.description}</p>
              </div>
            </>
          )}

          {restaurant.brandText && (
            <>
              <Separator />
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  متن برند
                </p>
                <p className="text-foreground">{restaurant.brandText}</p>
              </div>
            </>
          )}

          {restaurant.theme && (
            <>
              <Separator />
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  تم (متغیرهای CSS)
                </p>
                <pre
                  dir="ltr"
                  className="mt-1 overflow-x-auto rounded-lg bg-muted p-3 font-mono text-xs text-foreground"
                >
                  {JSON.stringify(restaurant.theme, null, 2)}
                </pre>
              </div>
            </>
          )}

          {restaurant.logoUrl && (
            <>
              <Separator />
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  لوگو
                </p>
                <img
                  src={restaurant.logoUrl}
                  alt="لوگو"
                  className="h-20 w-20 rounded-lg object-cover"
                />
              </div>
            </>
          )}

          {restaurant.heroImageUrl && (
            <>
              <Separator />
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  تصویر اصلی
                </p>
                <img
                  src={restaurant.heroImageUrl}
                  alt="تصویر اصلی"
                  className="h-32 w-full rounded-lg object-cover"
                />
              </div>
            </>
          )}

          <Separator />
          <div>
            <Button
              variant="outline"
              size="sm"
              render={
                <a
                  href={`/${restaurant.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              مشاهده منوی عمومی
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
