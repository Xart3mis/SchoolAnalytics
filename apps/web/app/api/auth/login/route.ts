import { NextResponse } from "next/server";

import { verifyPassword } from "@/lib/auth/password";
import { createSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  const body = isJson ? await request.json() : await request.formData();
  const email = normalizeEmail(
    isJson ? body.email ?? "" : String(body.get("email") ?? "")
  );
  const password = isJson ? body.password ?? "" : String(body.get("password") ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "Missing credentials." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  if (!user.passwordHash) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const { token, expiresAt } = await createSession(user.id);
  const cookieConfig = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  };

  if (isJson) {
    const response = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, role: user.role },
    });
    response.cookies.set(SESSION_COOKIE_NAME, token, cookieConfig);
    return response;
  }

  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.set(SESSION_COOKIE_NAME, token, cookieConfig);
  return response;
}
