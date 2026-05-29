import type { Metadata } from "next";
import { Search } from "lucide-react";
import { searchPublicRestaurants } from "@/modules/restaurants/restaurants.service";

export const metadata: Metadata = {
  title: "جستجوی رستوران‌ها | فستمنو",
  description: "جستجو و browse منوی آنلاین رستوران‌ها",
};

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const restaurants = await searchPublicRestaurants(q || undefined);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <a href="/" className="text-xl font-bold text-foreground">
            فستمنو
          </a>
          <a
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            بازگشت به صفحه اصلی
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl">
          منو رستوران‌ها
        </h1>

        <form action="/restaurants" method="get" className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              name="q"
              defaultValue={q || ""}
              placeholder="جستجوی نام رستوران..."
              className="h-11 w-full rounded-xl border border-input bg-background pr-10 pl-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
            />
          </div>
        </form>

        {restaurants.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">
              {q
                ? `رستورانی با نام "${q}" پیدا نشد.`
                : "هنوز رستورانی ثبت نشده."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r) => (
              <a
                key={r.id}
                href={`/${r.slug}`}
                className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-3">
                  {r.logoUrl ? (
                    <img
                      src={r.logoUrl}
                      alt={r.name}
                      className="size-11 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                      {r.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {r.name}
                    </div>
                    {r.brandText && (
                      <div className="text-xs text-muted-foreground">
                        {r.brandText}
                      </div>
                    )}
                  </div>
                </div>
                {r.description && (
                  <p className="mb-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {r.description}
                  </p>
                )}
                {r.address && (
                  <p className="text-xs text-muted-foreground">{r.address}</p>
                )}
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
