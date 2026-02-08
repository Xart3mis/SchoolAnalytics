import type { AuthAuditEventType, Prisma } from "@school-analytics/db/client";

import { prisma } from "@/lib/prisma";

export async function logAuthAuditEvent(input: {
  eventType: AuthAuditEventType;
  userId?: string | null;
  emailHash?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Prisma.InputJsonValue;
}) {
  try {
    await prisma.authAuditEvent.create({
      data: {
        eventType: input.eventType,
        userId: input.userId ?? null,
        emailHash: input.emailHash ?? null,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        metadata: input.metadata ?? undefined,
      },
    });
  } catch (error) {
    console.error("[auth-audit] failed to persist event", error);
  }
}
