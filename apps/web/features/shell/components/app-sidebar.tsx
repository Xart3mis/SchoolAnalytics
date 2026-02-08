"use client";

import Link from "next/link";
import { ArrowLeftRight, GraduationCap, Home, Layers, Users } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useUiStore } from "@/hooks/use-ui-store";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: Home, href: "/" },
  { label: "Students", icon: GraduationCap, href: "/students" },
  { label: "Classes", icon: Users, href: "/classes" },
  { label: "Grades", icon: Layers, href: "/grades" },
  { label: "Compare", icon: ArrowLeftRight, href: "/compare" },
];

export function AppSidebar() {
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const year = searchParams.get("year");
  const term = searchParams.get("term");
  const preserved = new URLSearchParams();
  if (year) preserved.set("year", year);
  if (term) preserved.set("term", term);
  const preservedQuery = preserved.toString();
  const withContext = (href: string) => (preservedQuery ? `${href}?${preservedQuery}` : href);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex h-dvh w-72 flex-col overflow-y-auto border-r border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-5 transition-transform duration-300 md:static md:z-0 md:h-screen md:translate-x-0 md:transition-[width] md:duration-300",
        sidebarOpen ? "translate-x-0 md:w-64" : "-translate-x-full md:w-20"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--accent)]">
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
              href={withContext(item.href)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[color:var(--surface-strong)] text-[color:var(--text)] shadow-[inset_0_0_0_1px_rgba(31,63,118,0.18)] dark:shadow-[inset_0_0_0_1px_rgba(107,143,216,0.22)]"
                  : "text-[color:var(--text-muted)] hover:bg-[color:var(--surface-strong)] hover:text-[color:var(--text)]",
                sidebarOpen ? "justify-start" : "justify-center"
              )}
            >
              <item.icon className="h-4 w-4" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
