import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Next.js 16 network-boundary hook (formerly `middleware.ts`). Keeps the
 * Supabase auth session cookie fresh on every request. Route-level
 * authorization still happens in layouts/pages/Server Actions and, most
 * importantly, in Postgres Row Level Security — this file is not a
 * security boundary by itself.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
