import { NextResponse } from "next/server";
import { z } from "zod";

import { handleApiError } from "@/lib/api/errors";
import { logAuthAuditEvent } from "@/lib/auth/audit";
import {
  createMagicLink,
  getInviteLinkExpiry,
  getLoginLinkExpiry,
  hashEmail,
} from "@/lib/auth/magic";
import { isRateLimited } from "@/lib/auth/rate-limit";
import { prisma } from "@/lib/prisma";

const requestSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  purpose: z.enum(["INVITE_ACTIVATE", "LOGIN"]).default("LOGIN"),
});

function genericResponse() {
  return NextResponse.json({
    ok: true,
    message: "If the account is eligible, a sign-in link has been issued.",
  });
}

export async function POST(request: Request) {
  try {
    const payload = requestSchema.parse(await request.json());
    const ipAddress = request.headers.get("x-forwarded-for") ?? "unknown";
    const userAgent = request.headers.get("user-agent");
    const emailHash = hashEmail(payload.email);

    if (isRateLimited(`magic-ip:${ipAddress}`) || isRateLimited(`magic-email:${emailHash}`)) {
      await logAuthAuditEvent({
        eventType: "MAGIC_LINK_REQUESTED",
        emailHash,
        ipAddress,
        userAgent,
        metadata: { outcome: "rate_limited", purpose: payload.purpose },
      });
      return genericResponse();
    }

    const user = await prisma.user.findUnique({ where: { email: payload.email } });

    if (user && user.status !== "DISABLED") {
      const canIssueInvite = payload.purpose === "INVITE_ACTIVATE" && user.status === "INVITED";
      const canIssueLogin = payload.purpose === "LOGIN" && user.status === "ACTIVE";

      if (canIssueInvite || canIssueLogin) {
        const expiresAt =
          payload.purpose === "INVITE_ACTIVATE" ? getInviteLinkExpiry() : getLoginLinkExpiry();

        await createMagicLink({
          userId: user.id,
          purpose: payload.purpose,
          expiresAt,
          requestedByIp: ipAddress,
          requestedUserAgent: userAgent,
        });

        await logAuthAuditEvent({
          eventType: "MAGIC_LINK_REQUESTED",
          userId: user.id,
          emailHash,
          ipAddress,
          userAgent,
          metadata: { outcome: "issued", purpose: payload.purpose },
        });
        return genericResponse();
      }
    }

    await logAuthAuditEvent({
      eventType: "MAGIC_LINK_REQUESTED",
      emailHash,
      ipAddress,
      userAgent,
      metadata: { outcome: "ignored", purpose: payload.purpose },
    });

    return genericResponse();
  } catch (error) {
    return handleApiError(error);
  }
}
