"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, LogIn, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { UserMenu, type NavbarProfile } from "./user-menu";
import { GlobalSearch } from "@/components/shared/global-search";
import { NAV_LINKS } from "./nav-links";
import { cn } from "@/lib/utils";

export function NavbarClient({ profile }: { profile: NavbarProfile | null }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo variant="light" />

        <nav aria-label="Primary" className="hidden items-center gap-1 xl:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-3 py-2 text-xs font-medium tracking-[0.14em] text-white/70 uppercase transition-colors hover:text-white",
                isActive(link.href) && "text-white"
              )}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute inset-x-3 -bottom-0.5 h-px bg-brand-orange" aria-hidden="true" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden text-white/80 hover:bg-white/10 hover:text-white sm:inline-flex"
            aria-label="Search the site"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-4" />
          </Button>

          {profile ? (
            <UserMenu profile={profile} />
          ) : (
            <Button
              size="sm"
              className="hidden bg-brand-orange text-white hover:bg-brand-orange-dark sm:inline-flex"
              render={<Link href="/login" />}
            >
              <LogIn className="size-4" data-icon="inline-start" />
              Login
            </Button>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetContent side="right" className="w-[85%] p-0 sm:max-w-sm">
              <SheetHeader className="border-b border-border">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-base font-medium text-slate-200 hover:bg-white/10",
                      isActive(link.href) && "bg-brand-orange/20 text-brand-orange"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-2 border-t border-border pt-4">
                  {profile ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-md bg-brand-navy px-3 py-2.5 text-base font-medium text-white"
                    >
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-md bg-brand-orange px-3 py-2.5 text-base font-medium text-white"
                    >
                      <LogIn className="size-4" />
                      Login
                    </Link>
                  )}
                </div>
              </nav>
            </SheetContent>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 xl:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
          </Sheet>
        </div>
      </div>
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
