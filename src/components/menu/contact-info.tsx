import { Camera, MessageCircle, Send } from "lucide-react";

type ContactInfoProps = {
  restaurantName: string;
  address: string | null;
  phone: string | null;
  socialMedia: Record<string, string> | null;
};

export function ContactInfo({
  restaurantName,
  address,
  phone,
  socialMedia,
}: ContactInfoProps) {
  if (!address && !phone && !socialMedia) return null;

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      {address && (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">آدرس:</span> {address}
        </p>
      )}
      {phone && (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">تلفن:</span>{" "}
          <span dir="ltr" className="inline-block">
            {phone}
          </span>
        </p>
      )}
      {socialMedia && (
        <div className="flex gap-2 pt-1">
          {socialMedia.instagram && (
            <a
              href={`https://instagram.com/${socialMedia.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <Camera className="size-4" />
              اینستاگرام
            </a>
          )}
          {socialMedia.telegram && (
            <a
              href={`https://t.me/${socialMedia.telegram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <Send className="size-4" />
              تلگرام
            </a>
          )}
          {socialMedia.whatsapp && (
            <a
              href={`https://wa.me/${socialMedia.whatsapp.replace("+", "")}?text=${encodeURIComponent(`سلام، منو ${restaurantName} رو دیدم...`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <MessageCircle className="size-4" />
              واتساپ
            </a>
          )}
        </div>
      )}
    </div>
  );
}
