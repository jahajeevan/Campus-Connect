import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";
import type { Database } from "./database.types";

/**
 * Privileged Supabase client backed by the **service-role key**.
 *
 * This key bypasses Row-Level Security and can call the Auth admin API, so it
 * must NEVER reach the browser. Only import this from server code (Route
 * Handlers / Server Components) — the key lives in the non-public
 * `SUPABASE_SERVICE_ROLE_KEY` env var and is undefined client-side.
 */
export function getSupabaseAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("The Supabase admin client is server-only.");
  }
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !serviceKey) {
    throw new Error(
      "Supabase admin is not configured — set SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createClient<Database>(SUPABASE_URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
