import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function RestaurantLoading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-4 flex items-center gap-1">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="mx-1 size-3" />
        <Skeleton className="h-4 w-24" />
      </nav>

      <div className="flex gap-8">
        {/* Desktop sidebar skeleton */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-8 space-y-6">
            <div>
              <Skeleton className="mb-1 h-6 w-28" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="space-y-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </aside>

        {/* Content skeleton */}
        <div className="min-w-0 flex-1 space-y-6">
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="flex flex-col items-center gap-2 pt-6">
                  <Skeleton className="size-10 rounded-lg" />
                  <Skeleton className="h-7 w-10" />
                  <Skeleton className="h-3 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-7 w-28" />
          </div>

          <Card>
            <CardContent className="flex flex-col items-center gap-3 pt-6">
              <Skeleton className="size-48 rounded-lg" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
