import crypto from "crypto";

import type { MagicLinkPurpose } from "@school-analytics/db/client";

import { prisma } from "@/lib/prisma";

export const INVITE_LINK_TTL_HOURS = 48;
export const LOGIN_LINK_TTL_MINUTES = 15;

export function generateMagicToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashMagicToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function hashEmail(email: string) {
  return crypto
    .createHash("sha256")
    .update(email.trim().toLowerCase())
    .digest("hex");
}

export function getInviteLinkExpiry() {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + INVITE_LINK_TTL_HOURS);
  return expiresAt;
}

export function getLoginLinkExpiry() {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + LOGIN_LINK_TTL_MINUTES);
  return expiresAt;
}

export async function createMagicLink(args: {
  userId: string;
  purpose: MagicLinkPurpose;
  expiresAt: Date;
  requestedByIp?: string | null;
  requestedUserAgent?: string | null;
}) {
  const token = generateMagicToken();
  const tokenHash = hashMagicToken(token);

  await prisma.$transaction(async (tx) => {
    await tx.magicLink.updateMany({
      where: {
        userId: args.userId,
        purpose: args.purpose,
        usedAt: null,
        invalidatedAt: null,
      },
      data: { invalidatedAt: new Date() },
    });

    await tx.magicLink.create({
      data: {
        userId: args.userId,
        purpose: args.purpose,
        token,
        tokenHash,
        expiresAt: args.expiresAt,
        requestedByIp: args.requestedByIp ?? null,
        requestedUserAgent: args.requestedUserAgent ?? null,
      },
    });
  });

  return {
    token,
    expiresAt: args.expiresAt,
  };
}
