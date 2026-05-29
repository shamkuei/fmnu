import Link from "next/link";
import { Store } from "lucide-react";
import { getMeAction } from "@/actions/auth";
import { getMyRestaurantsAction } from "@/actions/restaurants";
import { CreateRestaurantDialog } from "@/components/admin/create-restaurant-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function AdminDashboard() {
  const user = await getMeAction();
  const restaurants = await getMyRestaurantsAction();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">داشبورد</h1>
          <p className="text-sm text-muted-foreground">
            <span dir="ltr">
              {(user as Record<string, unknown>).phone as string}
            </span>
          </p>
        </div>
        <CreateRestaurantDialog />
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          رستوران‌های من
        </h2>
        <Separator className="my-4" />

        {restaurants.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <Store className="size-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                هنوز رستورانی ثبت نشده
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                اولین رستورانت رو بساز و منوی آنلاین داشته باش
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {restaurants.map((ra: Record<string, unknown>) => {
            const restaurant = ra.restaurant as Record<string, unknown>;
            return (
              <Card
                key={restaurant.id as string}
                className="transition-colors hover:border-primary/30"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {restaurant.logoUrl ? (
                      <img
                        src={restaurant.logoUrl as string}
                        alt=""
                        className="size-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Store className="size-5" />
                      </div>
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {restaurant.name as string}
                      </CardTitle>
                      <p
                        dir="ltr"
                        className="font-mono text-xs text-muted-foreground"
                      >
                        fmnu.ir/{restaurant.slug as string}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/${restaurant.id as string}`}
                      className="inline-flex h-7 items-center gap-1 rounded-lg border border-border bg-background px-2.5 text-[0.8rem] font-medium text-foreground hover:bg-muted hover:text-foreground"
                    >
                      مدیریت
                    </Link>
                    <Link
                      href={`/${restaurant.slug as string}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-7 items-center gap-1 rounded-lg px-2.5 text-[0.8rem] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      مشاهده منو
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
