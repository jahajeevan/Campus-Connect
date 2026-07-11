import Link from "next/link";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="pointer-events-none absolute inset-0 bg-aurora" />
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="relative">
        <Logo subtitle className="justify-center" />
        <div className="mx-auto mt-10 grid h-16 w-16 place-items-center rounded-2xl bg-cream text-ink-subtle">
          <UtensilsCrossed className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-ink">
          Page not found
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-ink-muted">
          The page you&rsquo;re looking for isn&rsquo;t on the menu. Let&rsquo;s
          get you back to the canteens.
        </p>
        <Button asChild className="mt-7">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
        </Button>
      </div>
    </main>
  );
}
