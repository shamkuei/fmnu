"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
import { Button } from "@/components/ui/button";

export function EmptyStateActions({ restaurantId }: { restaurantId: string }) {
  const router = useRouter();
  const [catDialogOpen, setCatDialogOpen] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => setCatDialogOpen(true)}>
          <Plus className="size-4" />
          افزودن دسته‌بندی
        </Button>
      </div>

      <CategoryFormDialog
        open={catDialogOpen}
        onOpenChange={setCatDialogOpen}
        restaurantId={restaurantId}
        onSuccess={() => router.refresh()}
      />
    </>
  );
}
