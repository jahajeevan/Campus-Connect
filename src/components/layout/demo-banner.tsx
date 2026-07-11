import { Sparkles } from "lucide-react";
import { dataMode } from "@/lib/data";

/** Slim notice shown only when the app runs on the in-browser demo backend. */
export function DemoBanner() {
  if (dataMode !== "demo") return null;
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-medium sm:text-[0.8125rem]">
        <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>
          Live interactive demo — sample data is stored in your browser. Connect
          Supabase to go production.
        </span>
      </div>
    </div>
  );
}
