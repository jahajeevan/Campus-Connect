import { cn } from "@/lib/utils";

interface StatTileProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  tone?: "neutral" | "primary" | "available" | "sold" | "soon" | "gold";
  className?: string;
}

const TONES: Record<NonNullable<StatTileProps["tone"]>, string> = {
  neutral: "bg-cream text-ink-muted",
  primary: "bg-primary-soft text-primary",
  available: "bg-available-soft text-available",
  sold: "bg-sold-soft text-sold",
  soon: "bg-soon-soft text-soon",
  gold: "bg-gold-soft text-soon",
};

export function StatTile({
  icon,
  label,
  value,
  tone = "neutral",
  className,
}: StatTileProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface p-5 shadow-soft",
        className,
      )}
    >
      <span
        className={cn(
          "grid h-10 w-10 place-items-center rounded-xl",
          TONES[tone],
        )}
      >
        {icon}
      </span>
      <p className="mt-4 text-2xl font-semibold tabular-nums text-ink">
        {value}
      </p>
      <p className="text-sm text-ink-muted">{label}</p>
    </div>
  );
}
