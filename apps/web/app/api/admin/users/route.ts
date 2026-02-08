import { NextResponse } from "next/server";
import { z } from "zod";

import { ApiError, handleApiError } from "@/lib/api/errors";
import { logAuthAuditEvent } from "@/lib/auth/audit";
import { createMagicLink, getInviteLinkExpiry } from "@/lib/auth/magic";
import { getSessionFromCookies } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const createUserSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email(),
  role: z.enum(["ADMIN", "USER"]).optional(),
});

function buildInviteLink(baseUrl: string, token: string) {
  const activationLink = new URL("/auth/activate", baseUrl);
  activationLink.searchParams.set("token", token);
  return activationLink.toString();
}

export async function GET(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.user.role !== "ADMIN") {
      throw new ApiError("Unauthorized.", 403);
    }

    const now = new Date();
    const links = await prisma.magicLink.findMany({
      where: {
        purpose: "INVITE_ACTIVATE",
        usedAt: null,
        invalidatedAt: null,
        expiresAt: { gt: now },
        token: { not: null },
      },
      include: {
        user: {
          select: {
            email: true,
            displayName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      ok: true,
      invites: links.map((link) => ({
        id: link.id,
        name: link.user.displayName ?? "",
        email: link.user.email,
        link: buildInviteLink(request.url, link.token as string),
        expiresAt: link.expiresAt.toISOString(),
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.user.role !== "ADMIN") {
      throw new ApiError("Unauthorized.", 403);
    }

    const payload = createUserSchema.parse(await request.json());
    const role = payload.role === "ADMIN" ? "ADMIN" : "USER";
    const displayName = `${payload.firstName} ${payload.lastName}`.trim();

    const existing = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      throw new ApiError("User already exists.", 409);
    }

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        passwordHash: null,
        role,
        displayName,
        status: "INVITED",
      },
    });

    const { token, expiresAt } = await createMagicLink({
      userId: user.id,
      purpose: "INVITE_ACTIVATE",
      expiresAt: getInviteLinkExpiry(),
      requestedByIp: request.headers.get("x-forwarded-for"),
      requestedUserAgent: request.headers.get("user-agent"),
    });

    await logAuthAuditEvent({
      eventType: "MAGIC_LINK_REQUESTED",
      userId: user.id,
      ipAddress: request.headers.get("x-forwarded-for"),
      userAgent: request.headers.get("user-agent"),
      metadata: { purpose: "INVITE_ACTIVATE", source: "admin_create_user" },
    });

    const activationLink = buildInviteLink(request.url, token);

    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, role: user.role, status: user.status },
      invite: {
        link: activationLink,
        expiresAt: expiresAt.toISOString(),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
