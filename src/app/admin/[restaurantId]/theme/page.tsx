import { notFound } from "next/navigation";
import { getRestaurantAction } from "@/actions/restaurants";
import { ThemeEditor } from "@/components/admin/theme-editor";
import { Card, CardContent } from "@/components/ui/card";

export default async function ThemePage({
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
        <ThemeEditor
          restaurantId={restaurant.id}
          theme={restaurant.theme as Record<string, string> | null}
        />
      </CardContent>
    </Card>
  );
}
