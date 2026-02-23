import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACTIVE_ORGANIZATION_COOKIE_NAME } from "@/lib/auth/constants";
import { deleteSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await deleteSession(token);
  }

  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });
  response.cookies.set(ACTIVE_ORGANIZATION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });
  return response;
}
