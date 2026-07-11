import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 ease-out-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-soft hover:bg-primary-hover hover:shadow-glow",
        secondary:
          "bg-surface text-ink border border-line-strong shadow-soft hover:bg-cream hover:border-line-strong",
        subtle: "bg-cream text-ink hover:bg-canvas-2",
        ghost: "text-ink-muted hover:bg-cream hover:text-ink",
        outline:
          "border border-line-strong text-ink bg-transparent hover:bg-cream",
        danger:
          "bg-sold-soft text-sold border border-sold/20 hover:bg-sold hover:text-white",
        gold: "bg-gold text-white shadow-soft hover:brightness-105",
      },
      size: {
        sm: "h-9 px-4 text-[0.8125rem]",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-7 text-[0.9375rem]",
        icon: "h-10 w-10 [&_svg]:size-[18px]",
        "icon-sm": "h-8 w-8 [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
