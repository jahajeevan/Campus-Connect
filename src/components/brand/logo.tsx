import Image from "next/image";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * Official Amrita Vishwa Vidyapeetham (Mata Amritanandamayi Math) crest.
 * Transparent PNG lives at /public/amrita-logo.png.
 */
export function LogoMark({
  className,
  title = site.university,
  priority = false,
}: {
  className?: string;
  title?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/amrita-logo.png"
      alt={title}
      width={44}
      height={44}
      priority={priority}
      className={cn("h-10 w-10 object-contain", className)}
    />
  );
}

export function Logo({
  className,
  showText = true,
  subtitle = false,
  priority = false,
}: {
  className?: string;
  showText?: boolean;
  subtitle?: boolean;
  priority?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-10 w-10" priority={priority} />
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
