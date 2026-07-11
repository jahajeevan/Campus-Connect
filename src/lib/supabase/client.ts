import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";
import type { Database } from "./database.types";

let cached: ReturnType<typeof createBrowserClient<Database>> | null = null;

/** Singleton browser Supabase client (safe to call repeatedly). */
export function getSupabaseBrowserClient() {
  if (cached) return cached;
  cached = createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  return cached;
}
