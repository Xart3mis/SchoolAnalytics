"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { AppHeader } from "@/features/shell/components/app-header";
import { AppSidebar } from "@/features/shell/components/app-sidebar";
import { useUiStore } from "@/hooks/use-ui-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [setSidebarOpen]);

  if (isLogin) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="app-background relative flex min-h-dvh w-full overflow-hidden bg-[color:var(--bg)] text-[color:var(--text)] lg:h-screen">
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-[1px] md:hidden"
        />
      ) : null}
      <AppSidebar />
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 animate-fade-up">
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
