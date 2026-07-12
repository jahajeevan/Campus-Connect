"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LayoutDashboard, LogIn } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/#canteens", label: "Canteens" },
  { href: "/#how", label: "How it works" },
  { href: "/#about", label: "About" },
];

export function SiteHeader() {
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40">
      <div
        className={cn(
          "transition-all duration-300",
          scrolled
            ? "glass border-b border-line/80"
            : "border-b border-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="Campus Connect home" className="rounded-lg">
            <Logo priority />
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Primary"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-cream hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {loading ? (
              <div
                className="h-9 w-9 rounded-full border border-line bg-cream/60 sm:w-[104px]"
                aria-hidden
              />
            ) : user ? (
              <Button asChild size="sm" variant="secondary">
                <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm" variant="secondary">
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Staff Login</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
