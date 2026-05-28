"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  deleteCategoryAction,
  deleteProductAction,
  reorderCategoriesAction,
  reorderProductsAction,
  updateProductAction,
} from "@/actions/menu";
import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { ProductFormDialog } from "@/components/admin/product-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Category = {
  id: string;
  name: string;
  sortOrder: number;
  products: Product[];
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  available: boolean;
  sortOrder: number;
  categoryId: string;
};

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  categories: Category[];
};

export function MenuEditor({ restaurant }: { restaurant: Restaurant }) {
  const router = useRouter();

  // Category dialogs
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [deleteCatId, setDeleteCatId] = useState<string | null>(null);
  const [deleteCatLoading, setDeleteCatLoading] = useState(false);

  // Product dialogs
  const [prodDialogOpen, setProdDialogOpen] = useState(false);
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [prodDefaultCatId, setProdDefaultCatId] = useState("");
  const [deleteProdId, setDeleteProdId] = useState<{
    id: string;
    catId: string;
  } | null>(null);
  const [deleteProdLoading, setDeleteProdLoading] = useState(false);

  // Toggle loading
  const [togglingId, setTogglingId] = useState<string | null>(null);

  function openNewCategory() {
    setEditingCat(null);
    setCatDialogOpen(true);
  }

  function openEditCategory(cat: Category) {
    setEditingCat(cat);
    setCatDialogOpen(true);
  }

  function openNewProduct(categoryId: string) {
    setEditingProd(null);
    setProdDefaultCatId(categoryId);
    setProdDialogOpen(true);
  }

  function openEditProduct(prod: Product) {
    setEditingProd(prod);
    setProdDefaultCatId(prod.categoryId);
    setProdDialogOpen(true);
  }

  async function handleDeleteCategory() {
    if (!deleteCatId) return;
    setDeleteCatLoading(true);
    try {
      await deleteCategoryAction(restaurant.id, deleteCatId);
      setDeleteCatId(null);
      router.refresh();
    } finally {
      setDeleteCatLoading(false);
    }
  }

  async function handleDeleteProduct() {
    if (!deleteProdId) return;
    setDeleteProdLoading(true);
    try {
      await deleteProductAction(restaurant.id, deleteProdId.id);
      setDeleteProdId(null);
      router.refresh();
    } finally {
      setDeleteProdLoading(false);
    }
  }

  async function handleToggleAvailable(prod: Product) {
    setTogglingId(prod.id);
    try {
      await updateProductAction(restaurant.id, prod.id, {
        available: !prod.available,
      });
      router.refresh();
    } finally {
      setTogglingId(null);
    }
  }

  async function handleMoveCategory(cat: Category, direction: "up" | "down") {
    const cats = restaurant.categories;
    const idx = cats.findIndex((c) => c.id === cat.id);
    if (
      (direction === "up" && idx === 0) ||
      (direction === "down" && idx === cats.length - 1)
    )
      return;

    const newCats = [...cats];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newCats[idx], newCats[swapIdx]] = [newCats[swapIdx], newCats[idx]];
    await reorderCategoriesAction(
      restaurant.id,
      newCats.map((c) => c.id),
    );
    router.refresh();
  }

  async function handleMoveProduct(
    products: Product[],
    prod: Product,
    direction: "up" | "down",
  ) {
    const idx = products.findIndex((p) => p.id === prod.id);
    if (
      (direction === "up" && idx === 0) ||
      (direction === "down" && idx === products.length - 1)
    )
      return;

    const newProds = [...products];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newProds[idx], newProds[swapIdx]] = [newProds[swapIdx], newProds[idx]];
    await reorderProductsAction(
      restaurant.id,
      newProds.map((p) => p.id),
    );
    router.refresh();
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={`/admin/${restaurant.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          بازگشت به {restaurant.name}
        </Link>
        <Button onClick={openNewCategory}>
          <Plus />
          دسته‌بندی جدید
        </Button>
      </div>

      <h1 className="mb-6 text-2xl font-bold text-foreground">مدیریت منو</h1>

      {restaurant.categories.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-muted-foreground">هنوز دسته‌بندی اضافه نشده.</p>
          <Button onClick={openNewCategory} variant="outline">
            <Plus />
            افزودن دسته‌بندی اول
          </Button>
        </div>
      )}

      {restaurant.categories.map((category) => (
        <section key={category.id} className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => handleMoveCategory(category, "up")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronUp className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleMoveCategory(category, "down")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronDown className="size-3.5" />
              </button>
            </div>
            <h2 className="flex-1 text-lg font-semibold text-foreground">
              {category.name}
            </h2>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => openNewProduct(category.id)}
            >
              <Plus className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => openEditCategory(category)}
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setDeleteCatId(category.id)}
            >
              <Trash2 className="size-3.5 text-destructive" />
            </Button>
          </div>
          <Separator className="mb-3" />

          {category.products.length === 0 && (
            <p className="py-2 text-sm text-muted-foreground">
              هنوز محصولی اضافه نشده
            </p>
          )}

          <div className="grid gap-2">
            {category.products.map((product) => (
              <Card key={product.id} size="sm">
                <CardContent
                  className={`flex items-center justify-between gap-3 ${
                    !product.available ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() =>
                          handleMoveProduct(category.products, product, "up")
                        }
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ChevronUp className="size-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleMoveProduct(category.products, product, "down")
                        }
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ChevronDown className="size-3" />
                      </button>
                    </div>
                    <span className="truncate font-medium text-foreground">
                      {product.name}
                    </span>
                    {!product.available && (
                      <Badge variant="destructive">ناموجود</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {product.price.toLocaleString("fa-IR")} تومان
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleToggleAvailable(product)}
                      disabled={togglingId === product.id}
                    >
                      <EyeOff className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => openEditProduct(product)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() =>
                        setDeleteProdId({ id: product.id, catId: category.id })
                      }
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}

      {/* Dialogs */}
      <CategoryFormDialog
        open={catDialogOpen}
        onOpenChange={setCatDialogOpen}
        restaurantId={restaurant.id}
        category={editingCat}
        onSuccess={() => router.refresh()}
      />

      <ProductFormDialog
        open={prodDialogOpen}
        onOpenChange={setProdDialogOpen}
        restaurantId={restaurant.id}
        categories={restaurant.categories}
        product={editingProd}
        defaultCategoryId={prodDefaultCatId}
        onSuccess={() => router.refresh()}
      />

      <DeleteConfirmDialog
        open={!!deleteCatId}
        onOpenChange={(open) => !open && setDeleteCatId(null)}
        title="حذف دسته‌بندی"
        description="آیا مطمئن هستید؟ تمام محصولات این دسته‌بندی هم حذف خواهند شد."
        onConfirm={handleDeleteCategory}
        loading={deleteCatLoading}
      />

      <DeleteConfirmDialog
        open={!!deleteProdId}
        onOpenChange={(open) => !open && setDeleteProdId(null)}
        title="حذف محصول"
        description="آیا مطمئن هستید؟ این محصول حذف خواهد شد."
        onConfirm={handleDeleteProduct}
        loading={deleteProdLoading}
      />
    </>
  );
}
