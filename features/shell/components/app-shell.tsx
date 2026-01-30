"use client";

import { usePathname } from "next/navigation";

import { AppHeader } from "@/features/shell/components/app-header";
import { AppSidebar } from "@/features/shell/components/app-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  if (isLogin) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="app-background relative flex min-h-screen w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-10%] h-72 w-72 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-900/30" />
        <div className="absolute bottom-[-20%] left-[-5%] h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-900/30" />
      </div>
      <AppSidebar />
      <div className="relative z-10 flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 px-6 py-6 animate-fade-up">{children}</main>
      </div>
    </div>
  );
}
