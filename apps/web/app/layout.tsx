import "./globals.css";

import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";

import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/features/shell/components/app-shell";

export const metadata: Metadata = {
  title: "School Analytics Dashboard",
  description: "Executive-grade analytics for modern school leadership.",
};

const robotoCondensed = Roboto_Condensed({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={robotoCondensed.className} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Providers>
            <AppShell>{children}</AppShell>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
