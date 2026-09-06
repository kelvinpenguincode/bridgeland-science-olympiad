"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, LogOut, ShieldCheck, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { canAccessAdmin } from "@/lib/auth/permissions";
import type { AppRole } from "@/types/database";
import { ROLE_LABELS } from "@/types/domain";

export interface NavbarProfile {
  fullName: string;
  preferredName: string | null;
  avatarUrl: string | null;
  role: AppRole;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserMenu({ profile }: { profile: NavbarProfile }) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const displayName = profile.preferredName || profile.fullName;

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button
        size="sm"
        variant="outline"
        className="hidden sm:inline-flex"
        render={<Link href="/dashboard" />}
      >
        <LayoutDashboard className="size-4" data-icon="inline-start" />
        Dashboard
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              aria-label={`Account menu for ${displayName}`}
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
            />
          }
        >
          <Avatar className="size-9 border border-border">
            <AvatarImage src={profile.avatarUrl ?? undefined} alt="" />
            <AvatarFallback className="bg-brand-navy text-xs font-semibold text-white">
              {initials(displayName)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col gap-0.5 px-2 py-1.5">
            <span className="text-sm font-medium text-foreground">{displayName}</span>
            <span className="text-xs text-muted-foreground">{ROLE_LABELS[profile.role]}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/dashboard" />}>
            <LayoutDashboard className="size-4" />
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
            <User className="size-4" />
            Profile & Settings
          </DropdownMenuItem>
          {canAccessAdmin(profile.role) && (
            <DropdownMenuItem render={<Link href="/admin" />}>
              <ShieldCheck className="size-4" />
              Admin Panel
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleSignOut} disabled={signingOut}>
            <LogOut className="size-4" />
            {signingOut ? "Signing out…" : "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
