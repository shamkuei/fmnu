import { notFound } from "next/navigation";
import { getRestaurantAction } from "@/actions/restaurants";
import { MenuEditor } from "@/components/admin/menu-editor";

export default async function MenuManagerPage({
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
    <main className="mx-auto max-w-3xl px-4 py-8">
      <MenuEditor restaurant={restaurant} />
    </main>
  );
}
