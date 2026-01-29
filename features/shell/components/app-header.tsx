"use client";

import { Command, Moon, Search, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";

export function AppHeader() {
  const { theme, setTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
        School Analytics
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search students, classes, staff..."
            className="pl-10"
          />
          <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 text-xs text-slate-400 md:flex">
            <Command className="h-3 w-3" />K
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(nextTheme)}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100/60 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Exec Admin
        </div>
      </div>
    </header>
  );
}
