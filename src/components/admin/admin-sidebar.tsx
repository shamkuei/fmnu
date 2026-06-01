"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Eye,
  LayoutGrid,
  Palette,
  Pencil,
  Settings,
  UtensilsCrossed,
} from "lucide-react";
import { getRestaurantUrl } from "@/lib/urls";

const navItems = [
  { href: "", label: "نمای کلی", icon: LayoutGrid },
  { href: "/menu", label: "منو", icon: UtensilsCrossed },
  { href: "/edit", label: "ویرایش", icon: Pencil },
  { href: "/theme", label: "تم", icon: Palette },
  { href: "/settings", label: "تنظیمات", icon: Settings },
] as const;

export function AdminSidebar({
  restaurantId,
  name,
  slug,
}: {
  restaurantId: string;
  name: string;
  slug: string;
}) {
  const pathname = usePathname();
  const basePath = `/admin/${restaurantId}`;

  function linkClasses(href: string) {
    const isActive = pathname === basePath + href;
    return `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
      isActive
        ? "bg-primary/10 font-medium text-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;
  }

  function mobileLinkClasses(href: string) {
    const isActive = pathname === basePath + href;
    return `flex flex-1 flex-col items-center gap-1 rounded-lg px-1 py-2 text-[0.65rem] transition-colors ${
      isActive
        ? "bg-primary/10 font-medium text-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-52 shrink-0 lg:block">
        <div className="sticky top-8 space-y-6">
          <div>
            <h1 className="text-lg font-bold text-foreground">{name}</h1>
            <p dir="ltr" className="font-mono text-xs text-muted-foreground">
              {getRestaurantUrl(slug).replace("https://", "")}
            </p>
          </div>
          <nav className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={basePath + href} className={linkClasses(href)}>
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>
          <Link
            href={getRestaurantUrl(slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-foreground hover:bg-muted"
          >
            <Eye className="size-4" />
            پیش‌نمایش
          </Link>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur-sm lg:hidden">
        <nav className="flex items-end justify-around px-1 pb-[env(safe-area-inset-bottom)]">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={basePath + href}
              className={mobileLinkClasses(href)}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
