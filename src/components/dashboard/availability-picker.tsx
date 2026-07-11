"use client";

import { CircleCheck, CircleSlash, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Availability } from "@/lib/types";

const OPTIONS: {
  value: Availability;
  label: string;
  icon: React.ElementType;
  active: string;
}[] = [
  {
    value: "available",
    label: "Available",
    icon: CircleCheck,
    active: "bg-available-soft text-available border-available/30",
  },
  {
    value: "sold_out",
    label: "Sold Out",
    icon: CircleSlash,
    active: "bg-sold-soft text-sold border-sold/30",
  },
  {
    value: "coming_soon",
    label: "Coming Soon",
    icon: Clock,
    active: "bg-soon-soft text-soon border-soon/30",
  },
];

/** Segmented one-click availability control. */
export function AvailabilityPicker({
  value,
  onChange,
  disabled,
  size = "md",
  compact = false,
}: {
  value: Availability;
  onChange: (next: Availability) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  compact?: boolean;
}) {
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
                ? opt.active
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
