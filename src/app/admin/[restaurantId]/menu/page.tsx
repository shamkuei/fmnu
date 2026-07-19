import { notFound } from "next/navigation";
import { getRestaurantAction } from "@/actions/restaurants";
import { MenuEditor } from "@/components/admin/menu-editor";

export default async function MenuManagerPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;

  let restaurant: Awaited<ReturnType<typeof getRestaurantAction>>;
  try {
    restaurant = await getRestaurantAction(restaurantId);
  } catch {
    notFound();
  }

  if (!restaurant) notFound();

  return <MenuEditor restaurant={restaurant} />;
}
