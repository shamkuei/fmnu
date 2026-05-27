import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db/index";

export default async function MenuManager({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;
  const restaurant = await db.query.restaurants.findFirst({
    where: { id: restaurantId },
    with: {
      categories: {
        orderBy: (c, { asc }) => [asc(c.sortOrder)],
        with: {
          products: {
            orderBy: (p, { asc }) => [asc(p.sortOrder)],
          },
        },
      },
    },
  });

  if (!restaurant) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          render={<a href={`/admin/${restaurant.id}`} />}
        >
          بازگشت به {restaurant.name}
        </Button>
        <h1 className="mt-2 text-2xl font-bold text-foreground">مدیریت منو</h1>
      </div>

      {restaurant.categories.length === 0 && (
        <p className="mb-6 text-center text-muted-foreground">
          هنوز دسته‌بندی اضافه نشده.
        </p>
      )}

      {restaurant.categories.map((category) => (
        <section key={category.id} className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            {category.name}
          </h2>
          <Separator className="mb-3" />
          <div className="grid gap-2">
            {category.products.map((product) => (
              <Card key={product.id} size="sm">
                <CardContent
                  className={`flex items-center justify-between ${
                    !product.available ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {product.name}
                    </span>
                    {!product.available && (
                      <Badge variant="destructive">ناموجود</Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.price.toLocaleString("fa-IR")} تومان
                  </span>
                </CardContent>
              </Card>
            ))}
            {category.products.length === 0 && (
              <p className="py-2 text-sm text-muted-foreground">
                هنوز محصولی اضافه نشده
              </p>
            )}
          </div>
        </section>
      ))}
    </main>
  );
}
