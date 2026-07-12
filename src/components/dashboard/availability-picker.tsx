"use client";

import { CircleCheck, CircleSlash, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Availability } from "@/lib/types";

const OPTIONS: {
  value: Availability;
  label: string;
  icon: React.ElementType;
  segActive: string;
  cardActive: string;
}[] = [
  {
    value: "available",
    label: "Available",
    icon: CircleCheck,
    segActive: "bg-available-soft text-available border-available/30",
    cardActive: "border-available bg-available-soft text-available ring-available/15",
  },
  {
    value: "sold_out",
    label: "Sold Out",
    icon: CircleSlash,
    segActive: "bg-sold-soft text-sold border-sold/30",
    cardActive: "border-sold bg-sold-soft text-sold ring-sold/15",
  },
  {
    value: "coming_soon",
    label: "Coming Soon",
    icon: Clock,
    segActive: "bg-soon-soft text-soon border-soon/30",
    cardActive: "border-soon bg-soon-soft text-soon ring-soon/15",
  },
];

/**
 * Availability selector.
 * - `segmented` (default): compact one-click pill row for the dashboard list.
 * - `cards`: full-width 3-up card grid for forms (never overflows).
 */
export function AvailabilityPicker({
  value,
  onChange,
  disabled,
  size = "md",
  compact = false,
  variant = "segmented",
}: {
  value: Availability;
  onChange: (next: Availability) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  compact?: boolean;
  variant?: "segmented" | "cards";
}) {
  if (variant === "cards") {
    return (
      <div role="radiogroup" aria-label="Availability" className="grid grid-cols-3 gap-2">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              disabled={disabled}
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-all duration-150 disabled:opacity-50",
                isActive
                  ? cn(opt.cardActive, "ring-4 shadow-soft")
                  : "border-line-strong bg-surface text-ink-muted hover:border-line-strong hover:bg-cream",
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              <span className="text-xs font-medium leading-tight">{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Availability"
      className="inline-flex items-center gap-1 rounded-full border border-line bg-canvas p-1"
    >
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={disabled}
            title={opt.label}
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border font-medium transition-all disabled:opacity-50",
              size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
              isActive
                ? opt.segActive
                : "border-transparent text-ink-subtle hover:bg-cream hover:text-ink",
            )}
          >
            <Icon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
            {!compact && <span>{opt.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
