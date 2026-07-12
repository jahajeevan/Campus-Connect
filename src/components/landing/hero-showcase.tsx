"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { AvailabilityBadge, DietaryMark } from "@/components/menu/indicators";
import { useCanteenSummaries, useMenu } from "@/lib/hooks/queries";
import { cn, formatPrice, timeAgo } from "@/lib/utils";
import type { CanteenSummary } from "@/lib/types";

const ROTATE_MS = 4200;

/**
 * The hero signature: all three canteens as live menu cards that cross-fade
 * automatically, so the landing quietly shows the whole campus updating.
 */
export function HeroShowcase() {
  const { data: canteens } = useCanteenSummaries();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = canteens?.length ?? 0;

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % count),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, [paused, count]);

  if (!canteens || canteens.length === 0) return <ShowcaseSkeleton />;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* stacked card behind for depth */}
      <div
        aria-hidden
        className="absolute inset-x-6 -bottom-4 top-8 rounded-[26px] border border-line bg-surface/60 shadow-card"
      />

      <div className="relative min-h-[340px] sm:min-h-[356px]">
        {canteens.map((canteen, i) => (
          <CanteenSlide key={canteen.id} canteen={canteen} active={i === active} />
        ))}
      </div>

      {/* indicator dots */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {canteens.map((canteen, i) => (
          <button
            key={canteen.id}
            type="button"
            aria-label={`Show ${canteen.name}`}
            aria-current={i === active}
            onClick={() => setActive(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === active
                ? "w-6 bg-primary"
                : "w-1.5 bg-line-strong hover:bg-ink-subtle",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function CanteenSlide({
  canteen,
  active,
}: {
  canteen: CanteenSummary;
  active: boolean;
}) {
  const { data: menu } = useMenu(canteen.id);

  const items = (() => {
    if (!menu) return [];
    const avail = menu.items.filter((i) => i.availability === "available");
    const rest = menu.items.filter((i) => i.availability !== "available");
    return [...avail.slice(0, 4), ...rest.slice(0, 1)].slice(0, 5);
  })();

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden rounded-[26px] border border-line bg-surface/90 shadow-elevated backdrop-blur-sm transition-all duration-500 ease-out-soft",
        active
          ? "z-10 translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-2 scale-[0.97] opacity-0",
      )}
      aria-hidden={!active}
    >
      <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-medium text-ink">
            {canteen.name}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-subtle">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{canteen.location}</span>
          </p>
        </div>
        <StatusPill isOpen={canteen.isOpen} />
      </div>

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

      <Link
        href={`/canteen/${canteen.slug}`}
        className="group flex items-center justify-between border-t border-line bg-ivory px-5 py-3 transition-colors hover:bg-cream"
      >
        <span className="flex items-center gap-1.5 text-xs text-ink-subtle">
          <Clock className="h-3.5 w-3.5" />
          Updated {timeAgo(canteen.lastUpdated)}
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
          See full menu
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </Link>
    </div>
  );
}

function StatusPill({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        isOpen ? "bg-available-soft text-available" : "bg-cream text-ink-subtle",
      )}
    >
      {isOpen ? (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-available opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-available" />
        </span>
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-ink-subtle" />
      )}
      {isOpen ? "Live" : "Closed"}
    </span>
  );
}

function ShowcaseSkeleton() {
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
