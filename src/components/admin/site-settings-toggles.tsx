"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateSiteSettingsAction } from "@/actions/site";
import { Switch } from "@/components/ui/switch";

export function SiteSettingsToggles({
  showSocialProof,
  showTestimonials,
}: {
  showSocialProof: boolean;
  showTestimonials: boolean;
}) {
  const router = useRouter();
  const [socialProof, setSocialProof] = useState(showSocialProof);
  const [testimonials, setTestimonials] = useState(showTestimonials);
  const [loading, setLoading] = useState(false);

  async function toggle(key: "showSocialProof" | "showTestimonials", value: boolean) {
    setLoading(true);
    try {
      await updateSiteSettingsAction({ [key]: value });
      if (key === "showSocialProof") setSocialProof(value);
      if (key === "showTestimonials") setTestimonials(value);
      router.refresh();
    } catch {
      if (key === "showSocialProof") setSocialProof(!value);
      if (key === "showTestimonials") setTestimonials(!value);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <div>
          <p className="font-medium text-foreground">آمار سایت</p>
          <p className="text-xs text-muted-foreground">
            نمایش تعداد رستوران‌ها و آمار در صفحه اصلی
          </p>
        </div>
        <Switch
          checked={socialProof}
          onCheckedChange={(v) => toggle("showSocialProof", v)}
          disabled={loading}
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <div>
          <p className="font-medium text-foreground">نظرات مشتریان</p>
          <p className="text-xs text-muted-foreground">
            نمایش بخش نظرات در صفحه اصلی
          </p>
        </div>
        <Switch
          checked={testimonials}
          onCheckedChange={(v) => toggle("showTestimonials", v)}
          disabled={loading}
        />
      </div>
    </div>
  );
}
