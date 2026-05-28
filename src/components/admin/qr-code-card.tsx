"use client";

import { QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QrCodeCard({ slug }: { slug: string }) {
  const url = `https://fmnu.ir/${slug}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <QrCode className="size-4" />
          QR کد
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3">
        <img src={qrUrl} alt="QR Code" className="size-48 rounded-lg" />
        <p dir="ltr" className="font-mono text-xs text-muted-foreground">
          {url}
        </p>
        <a
          href={qrUrl}
          download={`qr-${slug}.png`}
          className="text-xs text-primary underline"
        >
          دانلود QR کد
        </a>
      </CardContent>
    </Card>
  );
}
