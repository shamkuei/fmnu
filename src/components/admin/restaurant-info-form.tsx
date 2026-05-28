"use client";

import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateRestaurantAction } from "@/actions/restaurants";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  brandText: string | null;
  description: string | null;
  logoUrl: string | null;
  heroImageUrl: string | null;
  address: string | null;
  phone: string | null;
  socialMedia: Record<string, string> | null;
  isAvailable: boolean;
};

export function RestaurantInfoForm({ restaurant }: { restaurant: Restaurant }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState(restaurant.name);
  const [brandText, setBrandText] = useState(restaurant.brandText ?? "");
  const [description, setDescription] = useState(restaurant.description ?? "");
  const [logoUrl, setLogoUrl] = useState(restaurant.logoUrl ?? "");
  const [heroImageUrl, setHeroImageUrl] = useState(
    restaurant.heroImageUrl ?? "",
  );
  const [address, setAddress] = useState(restaurant.address ?? "");
  const [phone, setPhone] = useState(restaurant.phone ?? "");
  const [isAvailable, setIsAvailable] = useState(restaurant.isAvailable);
  const [socialInstagram, setSocialInstagram] = useState(
    restaurant.socialMedia?.instagram ?? "",
  );
  const [socialTelegram, setSocialTelegram] = useState(
    restaurant.socialMedia?.telegram ?? "",
  );
  const [socialWhatsapp, setSocialWhatsapp] = useState(
    restaurant.socialMedia?.whatsapp ?? "",
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const socialMedia: Record<string, string> = {};
    if (socialInstagram.trim()) socialMedia.instagram = socialInstagram.trim();
    if (socialTelegram.trim()) socialMedia.telegram = socialTelegram.trim();
    if (socialWhatsapp.trim()) socialMedia.whatsapp = socialWhatsapp.trim();

    try {
      await updateRestaurantAction({
        restaurantId: restaurant.id,
        name: name.trim(),
        brandText: brandText.trim() || null,
        description: description.trim() || null,
        logoUrl: logoUrl.trim() || null,
        heroImageUrl: heroImageUrl.trim() || null,
        address: address.trim() || null,
        phone: phone.trim() || null,
        socialMedia: Object.keys(socialMedia).length > 0 ? socialMedia : null,
        isAvailable,
      });
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ذخیره تغییرات");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
          تغییرات با موفقیت ذخیره شد
        </div>
      )}

      {/* Basic Info */}
      <section className="space-y-4">
        <h3 className="font-semibold text-foreground">اطلاعات اصلی</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">نام رستوران</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">توضیحات</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div>
            <p className="font-medium text-foreground">وضعیت فعالیت</p>
            <p className="text-xs text-muted-foreground">
              {isAvailable
                ? "رستوران فعال است و منو نمایش داده میشه"
                : "رستوران غیرفعال است"}
            </p>
          </div>
          <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
        </div>
      </section>

      <Separator />

      {/* Images */}
      <section className="space-y-4">
        <h3 className="font-semibold text-foreground">تصاویر</h3>
        <div className="flex gap-6">
          <ImageUploader
            label="لوگو"
            value={logoUrl}
            onChange={setLogoUrl}
          />
          <div className="flex-1">
            <ImageUploader
              label="تصویر اصلی"
              value={heroImageUrl}
              onChange={setHeroImageUrl}
              className="w-full"
            />
            {heroImageUrl && (
              <img
                src={heroImageUrl}
                alt="تصویر اصلی"
                className="mt-2 h-32 w-full rounded-lg object-cover"
              />
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* Contact */}
      <section className="space-y-4">
        <h3 className="font-semibold text-foreground">اطلاعات تماس</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="address">آدرس</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              placeholder="آدرس رستوران"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">شماره تماس</Label>
            <Input
              id="phone"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="02112345678"
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Social Media */}
      <section className="space-y-4">
        <h3 className="font-semibold text-foreground">شبکه‌های اجتماعی</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="instagram">اینستاگرام</Label>
            <Input
              id="instagram"
              dir="ltr"
              value={socialInstagram}
              onChange={(e) => setSocialInstagram(e.target.value)}
              placeholder="@username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telegram">تلگرام</Label>
            <Input
              id="telegram"
              dir="ltr"
              value={socialTelegram}
              onChange={(e) => setSocialTelegram(e.target.value)}
              placeholder="@username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">واتساپ</Label>
            <Input
              id="whatsapp"
              dir="ltr"
              value={socialWhatsapp}
              onChange={(e) => setSocialWhatsapp(e.target.value)}
              placeholder="09121234567"
            />
          </div>
        </div>
      </section>

      <Separator />

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <Save />}
          {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </Button>
      </div>
    </form>
  );
}
