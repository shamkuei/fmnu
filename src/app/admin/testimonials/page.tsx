import type { Metadata } from "next";
import { getAllTestimonialsAction, getSiteSettingsAction } from "@/actions/site";
import { getMeAction } from "@/actions/auth";
import { redirect } from "next/navigation";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";
import { SiteSettingsToggles } from "@/components/admin/site-settings-toggles";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "مدیریت نظرات و تنظیمات سایت | فستمنو",
};

export default async function TestimonialsPage() {
  const user = await getMeAction();
  if (!user) redirect("/auth/login");

  const [testimonials, settings] = await Promise.all([
    getAllTestimonialsAction(),
    getSiteSettingsAction(),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <Link
          href="/admin"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowRight className="size-3.5" />
          بازگشت به داشبورد
        </Link>
        <h1 className="text-2xl font-bold text-foreground">
          نظرات و تنظیمات سایت
        </h1>
        <p className="text-sm text-muted-foreground">
          مدیریت نظرات مشتریان و بخش‌های صفحه اصلی
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground">تنظیمات نمایش</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          نمایش یا مخفی کردن بخش‌های صفحه اصلی
        </p>
        <SiteSettingsToggles
          showSocialProof={settings.showSocialProof}
          showTestimonials={settings.showTestimonials}
        />
      </section>

      <Separator className="my-6" />

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          نظرات مشتریان
        </h2>
        <TestimonialsManager testimonials={testimonials} />
      </section>
    </main>
  );
}
