import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[var(--color-muted)] px-3 py-1 text-xs font-medium text-[var(--color-ink-soft)]",
        className
      )}
      {...props}
    />
  );
}
