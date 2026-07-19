"use client";

import { Download, QrCode } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRestaurantUrl } from "@/lib/urls";

export function QrCodeCard({ slug }: { slug: string }) {
  const url = getRestaurantUrl(slug);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = qrApiUrl;
    link.download = `qr-${slug}.png`;
    link.click();
  }, [qrApiUrl, slug]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <QrCode className="size-4" />
          QR کد
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3">
        <div className="relative size-48">
          {!loaded && !error && (
            <div className="absolute inset-0 animate-pulse rounded-lg bg-muted" />
          )}
          {error ? (
            <div className="flex size-full items-center justify-center rounded-lg border border-dashed">
              <p className="text-xs text-muted-foreground">
                خطا در بارگذاری QR
              </p>
            </div>
          ) : (
            <img
              src={qrApiUrl}
              alt="QR Code"
              className={`size-48 rounded-lg transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
            />
          )}
        </div>
        <p dir="ltr" className="font-mono text-xs text-muted-foreground">
          {url}
        </p>
        <Button
          variant="ghost"
          size="xs"
          onClick={handleDownload}
          disabled={error}
        >
          <Download className="size-3" />
          دانلود QR کد
        </Button>
      </CardContent>
    </Card>
  );
}
