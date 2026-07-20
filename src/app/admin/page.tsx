import { ExternalLink, MessageSquareText, Store, Users } from "lucide-react";
import Link from "next/link";
import { getMeAction } from "@/actions/auth";
import { getMyRestaurantsAction } from "@/actions/restaurants";
import { CreateRestaurantDialog } from "@/components/admin/create-restaurant-dialog";
import { RestaurantList } from "@/components/admin/restaurant-list";
import { UserMenu } from "@/components/admin/user-menu";
import { Separator } from "@/components/ui/separator";
import { isPlatformAdmin } from "@/modules/users/users.service";

export default async function AdminDashboard() {
  const user = await getMeAction();
  const restaurantsData = await getMyRestaurantsAction();

  const restaurants = restaurantsData.map((ra: Record<string, unknown>) => {
    const r = ra.restaurant as Record<string, unknown>;
    return {
      id: r.id as string,
      name: r.name as string,
      slug: r.slug as string,
      logoUrl: (r.logoUrl as string) ?? null,
      address: (r.address as string) ?? null,
      description: (r.description as string) ?? null,
      isAvailable: r.isAvailable as boolean,
      updatedAt: r.updatedAt ? new Date(r.updatedAt as string | Date) : null,
    };
  });

  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : "";
  const isSuper = isPlatformAdmin(user);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* Mobile: stacked. Desktop: row */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">داشبورد</h1>
          <p className="text-sm text-muted-foreground">{displayName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="size-3.5" />
            fmnu.ir
          </Link>
          <Link
            href="/admin/testimonials"
            className="inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <MessageSquareText className="size-3.5" />
            نظرات و تنظیمات
          </Link>
          {isSuper && (
            <Link
              href="/admin/users"
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-primary/40 bg-primary/5 px-2.5 text-sm text-primary hover:bg-primary/10"
            >
              <Users className="size-3.5" />
              مدیریت کاربران
            </Link>
          )}
          <CreateRestaurantDialog />
          {user && (
            <UserMenu
              name={displayName}
              phone={user.phone ?? ""}
              imageUrl={user.imageUrl ?? null}
            />
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">رستوران‌های من</h2>
        <Separator className="my-4" />

        {restaurants.length === 0 ? (
          isSuper ? (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-12 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Users className="size-8 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  به عنوان مدیر سامانه وارد شده‌اید
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  از بخش «مدیریت کاربران» برای کاربران رستوران بسازید و وارد پنل
                  آن‌ها شوید.
                </p>
              </div>
              <Link
                href="/admin/users"
                className="inline-flex h-9 items-center gap-1 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Users className="size-4" />
                مدیریت کاربران
              </Link>
            </div>
          ) : (
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
          )
        ) : (
          <RestaurantList restaurants={restaurants} />
        )}
      </div>
    </main>
  );
}
