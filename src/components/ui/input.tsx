import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink shadow-soft transition-colors",
        "placeholder:text-ink-subtle",
        "focus-visible:outline-none focus-visible:border-primary/60 focus-visible:ring-4 focus-visible:ring-primary/10",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "aria-[invalid=true]:border-sold aria-[invalid=true]:ring-sold/10",
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[84px] w-full rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-sm text-ink shadow-soft transition-colors resize-none",
        "placeholder:text-ink-subtle",
        "focus-visible:outline-none focus-visible:border-primary/60 focus-visible:ring-4 focus-visible:ring-primary/10",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "aria-[invalid=true]:border-sold aria-[invalid=true]:ring-sold/10",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
