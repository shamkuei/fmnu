"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  MapPin,
  MoreHorizontal,
  Search,
  Store,
  Trash2,
} from "lucide-react";
import { deleteRestaurantAction } from "@/actions/restaurants";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getRestaurantUrl } from "@/lib/urls";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  address: string | null;
  description: string | null;
  isAvailable: boolean;
  updatedAt: Date | null;
};

function relativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "لحظاتی پیش";
  if (minutes < 60) return `${minutes} دقیقه پیش`;
  if (hours < 24) return `${hours} ساعت پیش`;
  if (days < 30) return `${days} روز پیش`;
  return date.toLocaleDateString("fa-IR");
}

function RestaurantCard({
  restaurant,
}: {
  restaurant: Restaurant;
}) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleDelete() {
    setDeleteLoading(true);
    try {
      await deleteRestaurantAction(restaurant.id);
      router.refresh();
    } catch {
      setDeleteLoading(false);
    }
  }

  return (
    <>
      <Card className="transition-colors hover:border-primary/30">
        <CardContent className="flex items-start gap-4 pt-5 pb-5">
          {/* Logo */}
          {restaurant.logoUrl ? (
            <img
              src={restaurant.logoUrl}
              alt=""
              className="size-14 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Store className="size-6" />
            </div>
          )}

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground truncate">
                    {restaurant.name}
                  </h3>
                  <span
                    className={`inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[0.65rem] font-medium ${
                      restaurant.isAvailable
                        ? "bg-green-500/10 text-green-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {restaurant.isAvailable ? "فعال" : "غیرفعال"}
                  </span>
                </div>
                <p
                  dir="ltr"
                  className="font-mono text-xs text-muted-foreground truncate"
                >
                  {getRestaurantUrl(restaurant.slug).replace("https://", "")}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg hover:bg-muted">
                  <MoreHorizontal className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={4}>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 className="size-4" />
                    حذف رستوران
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop-only details */}
            {restaurant.description && (
              <p className="mt-1.5 line-clamp-1 text-sm text-muted-foreground hidden sm:block">
                {restaurant.description}
              </p>
            )}
            {restaurant.address && (
              <p className="mt-1 items-center gap-1 text-xs text-muted-foreground hidden sm:flex">
                <MapPin className="size-3 shrink-0" />
                <span className="line-clamp-1">{restaurant.address}</span>
              </p>
            )}

            {/* Actions */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <Link
                href={`/admin/${restaurant.id}`}
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                مدیریت
              </Link>
              <Link
                href={getRestaurantUrl(restaurant.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ExternalLink className="size-3.5 hidden sm:block" />
                مشاهده منو
              </Link>
              {restaurant.updatedAt && (
                <span className="me-auto text-xs text-muted-foreground">
                  {relativeTime(new Date(restaurant.updatedAt))}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`حذف ${restaurant.name}`}
        description="آیا مطمئن هستید؟ تمام اطلاعات رستوران و منو حذف خواهد شد و قابل بازگشت نیست."
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </>
  );
}

export function RestaurantList({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return restaurants;
    const q = query.trim().toLowerCase();
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q),
    );
  }, [restaurants, query]);

  return (
    <div className="space-y-4">
      {restaurants.length > 3 && (
        <div className="relative">
          <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی رستوران..."
            className="ps-3 pe-9"
          />
        </div>
      )}

      {filtered.length === 0 && query.trim() && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          رستورانی با این نام یافت نشد
        </p>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}
