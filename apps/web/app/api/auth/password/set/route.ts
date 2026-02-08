import { NextResponse } from "next/server";
import { z } from "zod";

import { ApiError, handleApiError } from "@/lib/api/errors";
import { logAuthAuditEvent } from "@/lib/auth/audit";
import { hashPassword } from "@/lib/auth/password";
import { createSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { getSessionFromCookies } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const setPasswordSchema = z.object({
  password: z.string().min(8).max(256),
});

function validatePasswordPolicy(password: string) {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasUpper || !hasLower || !hasNumber) {
    return "Password must include uppercase, lowercase, and a number.";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      throw new ApiError("Unauthorized.", 401);
    }

    const payload = setPasswordSchema.parse(await request.json());
    const policyError = validatePasswordPolicy(payload.password);
    if (policyError) {
      throw new ApiError(policyError, 400);
    }

    const passwordHash = await hashPassword(payload.password);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          passwordHash,
          status: session.user.status === "DISABLED" ? "DISABLED" : "ACTIVE",
        },
      });

      // Rotate sessions after password set.
      await tx.session.deleteMany({ where: { userId: session.user.id } });
    });

    const { token, expiresAt } = await createSession(session.user.id);
    await logAuthAuditEvent({
      eventType: "PASSWORD_SET",
      userId: session.user.id,
      ipAddress: request.headers.get("x-forwarded-for"),
      userAgent: request.headers.get("user-agent"),
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      path: "/",
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
