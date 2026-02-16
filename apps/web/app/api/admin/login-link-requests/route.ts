import { NextResponse } from "next/server";
import { z } from "zod";

import { ApiError, handleApiError } from "@/lib/api/errors";
import { logAuthAuditEvent } from "@/lib/auth/audit";
import {
  generateMagicToken,
  getLoginLinkExpiry,
  hashMagicToken,
} from "@/lib/auth/magic";
import { getSessionFromCookies } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const reviewSchema = z.object({
  requestId: z.string().trim().min(1),
  decision: z.enum(["APPROVE", "REJECT"]),
  reason: z.string().trim().max(240).optional(),
});

function requireAdminSession(session: Awaited<ReturnType<typeof getSessionFromCookies>>) {
  if (!session || session.user.role !== "ADMIN") {
    throw new ApiError("Unauthorized.", 403);
  }
  return session;
}

function buildMagicLoginLink(baseUrl: string, token: string) {
  const link = new URL("/auth/activate", baseUrl);
  link.searchParams.set("token", token);
  return link.toString();
}

export async function GET(request: Request) {
  try {
    requireAdminSession(await getSessionFromCookies());

    const now = new Date();
    const rejectedCutoff = new Date(now.getTime() - 1000 * 60 * 60 * 24);

    const requests = await prisma.loginLinkRequest.findMany({
      where: {
        OR: [
          { status: "PENDING" },
          {
            status: "APPROVED",
            magicLink: {
              usedAt: null,
              invalidatedAt: null,
              expiresAt: { gt: now },
            },
          },
          {
            status: "REJECTED",
            reviewedAt: { gt: rejectedCutoff },
          },
        ],
      },
      include: {
        requester: {
          select: {
            email: true,
            displayName: true,
          },
        },
        reviewer: {
          select: {
            email: true,
            displayName: true,
          },
        },
        magicLink: {
          select: {
            token: true,
            expiresAt: true,
            usedAt: true,
            invalidatedAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({
      ok: true,
      requests: requests.map((item) => {
        const canShareLink =
          item.status === "APPROVED" &&
          item.magicLink?.token &&
          !item.magicLink.usedAt &&
          !item.magicLink.invalidatedAt &&
          item.magicLink.expiresAt > now;

        return {
          id: item.id,
          status: item.status,
          createdAt: item.createdAt.toISOString(),
          reviewedAt: item.reviewedAt?.toISOString() ?? null,
          reviewReason: item.reviewReason,
          requester: {
            email: item.requester.email,
            displayName: item.requester.displayName,
          },
          reviewer: item.reviewer
            ? {
                email: item.reviewer.email,
                displayName: item.reviewer.displayName,
              }
            : null,
          loginLink: canShareLink
            ? {
                link: buildMagicLoginLink(request.url, item.magicLink?.token as string),
                expiresAt: item.magicLink?.expiresAt.toISOString(),
              }
            : null,
        };
      }),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = requireAdminSession(await getSessionFromCookies());

    const payload = reviewSchema.parse(await request.json());
    const reviewedAt = new Date();

    const outcome = await prisma.$transaction(async (tx) => {
      const existing = await tx.loginLinkRequest.findUnique({
        where: { id: payload.requestId },
        include: {
          requester: {
            select: {
              id: true,
              email: true,
              displayName: true,
              status: true,
            },
          },
        },
      });

      if (!existing) {
        throw new ApiError("Request not found.", 404);
      }

      if (existing.status !== "PENDING") {
        throw new ApiError("Request has already been reviewed.", 409);
      }

      if (payload.decision === "REJECT") {
        const rejected = await tx.loginLinkRequest.update({
          where: { id: existing.id },
          data: {
            status: "REJECTED",
            reviewerUserId: session.user.id,
            reviewedAt,
            reviewReason: payload.reason || null,
          },
        });

        return {
          status: rejected.status,
          id: rejected.id,
          requester: existing.requester,
          reviewReason: rejected.reviewReason,
          reviewedAt: rejected.reviewedAt,
          loginLink: null,
        };
      }

      if (existing.requester.status !== "ACTIVE") {
        throw new ApiError("Requester is not eligible for login links.", 409);
      }

      await tx.magicLink.updateMany({
        where: {
          userId: existing.requester.id,
          purpose: "LOGIN",
          usedAt: null,
          invalidatedAt: null,
        },
        data: { invalidatedAt: reviewedAt },
      });

      const token = generateMagicToken();
      const tokenHash = hashMagicToken(token);
      const expiresAt = getLoginLinkExpiry();

      const magicLink = await tx.magicLink.create({
        data: {
          userId: existing.requester.id,
          purpose: "LOGIN",
          token,
          tokenHash,
          expiresAt,
          requestedByIp: request.headers.get("x-forwarded-for"),
          requestedUserAgent: request.headers.get("user-agent"),
        },
      });

      const approved = await tx.loginLinkRequest.update({
        where: { id: existing.id },
        data: {
          status: "APPROVED",
          reviewerUserId: session.user.id,
          reviewedAt,
          reviewReason: payload.reason || null,
          magicLinkId: magicLink.id,
        },
      });

      return {
        status: approved.status,
        id: approved.id,
        requester: existing.requester,
        reviewReason: approved.reviewReason,
        reviewedAt: approved.reviewedAt,
        loginLink: {
          token,
          expiresAt,
        },
      };
    });

    if (payload.decision === "APPROVE") {
      await logAuthAuditEvent({
        eventType: "MAGIC_LINK_REQUESTED",
        userId: outcome.requester.id,
        ipAddress: request.headers.get("x-forwarded-for"),
        userAgent: request.headers.get("user-agent"),
        metadata: {
          purpose: "LOGIN",
          source: "admin_approved_login_link_request",
          requestId: payload.requestId,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      request: {
        id: outcome.id,
        status: outcome.status,
        requester: {
          email: outcome.requester.email,
          displayName: outcome.requester.displayName,
        },
        reviewedAt: outcome.reviewedAt?.toISOString() ?? null,
        reviewReason: outcome.reviewReason,
        loginLink: outcome.loginLink
          ? {
              link: buildMagicLoginLink(request.url, outcome.loginLink.token),
              expiresAt: outcome.loginLink.expiresAt.toISOString(),
            }
          : null,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
