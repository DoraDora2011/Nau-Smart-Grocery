import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-[0_12px_40px_rgba(24,52,41,0.08)]",
        className
      )}
      {...props}
    />
  );
}
