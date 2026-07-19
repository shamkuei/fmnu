import { Skeleton } from "@/components/ui/skeleton";

export default function MenuLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="px-4 pt-8 pb-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-16 rounded-xl" />
            <div>
              <Skeleton className="mb-1 h-8 w-36" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Description */}
          <Skeleton className="h-4 w-3/4" />

          {/* Contact info */}
          <div className="space-y-3 rounded-lg border border-border bg-card p-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static decorative skeleton list
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>

          {/* Products grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static decorative skeleton list
                key={i}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-3"
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="size-20 shrink-0 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
