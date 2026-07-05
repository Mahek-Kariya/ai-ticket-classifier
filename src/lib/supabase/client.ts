/**
 * supabase/client.ts
 *
 * Singleton Supabase browser client.
 * Reads connection credentials from NEXT_PUBLIC_* environment variables
 * so the client works on both server and client sides of Next.js.
 *
 * If either env var is missing at runtime the module logs a warning
 * and still exports a `supabase` constant — set to `null` — so that
 * dependents can safely guard calls (e.g. `if (!supabase) return`)
 * instead of crashing on import.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ── Environment variable validation ─────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isMissing(val: string | undefined): val is undefined {
  return (
    !val ||
    val === "your_supabase_project_url" ||
    val === "your_supabase_anon_key"
  );
}

// ── Client instantiation ────────────────────────────────────

let supabase: SupabaseClient | null = null;

if (isMissing(supabaseUrl) || isMissing(supabaseAnonKey)) {
  if (typeof window !== "undefined") {
    // Only warn in the browser — server-side renders during build
    // may legitimately lack env vars.
    console.warn(
      "[supabase/client] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY " +
        "is missing or still set to the placeholder value. " +
        "Database features will be unavailable until valid credentials are provided in .env.local.",
    );
  }
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
