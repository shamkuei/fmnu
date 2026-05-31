"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RestaurantError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-8" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        خطا در بارگذاری منو
      </h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        مشکلی در نمایش منو رستوران پیش آمده. لطفاً دوباره تلاش کنید.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>
          <RotateCw className="size-4" />
          تلاش مجدد
        </Button>
        <Button variant="outline" nativeButton={false} render={<a href="/" />}>
          <Home className="size-4" />
          صفحه اصلی
        </Button>
      </div>
    </div>
  );
}
