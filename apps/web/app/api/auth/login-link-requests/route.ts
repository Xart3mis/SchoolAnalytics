import { NextResponse } from "next/server";
import { z } from "zod";

import { ApiError, handleApiError } from "@/lib/api/errors";
import { isAdminBootstrapped } from "@/lib/auth/bootstrap";
import { logAuthAuditEvent } from "@/lib/auth/audit";
import { hashEmail } from "@/lib/auth/magic";
import { isRateLimited } from "@/lib/auth/rate-limit";
import { prisma } from "@/lib/prisma";

const requestSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

function genericResponse() {
  return NextResponse.json({
    ok: true,
    message: "Your sign-in link request was submitted for admin approval.",
  });
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminBootstrapped())) {
      throw new ApiError("Admin onboarding is required before requesting login links.", 409);
    }

    const payload = requestSchema.parse(await request.json());
    const ipAddress = request.headers.get("x-forwarded-for") ?? "unknown";
    const userAgent = request.headers.get("user-agent");
    const emailHash = hashEmail(payload.email);

    if (isRateLimited(`login-link-request-ip:${ipAddress}`) || isRateLimited(`login-link-request-email:${emailHash}`)) {
      await logAuthAuditEvent({
        eventType: "MAGIC_LINK_REQUESTED",
        emailHash,
        ipAddress,
        userAgent,
        metadata: { outcome: "rate_limited", source: "login_link_request" },
      });
      return genericResponse();
    }

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true, status: true },
    });

    if (!user || user.status !== "ACTIVE") {
      await logAuthAuditEvent({
        eventType: "MAGIC_LINK_REQUESTED",
        emailHash,
        ipAddress,
        userAgent,
        metadata: { outcome: "ignored", source: "login_link_request" },
      });
      return genericResponse();
    }

    const pending = await prisma.loginLinkRequest.findFirst({
      where: {
        requesterId: user.id,
        status: "PENDING",
      },
      select: { id: true },
    });

    if (!pending) {
      await prisma.loginLinkRequest.create({
        data: {
          requesterId: user.id,
          status: "PENDING",
        },
      });
    }

    await logAuthAuditEvent({
      eventType: "MAGIC_LINK_REQUESTED",
      userId: user.id,
      emailHash,
      ipAddress,
      userAgent,
      metadata: {
        outcome: pending ? "already_pending" : "queued",
        source: "login_link_request",
      },
    });

    return genericResponse();
  } catch (error) {
    return handleApiError(error);
  }
}
