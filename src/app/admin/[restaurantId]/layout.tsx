import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getRestaurantAction } from "@/actions/restaurants";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function RestaurantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
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
    <main className="mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/admin" className="hover:text-foreground">
          رستوران‌ها
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{restaurant.name}</span>
      </nav>

      <div className="flex gap-8">
        <AdminSidebar
          restaurantId={restaurant.id}
          name={restaurant.name}
          slug={restaurant.slug}
        />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </main>
  );
}
