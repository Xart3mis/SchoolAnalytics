import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";

import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/features/shell/components/app-shell";

export const metadata: Metadata = {
  title: "School Analytics Dashboard",
  description: "Executive-grade analytics for modern school leadership.",
};

const robotoCondensedVariable = localFont({
  src: "./fonts/roboto-condensed-latin-wght-normal.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-roboto-condensed",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={robotoCondensedVariable.className} suppressHydrationWarning>
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
