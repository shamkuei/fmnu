"use client";

import { Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createTestimonialAction,
  deleteTestimonialAction,
  updateTestimonialAction,
} from "@/actions/site";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  isVisible: boolean;
  sortOrder: number;
  createdAt: Date | null;
};

export function TestimonialsManager({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const router = useRouter();
  const [list, _setList] = useState(testimonials);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  function openCreate() {
    setEditing(null);
    setName("");
    setRole("");
    setText("");
    setRating(5);
    setDialogOpen(true);
  }

  function openEdit(t: Testimonial) {
    setEditing(t);
    setName(t.name);
    setRole(t.role);
    setText(t.text);
    setRating(t.rating);
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await updateTestimonialAction({
          id: editing.id,
          name: name.trim(),
          role: role.trim(),
          text: text.trim(),
          rating,
        });
      } else {
        await createTestimonialAction({
          name: name.trim(),
          role: role.trim(),
          text: text.trim(),
          rating,
        });
      }
      setDialogOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleVisibility(t: Testimonial) {
    try {
      await updateTestimonialAction({
        id: t.id,
        isVisible: !t.isVisible,
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("آیا از حذف این نظر مطمئن هستید؟")) return;
    try {
      await deleteTestimonialAction(id);
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button size="sm" onClick={openCreate} />}>
            <Plus className="size-4" />
            افزودن نظر
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editing ? "ویرایش نظر" : "افزودن نظر جدید"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="t-name">نام</Label>
                <Input
                  id="t-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="نام مشتری"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-role">نقش / رستوران</Label>
                <Input
                  id="t-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="مثلاً: رستوران برگرلند"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-text">متن نظر</Label>
                <Textarea
                  id="t-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="متن نظر مشتری..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>امتیاز</Label>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      // biome-ignore lint/suspicious/noArrayIndexKey: index identifies the star position being rated
                      key={i}
                      type="button"
                      onClick={() => setRating(i + 1)}
                      className="p-0.5"
                    >
                      <Star
                        className={`size-5 ${
                          i < rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <DialogFooter showCloseButton>
                <Button type="submit" disabled={loading || !name || !text}>
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : editing ? (
                    "ذخیره تغییرات"
                  ) : (
                    "افزودن"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {list.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            هنوز نظری ثبت نشده. از دکمه بالا نظر جدید اضافه کنید.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((t) => (
            <div
              key={t.id}
              className={`rounded-lg border border-border bg-card p-4 ${
                !t.isVisible ? "opacity-50" : ""
              }`}
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {t.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t.role}
                    </span>
                  </div>
                  <div className="mt-1 flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        // biome-ignore lint/suspicious/noArrayIndexKey: index identifies a star in a fixed-length decorative list
                        key={i}
                        className="size-3 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={t.isVisible}
                    onCheckedChange={() => handleToggleVisibility(t)}
                  />
                  <button
                    type="button"
                    onClick={() => openEdit(t)}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(t.id)}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
