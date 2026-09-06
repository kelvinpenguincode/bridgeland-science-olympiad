import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { supabaseAnonKey, supabaseUrl } from "./env";

/**
 * Server-side Supabase client for use inside Server Components, Server
 * Actions, and Route Handlers. Reads/writes the auth session via cookies.
 *
 * NOTE: `cookies()` is async in Next.js 16 — always `await` this factory.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component render — the proxy (middleware)
          // will refresh the session cookie on the next request instead.
        }
      },
    },
  });
}
