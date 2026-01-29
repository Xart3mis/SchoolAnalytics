import { AppHeader } from "@/features/shell/components/app-header";
import { AppSidebar } from "@/features/shell/components/app-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.15),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(30,41,59,0.35),_transparent_60%)]">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
