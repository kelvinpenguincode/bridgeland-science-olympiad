import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { supabaseAnonKey, supabaseUrl } from "./env";

/**
 * Refreshes the Supabase auth session on every request and mirrors the
 * cookie onto both the incoming request and outgoing response. Called
 * from `proxy.ts` (the Next.js 16 successor to `middleware.ts`).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Touch the session so expired tokens are refreshed before Server
  // Components run. Do not remove — required by @supabase/ssr.
  await supabase.auth.getUser();

  return response;
}
