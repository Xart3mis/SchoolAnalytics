"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type ThemedSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const ThemedSelect = React.forwardRef<HTMLSelectElement, ThemedSelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "h-8 w-full appearance-none rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-2 pr-8 text-xs text-[color:var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] disabled:cursor-not-allowed disabled:opacity-60",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[color:var(--text-muted)]" />
      </div>
    );
  }
);

ThemedSelect.displayName = "ThemedSelect";
