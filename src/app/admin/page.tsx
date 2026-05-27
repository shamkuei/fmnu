import { redirect } from "next/navigation";
import { getMeAction } from "@/actions/auth";
import { getMyRestaurantsAction } from "@/actions/restaurants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function AdminDashboard() {
  const user = await getMeAction();
  if (!user) redirect("/auth/login");

  const restaurants = await getMyRestaurantsAction();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">داشبورد</h1>
        <p className="text-sm text-muted-foreground">
          <span dir="ltr">{(user as any).phone}</span>
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            رستوران‌های من
          </h2>
        </div>
        <Separator className="my-4" />

        {restaurants.length === 0 && (
          <p className="py-4 text-center text-muted-foreground">
            هنوز رستورانی ثبت نشده.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {restaurants.map((ra: any) => (
            <Card
              key={ra.restaurant.id}
              className="transition-colors hover:border-primary/30"
            >
              <CardHeader>
                <CardTitle className="text-lg">{ra.restaurant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  dir="ltr"
                  className="mb-4 font-mono text-sm text-muted-foreground"
                >
                  {ra.restaurant.slug}.fmnu.ir
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  render={<a href={`/admin/${ra.restaurant.id}`} />}
                >
                  مدیریت
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
