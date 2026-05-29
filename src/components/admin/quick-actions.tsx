"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
import { ProductFormDialog } from "@/components/admin/product-form-dialog";
import { Button } from "@/components/ui/button";

type Category = {
  id: string;
  name: string;
};

export function QuickActions({
  restaurantId,
  categories,
}: {
  restaurantId: string;
  categories: Category[];
}) {
  const router = useRouter();
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [prodDialogOpen, setProdDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCatDialogOpen(true)}
        >
          <Plus className="size-4" />
          دسته‌بندی جدید
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setProdDialogOpen(true)}
          disabled={categories.length === 0}
        >
          <Plus className="size-4" />
          محصول جدید
        </Button>
      </div>

      <CategoryFormDialog
        open={catDialogOpen}
        onOpenChange={setCatDialogOpen}
        restaurantId={restaurantId}
        onSuccess={() => router.refresh()}
      />
      <ProductFormDialog
        open={prodDialogOpen}
        onOpenChange={setProdDialogOpen}
        restaurantId={restaurantId}
        categories={categories}
        defaultCategoryId={categories[0]?.id}
        onSuccess={() => router.refresh()}
      />
    </>
  );
}
