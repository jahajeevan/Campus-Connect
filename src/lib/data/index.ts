import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DemoRepository } from "./demo-repository";
import { SupabaseRepository } from "./supabase-repository";
import type { Repository } from "./repository";

let instance: Repository | null = null;

/**
 * Returns the active data repository as a singleton.
 * Supabase when configured, otherwise the in-browser demo backend.
 */
export function getRepository(): Repository {
  if (instance) return instance;
  instance = isSupabaseConfigured
    ? new SupabaseRepository()
    : new DemoRepository();
  return instance;
}

export const dataMode: Repository["mode"] = isSupabaseConfigured
  ? "supabase"
  : "demo";

export type { Repository, PlatformStats } from "./repository";
export { AuthError, NotConfiguredError } from "./repository";
