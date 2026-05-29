"use client";

import { Menu, Search, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <a href="/" className="text-xl font-bold text-foreground">
          فستمنو
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          <a
            href="/restaurants"
            className="transition-colors hover:text-foreground"
          >
            منوها
          </a>
          <a href="/dolopi" className="transition-colors hover:text-foreground">
            نمونه منو
          </a>
          <a
            href="#features"
            className="transition-colors hover:text-foreground"
          >
            ویژگی‌ها
          </a>
          <a href="#faq" className="transition-colors hover:text-foreground">
            سوالات متداول
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {/* Desktop search */}
          <form
            ref={formRef}
            action="/restaurants"
            method="get"
            className="hidden items-center sm:flex"
          >
            <div className="relative">
              <Search className="absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                name="q"
                placeholder="جستجوی رستوران..."
                className="h-8 w-48 rounded-lg border border-input bg-background pr-8 pl-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
              />
            </div>
          </form>

          <Button
            size="sm"
            className="hidden sm:inline-flex"
            render={<a href="/auth/login?action=signup" />}
          >
            شروع رایگان
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
            render={<a href="/auth/login" />}
          >
            ورود
          </Button>

          {/* Mobile: search toggle */}
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="جستجو"
          >
            <Search className="size-4" />
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="منو"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <form
          action="/restaurants"
          method="get"
          className="border-t border-border/50 bg-background px-4 pb-3 pt-2 sm:hidden"
        >
          <div className="relative">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              name="q"
              placeholder="جستجوی رستوران..."
              autoFocus
              className="h-10 w-full rounded-xl border border-input bg-background pr-10 pl-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
            />
          </div>
        </form>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/50 bg-background px-4 pb-4 pt-2 sm:hidden">
          <nav className="flex flex-col gap-1">
            <a
              href="/restaurants"
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              منوها
            </a>
            <a
              href="/dolopi"
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              مشاهده نمونه منو
            </a>
            <a
              href="#features"
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              ویژگی‌ها
            </a>
            <a
              href="#faq"
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              سوالات متداول
            </a>
            <div className="my-1 border-t border-border/50" />
            <Button
              size="sm"
              className="w-full"
              render={<a href="/auth/login?action=signup" />}
              onClick={() => setMobileOpen(false)}
            >
              شروع رایگان
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              render={<a href="/auth/login" />}
              onClick={() => setMobileOpen(false)}
            >
              ورود به پنل
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
