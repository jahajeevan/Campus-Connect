import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with correct precedence. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Indian Rupees. */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

/** Compact, human "time ago" string, e.g. "3 min ago". */
export function timeAgo(input: string | number | Date): string {
  const date = new Date(input);
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);

  if (Number.isNaN(seconds)) return "—";
  if (seconds < 45) return "just now";

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, secondsInUnit] of units) {
    if (seconds >= secondsInUnit || unit === "second") {
      const value = Math.round(seconds / secondsInUnit);
      return rtf.format(-value, unit);
    }
  }
  return "just now";
}

/** Deterministic slug from a name. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** "07:30" -> "7:30 AM". */
export function formatTime(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const period = h < 12 ? "AM" : "PM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${mStr.padStart(2, "0")} ${period}`;
}

/** "07:30"–"21:00" -> "7:30 AM – 9:00 PM". */
export function formatHours(opensAt: string, closesAt: string): string {
  return `${formatTime(opensAt)} – ${formatTime(closesAt)}`;
}

/** Initials for avatar chips, e.g. "Anita Rao" -> "AR". */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
