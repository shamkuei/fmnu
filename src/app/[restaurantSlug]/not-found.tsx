import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RestaurantNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-2 text-7xl font-bold text-primary/20">۴۰۴</div>
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        رستوران مورد نظر پیدا نشد
      </h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        ممکنه آدرس منو تغییر کرده باشه یا رستوران غیرفعال شده باشه.
      </p>
      <div className="flex gap-3">
        <Button nativeButton={false} render={<a href="/" />}>
          <Home className="size-4" />
          صفحه اصلی
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<a href="/restaurants" />}
        >
          <Search className="size-4" />
          جستجوی رستوران‌ها
        </Button>
      </div>
    </div>
  );
}
