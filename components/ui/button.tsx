import * as React from "react";

import { cn } from "@/lib/utils/cn";

const variants = {
  primary: "bg-[var(--color-primary)] text-white shadow-sm hover:bg-[var(--color-primary-strong)]",
  secondary:
    "bg-[var(--color-card)] text-[var(--color-ink)] hover:bg-white",
  ghost: "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-muted)]"
};

const sizes = {
  sm: "h-9 px-3 text-xs leading-none sm:h-10 sm:text-sm",
  md: "h-10 px-4 text-sm leading-none sm:h-11 sm:text-base",
  lg: "h-11 px-5 text-sm leading-none sm:h-12 sm:text-base md:text-lg"
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
