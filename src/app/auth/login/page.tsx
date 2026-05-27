"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  checkCodeAction,
  otpLoginAction,
  requestOtpAction,
} from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [codeValid, setCodeValid] = useState<boolean | null>(null);

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setError("");

    try {
      await requestOtpAction(phone);
      setStep("code");
    } catch (err: any) {
      setError(err?.message ?? "ارسال کد ناموفق بود");
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckCode(value: string) {
    if (value.length === 6) {
      try {
        const result = await checkCodeAction(phone, value);
        setCodeValid((result as any).valid);
      } catch {
        setCodeValid(false);
      }
    } else {
      setCodeValid(null);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6) return;
    setLoading(true);
    setError("");

    try {
      await otpLoginAction(phone, code);
      router.push("/admin");
    } catch (err: any) {
      setError(err?.message ?? "ورود ناموفق بود");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            {step === "phone" ? "ورود به حساب" : "کد تأیید"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {step === "phone" ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">شماره موبایل</Label>
                <Input
                  id="phone"
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09121234567"
                  className="h-11 text-left font-mono text-base"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !phone.trim()}
                className="h-11 w-full"
                size="lg"
              >
                {loading ? "در حال ارسال..." : "ارسال کد تأیید"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                کد ارسال شده به{" "}
                <span dir="ltr" className="font-mono text-foreground">
                  {phone}
                </span>
              </p>
              <div className="space-y-2">
                <Input
                  type="text"
                  dir="ltr"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setCode(val);
                    handleCheckCode(val);
                  }}
                  placeholder="000000"
                  className="h-14 text-center font-mono text-2xl tracking-[0.5em]"
                />
                {codeValid === true && (
                  <p className="text-center text-sm text-green-600 dark:text-green-400">
                    کد صحیح است
                  </p>
                )}
                {codeValid === false && (
                  <p className="text-center text-sm text-destructive">
                    کد نادرست است
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={loading || code.length !== 6}
                className="h-11 w-full"
                size="lg"
              >
                {loading ? "در حال بررسی..." : "ورود"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep("phone")}
                className="w-full"
              >
                تغییر شماره موبایل
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
