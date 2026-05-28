"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createRestaurantAction } from "@/actions/restaurants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CreateRestaurantDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [brandText, setBrandText] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;
    setLoading(true);
    setError("");

    try {
      await createRestaurantAction({
        name: name.trim(),
        slug: slug.trim(),
        brandText: brandText.trim() || undefined,
        description: description.trim() || undefined,
      });
      setOpen(false);
      setName("");
      setSlug("");
      setBrandText("");
      setDescription("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ساخت رستوران");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus />
            ساخت رستوران جدید
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ساخت رستوران جدید</DialogTitle>
          <DialogDescription>
            اطلاعات اولیه رستوران رو وارد کن
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">نام رستوران</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slug || slug === toSlug(name)) {
                  setSlug(toSlug(e.target.value));
                }
              }}
              placeholder="مثلاً: دلوپی"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">آدرس زیردامنه</Label>
            <div className="flex items-center gap-0">
              <span
                dir="ltr"
                className="shrink-0 rounded-r-lg border border-l-0 border-input bg-muted px-2 py-1.5 text-sm text-muted-foreground"
              >
                fmnu.ir/
              </span>
              <Input
                id="slug"
                dir="ltr"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="dolopi"
                className="rounded-r-none font-mono"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="brandText">متن برند</Label>
            <Input
              id="brandText"
              value={brandText}
              onChange={(e) => setBrandText(e.target.value)}
              placeholder="مثلاً: برگر و ساندویچ"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">توضیحات</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات کوتاه درباره رستوران"
              rows={3}
            />
          </div>
          <DialogFooter showCloseButton>
            <Button
              type="submit"
              disabled={loading || !name.trim() || !slug.trim()}
            >
              {loading ? "در حال ساخت..." : "ساخت رستوران"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
