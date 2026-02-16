import { NextResponse } from "next/server";
import { z } from "zod";

import { ApiError, handleApiError } from "@/lib/api/errors";
import { isAdminBootstrapped } from "@/lib/auth/bootstrap";
import { hashPassword } from "@/lib/auth/password";
import { createSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const onboardingSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(256),
  displayName: z.string().trim().min(2).max(120).optional(),
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
    if (await isAdminBootstrapped()) {
      throw new ApiError("Admin onboarding is already completed.", 409);
    }

    const payload = onboardingSchema.parse(await request.json());
    const policyError = validatePasswordPolicy(payload.password);
    if (policyError) {
      throw new ApiError(policyError, 400);
    }

    const passwordHash = await hashPassword(payload.password);

    const user = await prisma.$transaction(async (tx) => {
      const existingAdminCount = await tx.user.count({ where: { role: "ADMIN" } });
      if (existingAdminCount > 0) {
        throw new ApiError("Admin onboarding is already completed.", 409);
      }
      const existingEmailUser = await tx.user.findUnique({ where: { email: payload.email } });
      if (existingEmailUser) {
        throw new ApiError("An account with this email already exists.", 409);
      }

      return tx.user.create({
        data: {
          email: payload.email,
          passwordHash,
          role: "ADMIN",
          status: "ACTIVE",
          displayName: payload.displayName?.trim() || "Administrator",
        },
      });
    });

    const { token, expiresAt } = await createSession(user.id);
    const response = NextResponse.json({
      ok: true,
      redirectTo: "/",
      user: { id: user.id, email: user.email, role: user.role },
    });

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
