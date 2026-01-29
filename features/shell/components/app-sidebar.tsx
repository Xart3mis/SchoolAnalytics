"use client";

import { BookOpen, GraduationCap, LineChart, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUiStore } from "@/hooks/use-ui-store";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Students", icon: GraduationCap },
  { label: "Staff", icon: Users },
  { label: "Academics", icon: BookOpen },
  { label: "Finance", icon: LineChart },
];

export function AppSidebar() {
  const { sidebarOpen, toggleSidebar } = useUiStore();

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-slate-200 bg-white/80 px-4 py-6 backdrop-blur transition-all duration-300 dark:border-slate-800 dark:bg-slate-950/80",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          {sidebarOpen ? "Navigator" : "Nav"}
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <span className="text-xs">⟷</span>
        </Button>
      </div>
      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50",
              sidebarOpen ? "justify-start" : "justify-center"
            )}
          >
            <item.icon className="h-4 w-4" />
            {sidebarOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
      <div className="rounded-lg border border-slate-200 bg-slate-100/70 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
        {sidebarOpen ? "Updated 5m ago" : "5m"}
      </div>
    </aside>
  );
}
