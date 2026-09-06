import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * PKCE code-exchange callback — used for OAuth providers (e.g. a future
 * "Sign in with Google" button) via `signInWithOAuth`.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Could not authenticate. Please try again.")}`);
}
