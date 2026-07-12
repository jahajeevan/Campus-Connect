"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Leaf,
  MapPin,
  Search,
  SearchX,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AvailabilityBadge,
  DietaryMark,
} from "@/components/menu/indicators";
import { Reveal } from "@/components/ui/reveal";
import { useCanteenBySlug, useMenu } from "@/lib/hooks/queries";
import { cn, formatHours, formatPrice, timeAgo } from "@/lib/utils";
import type { Category, FoodItem } from "@/lib/types";

export function MenuView({ slug }: { slug: string }) {
  const { data: canteen, isLoading: loadingCanteen } = useCanteenBySlug(slug);
  const { data: menu, isLoading: loadingMenu } = useMenu(canteen?.id);

  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [vegOnly, setVegOnly] = useState(false);

  const grouped = useMemo(() => {
    if (!menu) return [];
    const q = query.trim().toLowerCase();
    return menu.categories
      .filter((c) => (activeCat ? c.id === activeCat : true))
      .map((category) => ({
        category,
        items: menu.items.filter(
          (item) =>
            item.categoryId === category.id &&
            (!vegOnly || item.dietary === "veg") &&
            (q === "" ||
              item.name.toLowerCase().includes(q) ||
              (item.description ?? "").toLowerCase().includes(q)),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [menu, query, activeCat, vegOnly]);

  const availableCount =
    menu?.items.filter((i) => i.availability === "available").length ?? 0;
  const isFiltering = query.trim() !== "" || activeCat !== null || vegOnly;

  if (loadingCanteen) return <MenuHeaderSkeleton />;

  if (!canteen) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-cream text-ink-subtle">
          <SearchX className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-2xl font-medium text-ink">Canteen not found</h1>
        <p className="mt-2 text-ink-muted">
          We couldn&rsquo;t find a canteen at that address.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all canteens
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* --------------------------- Canteen header --------------------------- */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 bg-aurora opacity-70" />
        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-8 sm:px-6">
          <Link
            href="/#canteens"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            All canteens
          </Link>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {canteen.name}
                </h1>
                <StatusPill isOpen={canteen.isOpen} />
              </div>
              <p className="mt-2 max-w-xl text-pretty text-ink-muted">
                {canteen.tagline}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-ink-subtle" />
                  {canteen.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-ink-subtle" />
                  {formatHours(canteen.opensAt, canteen.closesAt)}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2.5 rounded-2xl border border-line bg-surface px-4 py-3 shadow-soft">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-available-soft text-available">
                <UtensilsCrossed className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <p className="text-lg font-semibold text-ink">
                  {availableCount}
                  <span className="text-sm font-normal text-ink-subtle">
                    {" "}
                    available
                  </span>
                </p>
                <p className="text-xs text-ink-subtle">
                  Updated {timeAgo(canteen.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {!canteen.isOpen && (
            <div className="mt-5 rounded-xl border border-soon/20 bg-soon-soft px-4 py-3 text-sm text-soon">
              This canteen is currently closed. The menu below is shown for
              reference — availability may change when it reopens.
            </div>
          )}
        </div>
      </section>

      {/* ----------------------------- Sticky toolbar ----------------------------- */}
      <div className="sticky top-16 z-30 border-b border-line/80 glass">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dishes…"
                aria-label="Search the menu"
                className="pl-10"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-ink-subtle hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <FilterPill
                active={activeCat === null}
                onClick={() => setActiveCat(null)}
              >
                All
              </FilterPill>
              {menu?.categories.map((cat) => (
                <FilterPill
                  key={cat.id}
                  active={activeCat === cat.id}
                  onClick={() =>
                    setActiveCat(activeCat === cat.id ? null : cat.id)
                  }
                >
                  {cat.name}
                </FilterPill>
              ))}
              <span className="mx-1 h-5 w-px shrink-0 bg-line" />
              <FilterPill
                active={vegOnly}
                onClick={() => setVegOnly((v) => !v)}
                tone="veg"
              >
                <Leaf className="h-3.5 w-3.5" />
                Veg
              </FilterPill>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------- Menu body ------------------------------- */}
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        {loadingMenu ? (
          <MenuListSkeleton />
        ) : grouped.length === 0 ? (
          <EmptyMenu filtering={isFiltering} />
        ) : (
          <div className="space-y-10">
            {grouped.map(({ category, items }, idx) => (
              <Reveal key={category.id} delay={Math.min(idx, 4) * 70}>
                <CategorySection category={category} items={items} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* -------------------------------- pieces --------------------------------- */

function CategorySection({
  category,
  items,
}: {
  category: Category;
  items: FoodItem[];
}) {
  return (
    <section aria-labelledby={`cat-${category.id}`}>
      <div className="mb-4 flex items-center gap-3">
        <h2
          id={`cat-${category.id}`}
          className="text-xl font-medium tracking-tight text-ink"
        >
          {category.name}
        </h2>
        <span className="h-px flex-1 bg-line" />
        <Badge tone="neutral" size="sm">
          {items.length}
        </Badge>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <MenuItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function MenuItemRow({ item }: { item: FoodItem }) {
  const soldOut = item.availability === "sold_out";
  return (
    <article
      className={cn(
        "flex items-start justify-between gap-4 rounded-2xl border border-line bg-surface p-4 shadow-soft transition-all duration-200",
        soldOut
          ? "opacity-70"
          : "hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <DietaryMark dietary={item.dietary} />
          <h3
            className={cn(
              "truncate font-medium text-ink",
              soldOut && "text-ink-muted",
            )}
          >
            {item.name}
          </h3>
        </div>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-sm text-ink-muted text-pretty">
            {item.description}
          </p>
        )}
        <div className="mt-2.5">
          <AvailabilityBadge availability={item.availability} />
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p
          className={cn(
            "text-lg font-semibold tabular-nums text-ink",
            soldOut && "text-ink-subtle",
          )}
        >
          {formatPrice(item.price)}
        </p>
      </div>
    </article>
  );
}

function FilterPill({
  active,
  onClick,
  children,
  tone = "default",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tone?: "default" | "veg";
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
        active
          ? tone === "veg"
            ? "border-available bg-available-soft text-available"
            : "border-primary bg-primary text-primary-foreground"
          : "border-line-strong bg-surface text-ink-muted hover:bg-cream hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function StatusPill({ isOpen }: { isOpen: boolean }) {
  return (
    <Badge tone={isOpen ? "available" : "neutral"} className="shrink-0">
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isOpen ? "bg-available animate-pulse" : "bg-ink-subtle",
        )}
      />
      {isOpen ? "Open now" : "Closed"}
    </Badge>
  );
}

function EmptyMenu({ filtering }: { filtering: boolean }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-cream text-ink-subtle">
        <SearchX className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-lg font-medium text-ink">
        {filtering ? "No dishes match your filters" : "Menu coming soon"}
      </h3>
      <p className="mt-2 text-sm text-ink-muted">
        {filtering
          ? "Try clearing the search or switching categories."
          : "This canteen hasn’t published its menu yet. Check back shortly."}
      </p>
    </div>
  );
}

/* ------------------------------- skeletons ------------------------------- */

function MenuHeaderSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-5 h-10 w-64" />
      <Skeleton className="mt-3 h-4 w-80" />
      <MenuListSkeleton />
    </div>
  );
}

function MenuListSkeleton() {
  return (
    <div className="mt-8 space-y-8">
      {Array.from({ length: 2 }).map((_, s) => (
        <div key={s}>
          <Skeleton className="h-6 w-40" />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-line bg-surface p-4"
              >
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-2 h-4 w-56" />
                <Skeleton className="mt-3 h-5 w-24 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
