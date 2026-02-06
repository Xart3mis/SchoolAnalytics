import { NextResponse } from "next/server";

import { hashPassword } from "@/lib/auth/password";
import { getSessionFromCookies } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const payload = await request.json();
  const email = normalizeEmail(payload.email ?? "");
  const password = payload.password ?? "";
  const role = payload.role === "ADMIN" ? "ADMIN" : "USER";
  const displayName = payload.displayName?.trim() || null;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "User already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role,
      displayName,
    },
  });

  return NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, role: user.role },
  });
}
