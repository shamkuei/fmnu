"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateProfileAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    setLoading(true);
    setError("");

    try {
      await updateProfileAction({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim() || undefined,
      });
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "خطا در ذخیره اطلاعات");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            تکمیل پروفایل
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">نام</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="مثلاً: احسان"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">نام خانوادگی</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="مثلاً: محمدی"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل (اختیاری)</Label>
              <Input
                id="email"
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !firstName.trim() || !lastName.trim()}
              className="h-11 w-full"
              size="lg"
            >
              {loading ? "در حال ذخیره..." : "ذخیره و ادامه"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
