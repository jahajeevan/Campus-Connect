import { CircleCheck, CircleSlash, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AVAILABILITY_META,
  DIETARY_META,
  type Availability,
  type DietaryTag,
} from "@/lib/types";

const ICONS: Record<Availability, React.ElementType> = {
  available: CircleCheck,
  sold_out: CircleSlash,
  coming_soon: Clock,
};

export function AvailabilityBadge({
  availability,
  className,
  size = "md",
}: {
  availability: Availability;
  className?: string;
  size?: "sm" | "md";
}) {
  const meta = AVAILABILITY_META[availability];
  const Icon = ICONS[availability];
  return (
    <Badge tone={meta.tone} size={size} className={cn("gap-1", className)}>
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden />
      {meta.label}
    </Badge>
  );
}

/** Classic Indian veg / non-veg square marker. */
export function DietaryMark({
  dietary,
  className,
}: {
  dietary: DietaryTag;
  className?: string;
}) {
  const { label, color } = DIETARY_META[dietary];
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={cn(
        "inline-grid h-4 w-4 place-items-center rounded-[4px] border",
        className,
      )}
      style={{ borderColor: color }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}
