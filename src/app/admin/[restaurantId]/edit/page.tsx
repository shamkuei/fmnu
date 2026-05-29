import { notFound } from "next/navigation";
import { getRestaurantAction } from "@/actions/restaurants";
import { RestaurantInfoForm } from "@/components/admin/restaurant-info-form";
import { Card, CardContent } from "@/components/ui/card";

export default async function EditPage({
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
    <Card>
      <CardContent className="pt-6">
        <RestaurantInfoForm restaurant={restaurant} />
      </CardContent>
    </Card>
  );
}
