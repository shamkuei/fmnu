"use client";

import { KeyRound, LogIn, Plus, ShieldCheck, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { impersonateUserAction } from "@/actions/auth";
import { createUserAction, resetPasswordAction } from "@/actions/users";
import { Badge } from "@/components/ui/badge";
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
import type { AdminUserRow } from "@/modules/users/users.admin.service";

function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function UsersManager({
  users,
  currentUserId,
}: {
  users: AdminUserRow[];
  currentUserId: string;
}) {
  const router = useRouter();

  // Create-user dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [form, setForm] = useState({
    phone: "",
    firstName: "",
    lastName: "",
    password: "",
    restaurantName: "",
    restaurantSlug: "",
  });

  // Reset-password dialog state
  const [resetTarget, setResetTarget] = useState<AdminUserRow | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState("");

  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    try {
      await createUserAction({
        phone: form.phone.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        password: form.password,
        restaurantName: form.restaurantName.trim() || undefined,
        restaurantSlug: form.restaurantSlug.trim() || undefined,
      });
      setCreateOpen(false);
      setForm({
        phone: "",
        firstName: "",
        lastName: "",
        password: "",
        restaurantName: "",
        restaurantSlug: "",
      });
      router.refresh();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "خطا در ساخت کاربر");
    } finally {
      setCreating(false);
    }
  }

  async function handleImpersonate(user: AdminUserRow) {
    setImpersonatingId(user.id);
    try {
      await impersonateUserAction(user.id);
      router.refresh();
      router.push("/admin");
    } catch (err) {
      setImpersonatingId(null);
      alert(err instanceof Error ? err.message : "خطا در ورود به پنل کاربر");
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!resetTarget) return;
    setResetting(true);
    setResetError("");
    try {
      await resetPasswordAction({
        userId: resetTarget.id,
        password: resetPassword,
      });
      setResetTarget(null);
      setResetPassword("");
    } catch (err) {
      setResetError(err instanceof Error ? err.message : "خطا در تغییر رمز");
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">کاربران</h2>
          <p className="text-sm text-muted-foreground">
            ساخت کاربر (صاحب رستوران)، ورود به پنل کاربر و تغییر رمز عبور
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger
            render={
              <Button>
                <Plus />
                کاربر جدید
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>ساخت کاربر جدید</DialogTitle>
              <DialogDescription>
                کاربر می‌تواند با شماره موبایل و رمز عبور وارد شود.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              {createError && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {createError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="cu-phone">شماره موبایل</Label>
                <Input
                  id="cu-phone"
                  dir="ltr"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="09121234567"
                  className="text-left font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="cu-firstName">نام</Label>
                  <Input
                    id="cu-firstName"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, firstName: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cu-lastName">نام خانوادگی</Label>
                  <Input
                    id="cu-lastName"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, lastName: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cu-password">رمز عبور</Label>
                <Input
                  id="cu-password"
                  type="text"
                  dir="ltr"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="حداقل ۶ کاراکتر"
                  className="text-left font-mono"
                />
              </div>

              <div className="rounded-lg border border-dashed p-3">
                <p className="mb-3 text-xs font-medium text-muted-foreground">
                  رستوران (اختیاری) — همین الان بساز و به این کاربر وصل کن
                </p>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="cu-rname">نام رستوران</Label>
                    <Input
                      id="cu-rname"
                      value={form.restaurantName}
                      onChange={(e) => {
                        const v = e.target.value;
                        setForm((f) => ({
                          ...f,
                          restaurantName: v,
                          restaurantSlug:
                            !f.restaurantSlug ||
                            f.restaurantSlug === toSlug(f.restaurantName)
                              ? toSlug(v)
                              : f.restaurantSlug,
                        }));
                      }}
                      placeholder="مثلاً: دلوپی"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cu-rslug">آدرس منو</Label>
                    <div className="flex items-center gap-0" dir="ltr">
                      <span className="shrink-0 rounded-s-lg border border-e-0 border-input bg-muted px-2 py-1.5 text-sm text-muted-foreground">
                        /r/
                      </span>
                      <Input
                        id="cu-rslug"
                        value={form.restaurantSlug}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            restaurantSlug: e.target.value,
                          }))
                        }
                        placeholder="dolopi"
                        className="rounded-s-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter showCloseButton>
                <Button
                  type="submit"
                  disabled={
                    creating ||
                    !form.phone.trim() ||
                    !form.firstName.trim() ||
                    !form.lastName.trim() ||
                    form.password.length < 6
                  }
                >
                  {creating ? "در حال ساخت..." : "ساخت کاربر"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-right font-medium">نام</th>
              <th className="px-4 py-3 text-right font-medium">شماره موبایل</th>
              <th className="px-4 py-3 text-right font-medium">نقش</th>
              <th className="px-4 py-3 text-right font-medium">رستوران‌ها</th>
              <th className="px-4 py-3 text-left font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.id === currentUserId;
              return (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-3 text-foreground">
                    {`${u.firstName} ${u.lastName}`.trim() || "—"}
                  </td>
                  <td className="px-4 py-3 font-mono" dir="ltr">
                    {u.phone}
                  </td>
                  <td className="px-4 py-3">
                    {u.role === "superadmin" ? (
                      <Badge className="gap-1">
                        <ShieldCheck className="size-3" />
                        مدیر سامانه
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Store className="size-3" />
                        صاحب رستوران
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {u.restaurantCount}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isSelf || impersonatingId !== null}
                        onClick={() => handleImpersonate(u)}
                      >
                        <LogIn className="size-3.5" />
                        ورود به پنل
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setResetTarget(u);
                          setResetPassword("");
                          setResetError("");
                        }}
                      >
                        <KeyRound className="size-3.5" />
                        تغییر رمز
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog
        open={resetTarget !== null}
        onOpenChange={(o) => !o && setResetTarget(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>تغییر رمز عبور</DialogTitle>
            <DialogDescription>
              رمز جدید برای{" "}
              <span dir="ltr" className="font-mono">
                {resetTarget?.phone}
              </span>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReset} className="space-y-4">
            {resetError && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {resetError}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="rp-password">رمز عبور جدید</Label>
              <Input
                id="rp-password"
                type="text"
                dir="ltr"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                placeholder="حداقل ۶ کاراکتر"
                className="text-left font-mono"
              />
            </div>
            <DialogFooter showCloseButton>
              <Button
                type="submit"
                disabled={resetting || resetPassword.length < 6}
              >
                {resetting ? "در حال ذخیره..." : "ذخیره رمز جدید"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
