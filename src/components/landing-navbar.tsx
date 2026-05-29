"use client";

import { LayoutDashboard, LogOut, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LandingNavbar({
  user,
}: {
  user: { firstName: string; lastName: string } | null;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : null;

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

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                size="sm"
                nativeButton={false}
                render={<a href="/admin" />}
              >
                <LayoutDashboard className="size-3.5" />
                پنل مدیریت
              </Button>
              <form action="/auth/logout" method="POST">
                <input type="hidden" name="_action" value="logout" />
                <Button
                  variant="ghost"
                  size="sm"
                  type="submit"
                >
                  <LogOut className="size-3.5" />
                  خروج
                </Button>
              </form>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                size="sm"
                nativeButton={false}
                render={<a href="/auth/login?action=signup" />}
              >
                شروع رایگان
              </Button>
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<a href="/auth/login" />}
              >
                ورود
              </Button>
            </div>
          )}

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
            {user ? (
              <>
                <a
                  href="/admin"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard className="size-4" />
                  پنل مدیریت
                </a>
                <form action="/auth/logout" method="POST">
                  <input type="hidden" name="_action" value="logout" />
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <LogOut className="size-4" />
                    خروج ({displayName})
                  </button>
                </form>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  className="w-full"
                  nativeButton={false}
                  render={<a href="/auth/login?action=signup" />}
                  onClick={() => setMobileOpen(false)}
                >
                  شروع رایگان
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  nativeButton={false}
                  render={<a href="/auth/login" />}
                  onClick={() => setMobileOpen(false)}
                >
                  ورود به پنل
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
