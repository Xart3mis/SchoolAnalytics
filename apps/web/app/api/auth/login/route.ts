import { NextResponse } from "next/server";
import { z } from "zod";

import { ApiError, handleApiError } from "@/lib/api/errors";
import { isAdminBootstrapped } from "@/lib/auth/bootstrap";
import {
  applyActiveOrganizationCookie,
  resolveTenantContextForUser,
} from "@/lib/auth/organization";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(256),
});

export async function POST(request: Request) {
  try {
    if (!(await isAdminBootstrapped())) {
      throw new ApiError("Admin onboarding is required before login.", 409);
    }

    const contentType = request.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await request.json() : await request.formData();
    const payload = loginSchema.parse({
      email: isJson ? body.email ?? "" : String(body.get("email") ?? ""),
      password: isJson ? body.password ?? "" : String(body.get("password") ?? ""),
    });

    const user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user || user.status !== "ACTIVE" || !user.passwordHash) {
      throw new ApiError("Invalid credentials.", 401);
    }

    const valid = await verifyPassword(payload.password, user.passwordHash);
    if (!valid) {
      throw new ApiError("Invalid credentials.", 401);
    }
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
    const cookieConfig = {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      path: "/",
    };

    if (isJson) {
      const response = NextResponse.json({
        ok: true,
        user: { id: user.id, email: user.email, role: user.role },
      });
      response.cookies.set(SESSION_COOKIE_NAME, token, cookieConfig);
      applyActiveOrganizationCookie(response, tenant.activeOrganizationId);
      return response;
    }

    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set(SESSION_COOKIE_NAME, token, cookieConfig);
    applyActiveOrganizationCookie(response, tenant.activeOrganizationId);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
