"use client";

import { useEffect, useState } from "react";
import { createProductAction, updateProductAction } from "@/actions/menu";
import { ImageUploader } from "@/components/admin/image-uploader";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  available: boolean;
  categoryId: string;
};

export function ProductFormDialog({
  open,
  onOpenChange,
  restaurantId,
  categories,
  product,
  defaultCategoryId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId: string;
  categories: Category[];
  product?: Product | null;
  defaultCategoryId?: string;
  onSuccess: () => void;
}) {
  const isEdit = !!product;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [available, setAvailable] = useState(true);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(product?.name ?? "");
    setDescription(product?.description ?? "");
    setPrice(product?.price?.toString() ?? "");
    setImageUrl(product?.imageUrl ?? "");
    setAvailable(product?.available ?? true);
    setCategoryId(
      product?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? "",
    );
    setError("");
  }, [open, product, defaultCategoryId, categories]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !price || !categoryId) return;
    setLoading(true);
    setError("");

    try {
      if (isEdit) {
        await updateProductAction(restaurantId, product.id, {
          name: name.trim(),
          description: description.trim() || null,
          price: Number(price),
          imageUrl: imageUrl.trim() || null,
          available,
          categoryId,
        });
      } else {
        await createProductAction({
          restaurantId,
          categoryId,
          name: name.trim(),
          description: description.trim() || undefined,
          price: Number(price),
          imageUrl: imageUrl.trim() || undefined,
        });
      }
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "ویرایش محصول" : "محصول جدید"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "اطلاعات محصول رو تغییر بده"
              : "اطلاعات محصول جدید رو وارد کن"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="prod-category">دسته‌بندی</Label>
            <select
              id="prod-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="prod-name">نام محصول</Label>
            <Input
              id="prod-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً: برگر کلاسیک"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prod-desc">توضیحات</Label>
            <Textarea
              id="prod-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات کوتاه محصول"
              rows={2}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="prod-price">قیمت (تومان)</Label>
              <Input
                id="prod-price"
                dir="ltr"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="185000"
              />
            </div>
            <ImageUploader
              label="تصویر محصول"
              value={imageUrl}
              onChange={setImageUrl}
            />
          </div>
          {isEdit && (
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <Label htmlFor="prod-available">فعال</Label>
              <Switch
                id="prod-available"
                checked={available}
                onCheckedChange={setAvailable}
              />
            </div>
          )}
          <DialogFooter showCloseButton>
            <Button
              type="submit"
              disabled={loading || !name.trim() || !price || !categoryId}
            >
              {loading
                ? "در حال ذخیره..."
                : isEdit
                  ? "ذخیره تغییرات"
                  : "افزودن محصول"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
