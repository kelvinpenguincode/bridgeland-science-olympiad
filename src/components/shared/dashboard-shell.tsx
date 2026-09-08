"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Logo, LogoMark } from "@/components/shared/logo";
import { UserMenu, type NavbarProfile } from "@/components/layout/user-menu";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { cn } from "@/lib/utils";

export interface SidebarNavItem {
  href: string;
  label: string;
  /** Lucide icon name (resolved client-side) — keep this a plain string so
   *  these nav configs stay serializable across the server/client boundary. */
  icon: string;
  exact?: boolean;
}

export interface SidebarNavSection {
  label?: string;
  items: SidebarNavItem[];
}

function isActivePath(pathname: string, item: SidebarNavItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function SidebarNav({ sections, onNavigate }: { sections: SidebarNavSection[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
      {sections.map((section, i) => (
        <div key={section.label ?? i} className="space-y-1">
          {section.label && (
            <p className="px-2.5 pb-1 text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
              {section.label}
            </p>
          )}
          {section.items.map((item) => {
            const active = isActivePath(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                  active ? "bg-brand-orange text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <DynamicIcon name={item.icon} className="size-4 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function DashboardShell({
  sections,
  title,
  profile,
  children,
}: {
  sections: SidebarNavSection[];
  title: string;
  profile: NavbarProfile;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col bg-brand-navy lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-4">
          <LogoMark light />
          <span className="font-heading text-sm font-semibold text-white">Bridgeland SciOly</span>
        </div>
        <SidebarNav sections={sections} />
        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            Back to public site
          </Link>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetContent side="left" className="w-72 border-r border-white/10 bg-brand-navy p-0">
                <SheetHeader className="border-b border-white/10">
                  <SheetTitle>
                    <Logo variant="light" />
                  </SheetTitle>
                </SheetHeader>
                <SidebarNav sections={sections} onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation menu"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="size-5" />
              </Button>
            </Sheet>
            <h1 className="font-heading text-base font-semibold text-brand-navy sm:text-lg">{title}</h1>
          </div>
          <UserMenu profile={profile} />
        </header>
        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
