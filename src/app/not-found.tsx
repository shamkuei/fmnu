import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-2 text-7xl font-bold text-primary/20">۴۰۴</div>
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        صفحه مورد نظر پیدا نشد
      </h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        ممکنه این صفحه حذف شده باشه یا آدرس اشتباه وارد شده باشه.
      </p>
      <div className="flex gap-3">
        <Button
          nativeButton={false}
          render={
            // biome-ignore lint/a11y/useAnchorContent: anchor content is provided by Button's children via the render prop
            <a href="/" />
          }
        >
          <Home className="size-4" />
          صفحه اصلی
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={
            // biome-ignore lint/a11y/useAnchorContent: anchor content is provided by Button's children via the render prop
            <a href="/restaurants" />
          }
        >
          <Search className="size-4" />
          جستجوی رستوران‌ها
        </Button>
      </div>
    </div>
  );
}
