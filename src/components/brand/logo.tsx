import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * Campus Connect emblem — an original circular crest in Amrita vermillion,
 * echoing the university's circular badge (a diya / lamp of knowledge).
 * To use the official Amrita crest instead, drop it into /public and render
 * it here; nothing else needs to change.
 */
export function LogoMark({
  className,
  title = site.name,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      className={cn("h-10 w-10", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cc-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d0492f" />
          <stop offset="1" stopColor="#a32d17" />
        </linearGradient>
        <linearGradient id="cc-flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4d488" />
          <stop offset="1" stopColor="#c08a2d" />
        </linearGradient>
      </defs>

      {/* circular badge */}
      <circle cx="24" cy="24" r="23" fill="url(#cc-red)" />
      <circle cx="24" cy="24" r="23" fill="none" stroke="#fff" strokeOpacity="0.16" />
      <circle
        cx="24"
        cy="24"
        r="18"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.28"
        strokeWidth="0.9"
      />

      {/* lamp base */}
      <path
        d="M13.5 31c2.6 2.3 6.3 3.6 10.5 3.6S31.9 33.3 34.5 31c-2 1-5.6 1.7-10.5 1.7S15.5 32 13.5 31Z"
        fill="#fff6e3"
        fillOpacity="0.9"
      />
      <rect x="22.7" y="26.5" width="2.6" height="4.4" rx="1" fill="#fff6e3" fillOpacity="0.85" />

      {/* flame */}
      <path
        d="M24 11.5c3.3 3.4 5.2 6.4 5.2 9.6A5.2 5.2 0 0 1 24 26.3a5.2 5.2 0 0 1-5.2-5.2c0-3.2 1.9-6.2 5.2-9.6Z"
        fill="url(#cc-flame)"
      />
      <path
        d="M24 16c1.6 1.8 2.5 3.3 2.5 4.9a2.5 2.5 0 1 1-5 0c0-1.6.9-3.1 2.5-4.9Z"
        fill="#fff7e6"
        fillOpacity="0.92"
      />
    </svg>
  );
}

export function Logo({
  className,
  showText = true,
  subtitle = false,
}: {
  className?: string;
  showText?: boolean;
  subtitle?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-9 w-9" />
      {showText && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.05rem] font-semibold tracking-tight text-ink">
            Campus Connect
          </span>
          {subtitle && (
            <span className="mt-0.5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-ink-subtle">
              {site.university}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
