"use client";

import Link from "next/link";
import { GraduationCap, Home, Layers, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { useUiStore } from "@/hooks/use-ui-store";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: Home, href: "/" },
  { label: "Students", icon: GraduationCap, href: "/students" },
  { label: "Classes", icon: Users, href: "/classes" },
  { label: "Grades", icon: Layers, href: "/grades" },
];

export function AppSidebar() {
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const pathname = usePathname();
  const [role, setRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadUser() {
      const response = await fetch("/api/auth/me");
      if (!response.ok) return;
      const data = await response.json();
      setRole(data.user?.role ?? null);
    }

    loadUser();
  }, []);

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-slate-200/70 bg-white/70 px-4 py-6 backdrop-blur-xl transition-all duration-300 dark:border-slate-800/70 dark:bg-slate-950/70",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          {sidebarOpen ? "Navigator" : "Nav"}
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <span className="text-xs">⟷</span>
        </Button>
      </div>
      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gradient-to-r from-sky-100/80 via-white/60 to-transparent text-slate-900 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.3)] dark:from-sky-900/30 dark:via-slate-950/40 dark:text-slate-50"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50",
                sidebarOpen ? "justify-start" : "justify-center"
              )}
            >
              <item.icon className="h-4 w-4" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
        {role === "ADMIN" ? (
          <Link
            href="/admin/users"
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith("/admin")
                ? "bg-gradient-to-r from-emerald-100/70 via-white/60 to-transparent text-slate-900 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.3)] dark:from-emerald-900/30 dark:via-slate-950/40 dark:text-slate-50"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50",
              sidebarOpen ? "justify-start" : "justify-center"
            )}
          >
            <span className="text-xs font-semibold">ADM</span>
            {sidebarOpen && <span>Admin</span>}
          </Link>
        ) : null}
      </nav>
      <div className="rounded-lg border border-slate-200 bg-slate-100/70 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
        {sidebarOpen ? "Updated 5m ago" : "5m"}
      </div>
    </aside>
  );
}
