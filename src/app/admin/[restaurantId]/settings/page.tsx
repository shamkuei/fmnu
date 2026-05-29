import { notFound } from "next/navigation";
import { getRestaurantAction } from "@/actions/restaurants";
import { DeleteRestaurantButton } from "@/components/admin/delete-restaurant-button";
import { Card, CardContent } from "@/components/ui/card";

export default async function SettingsPage({
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

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground">اطلاعات</h3>
          <div className="mt-3 space-y-2 text-sm">
            <p className="text-muted-foreground">
              تاریخ ایجاد:{" "}
              <span className="text-foreground">
                {restaurant.createdAt?.toLocaleDateString("fa-IR")}
              </span>
            </p>
            <p className="text-muted-foreground">
              آخرین تغییر:{" "}
              <span className="text-foreground">
                {restaurant.updatedAt?.toLocaleDateString("fa-IR")} -{" "}
                {restaurant.updatedAt?.toLocaleTimeString("fa-IR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardContent className="pt-6">
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
        </CardContent>
      </Card>
    </div>
  );
}
