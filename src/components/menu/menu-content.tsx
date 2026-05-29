"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUp, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  available: boolean;
};

type Category = {
  id: string;
  name: string;
  products: Product[];
};

export function MenuContent({ categories }: { categories: Category[] }) {
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const hasUnavailable = categories.some((c) =>
    c.products.some((p) => !p.available),
  );
  const showCatNav = categories.length >= 2;

  useEffect(() => {
    function onScroll() {
      setShowScrollTop(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToCat(id: string) {
    document
      .getElementById(`cat-${id}`)
      ?.scrollIntoView({ behavior: "smooth" });
  }

  const visibleCategories = showUnavailable
    ? categories
    : categories
        .map((c) => ({ ...c, products: c.products.filter((p) => p.available) }))
        .filter((c) => c.products.length > 0);

  return (
    <>
      {/* Sticky category nav */}
      {showCatNav && (
        <div className="sticky top-0 z-10 -mx-4 border-b border-border bg-[var(--bg-base,white)] px-4 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCat(cat.id)}
                className="whitespace-nowrap rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Unavailable toggle */}
        {hasUnavailable && (
          <button
            onClick={() => setShowUnavailable(!showUnavailable)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {showUnavailable ? (
              <Eye className="size-4" />
            ) : (
              <EyeOff className="size-4" />
            )}
            {showUnavailable
              ? "مخفی کردن ناموجودها"
              : "نمایش موارد ناموجود"}
          </button>
        )}

        {visibleCategories.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            منو به زودی...
          </p>
        )}

        {visibleCategories.map((category) => (
          <section
            key={category.id}
            id={`cat-${category.id}`}
            className="scroll-mt-16"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="h-6 w-1 rounded-full bg-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                {category.name}
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {category.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-20 flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-colors hover:bg-muted"
        >
          <ArrowUp className="size-5" />
        </button>
      )}
    </>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className={!product.available ? "opacity-60" : ""}>
      <CardContent>
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground">{product.name}</h3>
              {!product.available && (
                <Badge variant="destructive">ناموجود</Badge>
              )}
            </div>
            {product.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {product.description}
              </p>
            )}
            <p
              className={`mt-2 text-sm font-semibold ${
                product.available
                  ? "text-primary"
                  : "text-muted-foreground line-through"
              }`}
            >
              {formatPrice(product.price)}
            </p>
          </div>
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={96}
              height={96}
              className="h-24 w-24 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl font-bold text-primary">
              {product.name.charAt(0)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function formatPrice(toman: number) {
  return `${new Intl.NumberFormat("fa-IR").format(toman)} تومان`;
}
