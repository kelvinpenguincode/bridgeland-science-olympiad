import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { supabaseServiceRoleKey, supabaseUrl } from "./env";

/**
 * Service-role Supabase client. Bypasses Row Level Security entirely —
 * use ONLY in trusted server-side code (Server Actions / Route Handlers)
 * for operations that legitimately require elevated privilege, such as
 * an admin inviting a new member by email. Never import this into a
 * Client Component or expose the service role key to the browser.
 */
export function createAdminClient() {
  if (!supabaseServiceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local to enable admin-only operations like member invitations."
    );
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
