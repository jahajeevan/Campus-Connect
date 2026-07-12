"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, ExternalLink, LayoutDashboard, LogOut, Shield } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import { initials } from "@/lib/utils";

export function AppHeader() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    router.push("/");
  };

  if (!user) return null;
  const isAdmin = user.role === "admin";

  return (
    <header className="sticky top-0 z-40 border-b border-line glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href={isAdmin ? "/admin" : "/dashboard"} className="rounded-lg">
            <Logo priority />
          </Link>
          <Badge tone={isAdmin ? "primary" : "gold"} size="sm" className="hidden sm:inline-flex">
            {isAdmin ? "Super Admin" : "Staff"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/"
            className="hidden items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-cream hover:text-ink sm:inline-flex"
          >
            <ExternalLink className="h-4 w-4" />
            View site
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-2.5 shadow-soft transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {initials(user.name)}
              </span>
              <span className="hidden text-sm font-medium text-ink sm:inline">
                {user.name.split(" ")[0]}
              </span>
              <ChevronDown className="h-4 w-4 text-ink-subtle" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-ink">
                    {user.name}
                  </span>
                  <span className="text-xs text-ink-subtle">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={isAdmin ? "/admin" : "/dashboard"}>
                  {isAdmin ? <Shield /> : <LayoutDashboard />}
                  {isAdmin ? "Admin console" : "Dashboard"}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/">
                  <ExternalLink />
                  View public site
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive onSelect={handleSignOut}>
                <LogOut />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
