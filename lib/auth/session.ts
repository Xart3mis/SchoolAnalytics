import crypto from "crypto";
import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME, SESSION_TTL_DAYS } from "@/lib/auth/constants";

export { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { prisma } from "@/lib/prisma";

export function createSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function getSessionExpiry() {
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_TTL_DAYS);
  return expires;
}

export async function createSession(userId: string) {
  const token = createSessionToken();
  const expiresAt = getSessionExpiry();

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function deleteSession(token: string) {
  await prisma.session.deleteMany({
    where: { token },
  });
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.session.findFirst({
    where: {
      token,
      expiresAt: { gt: new Date() },
    },
    include: {
      user: true,
    },
  });

  if (!session) return null;
  return session;
}
