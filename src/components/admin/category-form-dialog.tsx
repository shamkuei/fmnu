"use client";

import { useState } from "react";
import { createCategoryAction, updateCategoryAction } from "@/actions/menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Category = {
  id: string;
  name: string;
};

export function CategoryFormDialog({
  open,
  onOpenChange,
  restaurantId,
  category,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId: string;
  category?: Category | null;
  onSuccess: () => void;
}) {
  const isEdit = !!category;
  const [name, setName] = useState(category?.name ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleOpenChange(val: boolean) {
    if (!val) {
      setName(category?.name ?? "");
      setError("");
    }
    onOpenChange(val);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    try {
      if (isEdit) {
        await updateCategoryAction({
          restaurantId,
          categoryId: category.id,
          name: name.trim(),
        });
      } else {
        await createCategoryAction({
          restaurantId,
          name: name.trim(),
        });
      }
      onSuccess();
      handleOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "نام دسته‌بندی رو تغییر بده"
              : "نام دسته‌بندی جدید رو وارد کن"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="cat-name">نام دسته‌بندی</Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً: برگرها"
            />
          </div>
          <DialogFooter showCloseButton>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading
                ? "در حال ذخیره..."
                : isEdit
                  ? "ذخیره تغییرات"
                  : "ساخت دسته‌بندی"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
