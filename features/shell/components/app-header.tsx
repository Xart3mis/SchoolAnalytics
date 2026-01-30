"use client";

import { Command, Moon, Search, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import * as React from "react";

export function AppHeader() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [user, setUser] = React.useState<{ displayName?: string; email?: string; role?: string } | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    async function loadUser() {
      const response = await fetch("/api/auth/me");
      if (!response.ok) return;
      const data = await response.json();
      setUser(data.user);
    }

    loadUser();
  }, []);

  const currentTheme = resolvedTheme ?? theme;
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white/75 px-6 py-4 backdrop-blur-xl shadow-[0_20px_40px_-35px_rgba(15,23,42,0.45)] dark:border-slate-800/70 dark:bg-slate-950/70">
      <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
        School Analytics
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search students, classes, staff..."
            className="pl-10 bg-white/80 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.25)] focus-visible:ring-sky-400 dark:bg-slate-950/70"
          />
          <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 text-xs text-slate-400 md:flex">
            <Command className="h-3 w-3" />K
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <form action="/api/auth/logout" method="post">
          <Button variant="outline" size="sm" type="submit">
            Log out
          </Button>
        </form>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(nextTheme)}
          aria-label="Toggle theme"
          disabled={!mounted}
        >
          {mounted && currentTheme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : mounted ? (
            <Moon className="h-4 w-4" />
          ) : (
            <span className="h-4 w-4" />
          )}
        </Button>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100/60 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {user?.displayName ?? user?.email ?? "User"}
          {user?.role ? (
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-200">
              {user.role}
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
}
