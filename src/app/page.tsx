import type { Metadata } from "next";
import {
  ArrowLeft,
  ChevronDown,
  Clock,
  LayoutGrid,
  Palette,
  QrCode,
  Smartphone,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/landing-navbar";

export const metadata: Metadata = {
  title: "فستمنو — منوی دیجیتال رایگان رستوران | ساخت منوی آنلاین با QR کد",
  description:
    "با فستمنو منوی دیجیتال رستورانت رو تو چند دقیقه بساز. QR کد هوشمند، آپدیت آنی، طراحی موبایل‌محور. کاملاً رایگان و بدون نیاز به نصب.",
  openGraph: {
    title: "فستمنو — منوی دیجیتال رایگان رستوران",
    description:
      "منوی رستورانت رو آنلاین بساز، با QR کد در اختیار مشتری‌ها بذار و هر لحظه آپدیت کن.",
    type: "website",
    locale: "fa_IR",
    siteName: "فستمنو",
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
          <Zap className="size-3" />
          رایگان و بدون نیاز به نصب
        </div>
        <h1 className="mb-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          منوی دیجیتال رستورانت رو
          <br />
          <span className="text-muted-foreground">تو چند دقیقه بساز</span>
        </h1>
        <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
          با فستمنو منوی رستورانت رو به صورت آنلاین بساز، با QR کد در اختیار
          مشتری‌ها بذار و هر لحظه آپدیت کن.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" nativeButton={false} render={<a href="/auth/login?action=signup" />}>
            شروع رایگان
            <ArrowLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            render={<a href="/dolopi" />}
          >
            مشاهده نمونه منو
          </Button>
          <Button
            variant="ghost"
            size="lg"
            nativeButton={false}
            render={<a href="#how-it-works" />}
          >
            بیشتر بدانید
          </Button>
        </div>

        {/* Hero mockup */}
        <div className="relative mx-auto mt-16 w-full max-w-sm">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/5">
            <div className="bg-primary/5 p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-lg font-bold">
                  د
                </div>
                <div className="text-right">
                  <div className="font-bold text-foreground">رستوران دلوپی</div>
                  <div className="text-xs text-muted-foreground">
                    منوی آنلاین
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3 p-4">
              {[
                "همبرگر کلاسیک",
                "پنیربرگر ویژه",
                "سیب‌زمینی سرخ‌کرده",
                "نوشابه",
              ].map((item, i) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-xl border border-border bg-background p-3"
                >
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {item}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(185 + i * 35).toLocaleString("fa-IR")} تومان
                    </div>
                  </div>
                  <div className="size-10 rounded-lg bg-muted" />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-3 left-1/2 -z-10 h-12 w-3/4 -translate-x-1/2 rounded-full bg-primary/10 blur-2xl" />
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-t border-border/50 py-12">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-foreground sm:text-4xl">
                +۵۰۰
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                رستوران فعال
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground sm:text-4xl">
                +۱۰,۰۰۰
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                بازدید روزانه
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground sm:text-4xl">
                ۹۸٪
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                رضایت مشتری
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
              رستوران‌دارها چی می‌گن؟
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <TestimonialCard
              name="علی محمدی"
              role="رستوران برگرلند"
              text="از وقتی فستمنو رو شروع کردیم، مشتری‌ها خیلی راحت‌تر منو رو می‌بینن. دیگه نیازی به چاپ مجدد منو نیست."
              rating={5}
            />
            <TestimonialCard
              name="سارا احمدی"
              role="کافه بیسترو"
              text="واقعاً ساده و کاربردیه. منوی کافه رو تو ۱۰ دقیقه تنظیم کردم و QR کد رو همون روز روی میزها گذاشتیم."
              rating={5}
            />
            <TestimonialCard
              name="رضا کریمی"
              role="فست‌فود دونر"
              text="قیمت‌ها رو هر روز آپدیت می‌کنیم و فوراً روی منوی آنلاین اعمال میشه. پشتیبانیش هم عالیه."
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-t border-border/50 bg-muted/30 py-20"
      >
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
              چرا فستمنو؟
            </h2>
            <p className="text-muted-foreground">
              مدیریت منوی رستوران هیچ‌وقت اینقدر ساده نبوده
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<QrCode className="size-5" />}
              title="QR کد هوشمند"
              description="با اسکن QR کد، مشتری‌ها مستقیم منوی رستوران رو روی گوشیشون ببینن."
            />
            <FeatureCard
              icon={<Clock className="size-5" />}
              title="آپدیت آنی"
              description="قیمت‌ها و آیتم‌های منو رو هر لحظه تغییر بده، بلافاصله برای همه مشتری‌ها اعمال میشه."
            />
            <FeatureCard
              icon={<Palette className="size-5" />}
              title="شخصی‌سازی تم"
              description="رنگ‌ها و استایل منو رو مطابق با برند رستورانت تنظیم کن."
            />
            <FeatureCard
              icon={<Smartphone className="size-5" />}
              title="طراحی موبایل‌محور"
              description="منو برای نمایش روی موبایل بهینه شده و تجربه کاربری عالی داره."
            />
            <FeatureCard
              icon={<LayoutGrid className="size-5" />}
              title="دسته‌بندی منو"
              description="آیتم‌ها رو دسته‌بندی کن تا مشتری‌ها راحت‌تر پیداشون کنن."
            />
            <FeatureCard
              icon={<Users className="size-5" />}
              title="مدیریت چند کاربره"
              description="چند نفر از تیمت رو به عنوان ادمین اضافه کن و با هم منو رو مدیریت کنید."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
              چطور کار می‌کنه؟
            </h2>
            <p className="text-muted-foreground">
              تو سه قدم ساده منوت رو آنلاین کن
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            <StepCard
              step="۱"
              title="ثبت‌نام کن"
              description="با شماره موبایل وارد پنل مدیریت شو."
            />
            <StepCard
              step="۲"
              title="منو رو بساز"
              description="دسته‌بندی‌ها و آیتم‌های منو رو اضافه کن و قیمت‌ها رو مشخص کن."
            />
            <StepCard
              step="۳"
              title="QR کد رو بگیر"
              description="QR کد اختصاصی رو چاپ کن و روی میزها بذار. تمومه!"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border/50 py-20">
        <div className="mx-auto max-w-2xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
              سوالات متداول
            </h2>
            <p className="text-muted-foreground">
              پاسخ سوالات رایج رو اینجا ببینید
            </p>
          </div>
          <div className="space-y-3">
            <FaqItem
              question="واقعاً رایگانه؟"
              answer="بله! استفاده از فستمنو کاملاً رایگانه. ثبت‌نام، ساخت منو، QR کد و آپدیت‌های نامحدود بدون هیچ هزینه‌ای انجام میشه."
            />
            <FaqItem
              question="نیاز به اپلیکیشن داره؟"
              answer="خیر. فستمنو وب‌محوره و مشتری‌ها فقط با اسکن QR کد، منو رو تو مرورگر گوشیشون می‌بینن. هیچ نیازی به نصب اپلیکیشن نیست."
            />
            <FaqItem
              question="QR کد چطوری کار می‌کنه؟"
              answer="بعد از ساخت منو، یک QR کد اختصاصی دریافت می‌کنید. اون رو چاپ کنید و روی میزها بگذارید. مشتری‌ها با اسکن مستقیم وارد منو میشن."
            />
            <FaqItem
              question="می‌تونم منو رو هر لحظه تغییر بدم؟"
              answer="بله! از پنل مدیریت می‌تونید قیمت‌ها، آیتم‌ها و دسته‌بندی‌ها رو هر زمان تغییر بدید و تغییرات بلافاصله برای همه مشتری‌ها اعمال میشه."
            />
            <FaqItem
              question="چند نفر می‌تونن منو رو مدیریت کنن؟"
              answer="شما می‌تونید چند نفر از تیم‌تون رو به عنوان ادمین اضافه کنید تا با هم منو رو مدیریت کنید."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:py-20">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            همین الان شروع کن
          </h2>
          <p className="mx-auto mb-8 max-w-md text-primary-foreground/70">
            رایگان ثبت‌نام کن و منوی دیجیتال رستورانت رو تو چند دقیقه بساز.
          </p>
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
            render={<a href="/auth/login?action=signup" />}
          >
            ساخت منوی رایگان
            <ArrowLeft className="size-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between">
          <span className="text-xs text-muted-foreground">
            ساخته شده توسط{" "}
            <a
              href="https://shamkuei.ir"
              className="underline transition-colors hover:text-foreground"
            >
              shamkuei.ir
            </a>{" "}
            برای رستوران‌های ایران
          </span>
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} فستمنو. تمامی حقوق محفوظ است.
          </span>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
      <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
        {step}
      </div>
      <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function TestimonialCard({
  name,
  role,
  text,
  rating,
}: {
  name: string;
  role: string;
  text: string;
  rating: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-3 flex gap-0.5">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        &ldquo;{text}&rdquo;
      </p>
      <div>
        <div className="text-sm font-semibold text-foreground">{name}</div>
        <div className="text-xs text-muted-foreground">{role}</div>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl border border-border bg-card">
      <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 font-medium text-foreground marker:[content:'']">
        {question}
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
        {answer}
      </div>
    </details>
  );
}
