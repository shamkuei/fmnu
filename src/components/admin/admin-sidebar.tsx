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

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-52 shrink-0">
        <div className="sticky top-8 space-y-6">
          <div>
            <h1 className="text-lg font-bold text-foreground">{name}</h1>
            <p dir="ltr" className="font-mono text-xs text-muted-foreground">
              fmnu.ir/{slug}
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
            href={`/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-foreground hover:bg-muted"
          >
            <Eye className="size-4" />
            پیش‌نمایش
          </Link>
        </div>
      </aside>

      {/* Mobile nav */}
      <nav className="lg:hidden mb-6 flex gap-1 overflow-x-auto pb-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={basePath + href} className={linkClasses(href)}>
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}
