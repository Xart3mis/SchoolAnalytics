import { NextResponse } from "next/server";
import { z } from "zod";

import { ApiError, handleApiError } from "@/lib/api/errors";
import { logAuthAuditEvent } from "@/lib/auth/audit";
import { hashMagicToken } from "@/lib/auth/magic";
import {
  applyActiveOrganizationCookie,
  resolveTenantContextForUser,
} from "@/lib/auth/organization";
import { createSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const consumeSchema = z.object({
  token: z.string().trim().min(1),
});

export async function POST(request: Request) {
  try {
    const payload = consumeSchema.parse(await request.json());
    const tokenHash = hashMagicToken(payload.token);
    const ipAddress = request.headers.get("x-forwarded-for");
    const userAgent = request.headers.get("user-agent");

    const link = await prisma.magicLink.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!link) {
      throw new ApiError("Invalid or expired link", 400);
    }

    if (link.usedAt) {
      throw new ApiError("Link already used", 400);
    }

    if (link.invalidatedAt || link.expiresAt <= new Date()) {
      throw new ApiError("Link expired", 400);
    }

    const usedAt = new Date();
    const consumeResult = await prisma.magicLink.updateMany({
      where: {
        id: link.id,
        usedAt: null,
        invalidatedAt: null,
        expiresAt: { gt: usedAt },
      },
      data: {
        usedAt,
        consumedByIp: ipAddress,
        consumedUserAgent: userAgent,
      },
    });

    if (consumeResult.count !== 1) {
      throw new ApiError("Invalid or expired link", 400);
    }

    if (link.purpose === "LOGIN" && link.user.status !== "ACTIVE") {
      throw new ApiError("Invalid or expired link", 400);
    }

    const nextStatus =
      link.purpose === "INVITE_ACTIVATE" && link.user.status === "INVITED"
        ? "ACTIVE"
        : link.user.status;

    if (nextStatus === "DISABLED") {
      throw new ApiError("Invalid or expired link", 400);
    }

    const user = await prisma.user.update({
      where: { id: link.userId },
      data: { status: nextStatus },
    });
    if (user.role !== "ADMIN" && !user.organizationId) {
      throw new ApiError("Account is not assigned to a school.", 403);
    }
    const tenant = await resolveTenantContextForUser({
      role: user.role,
      organizationId: user.organizationId,
    });
    if (!tenant.activeOrganizationId) {
      throw new ApiError(
        user.role === "ADMIN"
          ? "No schools are available for this admin account yet."
          : "Your assigned school could not be found.",
        409
      );
    }

    const { token, expiresAt } = await createSession(user.id);
    await logAuthAuditEvent({
      eventType: "MAGIC_LINK_CONSUMED",
      userId: user.id,
      ipAddress,
      userAgent,
      metadata: { purpose: link.purpose },
    });

    const response = NextResponse.json({
      ok: true,
      redirectTo: user.passwordHash ? "/" : "/auth/set-password",
      user: { id: user.id, email: user.email, role: user.role, status: user.status },
    });
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      path: "/",
    });
    applyActiveOrganizationCookie(response, tenant.activeOrganizationId);

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      await logAuthAuditEvent({
        eventType: "MAGIC_LINK_CONSUME_FAILED",
        ipAddress: request.headers.get("x-forwarded-for"),
        userAgent: request.headers.get("user-agent"),
        metadata: { reason: error.message },
      });
    }
    return handleApiError(error);
  }
}
