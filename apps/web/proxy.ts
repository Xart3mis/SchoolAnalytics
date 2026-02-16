import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

const PUBLIC_PATHS = ["/login", "/auth/activate", "/auth/onboarding"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDevSeedRoute =
    process.env.NODE_ENV !== "production" && pathname.startsWith("/api/seed");

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_PATHS.includes(pathname) ||
    isDevSeedRoute
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
