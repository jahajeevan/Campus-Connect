"use client";

import Link from "next/link";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { AvailabilityBadge, DietaryMark } from "@/components/menu/indicators";
import { useCanteenSummaries, useMenu } from "@/lib/hooks/queries";
import { cn, formatPrice, timeAgo } from "@/lib/utils";

/**
 * The hero's signature element: a live menu card pulled straight from the
 * database, so the first thing a visitor sees IS the product working.
 */
export function HeroPreview() {
  const { data: canteens } = useCanteenSummaries();
  const featured =
    canteens?.find((c) => c.isOpen && c.availableCount > 0) ?? canteens?.[0];
  const { data: menu } = useMenu(featured?.id);

  if (!featured || !menu) return <PreviewSkeleton />;

  // A realistic snapshot: a few available items plus one sold-out, if present.
  const available = menu.items.filter((i) => i.availability === "available");
  const notAvailable = menu.items.filter((i) => i.availability !== "available");
  const items = [...available.slice(0, 4), ...notAvailable.slice(0, 1)].slice(0, 5);

  return (
    <div className="relative">
      {/* soft stacked card behind for depth */}
      <div
        aria-hidden
        className="absolute inset-x-6 -bottom-4 top-8 rounded-[26px] border border-line bg-surface/70 shadow-card"
      />
      <div className="relative overflow-hidden rounded-[26px] border border-line bg-surface/90 shadow-elevated backdrop-blur-sm">
        {/* header */}
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-medium text-ink">
              {featured.name}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-subtle">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{featured.location}</span>
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-available-soft px-2.5 py-1 text-xs font-medium text-available">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-available opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-available" />
            </span>
            Live
          </span>
        </div>

        {/* items */}
        <ul className="divide-y divide-line">
          {items.map((item) => {
            const soldOut = item.availability === "sold_out";
            return (
              <li
                key={item.id}
                className={cn(
                  "flex items-center justify-between gap-3 px-5 py-3",
                  soldOut && "opacity-60",
                )}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <DietaryMark dietary={item.dietary} />
                  <span className="truncate text-sm font-medium text-ink">
                    {item.name}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <AvailabilityBadge availability={item.availability} size="sm" />
                  <span className="w-12 text-right text-sm font-semibold tabular-nums text-ink">
                    {formatPrice(item.price)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        {/* footer */}
        <Link
          href={`/canteen/${featured.slug}`}
          className="group flex items-center justify-between border-t border-line bg-ivory px-5 py-3 transition-colors hover:bg-cream"
        >
          <span className="flex items-center gap-1.5 text-xs text-ink-subtle">
            <Clock className="h-3.5 w-3.5" />
            Updated {timeAgo(featured.lastUpdated)}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            See full menu
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}

function PreviewSkeleton() {
  return (
    <div className="overflow-hidden rounded-[26px] border border-line bg-surface shadow-elevated">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div className="space-y-2">
          <div className="skeleton h-5 w-36 rounded-md" />
          <div className="skeleton h-3 w-44 rounded-md" />
        </div>
        <div className="skeleton h-6 w-14 rounded-full" />
      </div>
      <div className="divide-y divide-line">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3.5">
            <div className="skeleton h-4 w-32 rounded-md" />
            <div className="skeleton h-4 w-16 rounded-md" />
          </div>
        ))}
      </div>
      <div className="h-11 bg-ivory" />
    </div>
  );
}
