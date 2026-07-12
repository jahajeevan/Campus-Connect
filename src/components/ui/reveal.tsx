"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-reveal that can NEVER hide content. The resting state is fully
 * visible (opacity is never touched); revealing only slides a small offset
 * away. So even if the observer/timer is throttled (background tab, low-power
 * device, headless preview), the content is always readable.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timeout = setTimeout(() => setShown(true), 900);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
          clearTimeout(timeout);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn(
        "transition-transform duration-700 ease-out-soft motion-reduce:transition-none",
        shown ? "translate-y-0" : "translate-y-4",
        className,
      )}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
