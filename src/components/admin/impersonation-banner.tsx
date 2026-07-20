"use client";

import { ArrowRightLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { endImpersonationAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function ImpersonationBanner({
  name,
  phone,
}: {
  name: string;
  phone: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleBack() {
    setLoading(true);
    try {
      await endImpersonationAction();
      router.refresh();
      router.push("/admin/users");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b bg-amber-500/15 px-4 py-2 text-sm text-foreground backdrop-blur">
      <div>
        در حال بازدید به عنوان <strong>{name || "کاربر"}</strong>{" "}
        <span dir="ltr" className="font-mono text-muted-foreground">
          {phone}
        </span>
      </div>
      <Button
        size="sm"
        variant="outline"
        disabled={loading}
        onClick={handleBack}
      >
        <ArrowRightLeft className="size-3.5" />
        {loading ? "در حال بازگشت..." : "بازگشت به حساب ادمین"}
      </Button>
    </div>
  );
}
