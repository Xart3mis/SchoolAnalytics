import { NextResponse } from "next/server";
import { z } from "zod";

import { ApiError, handleApiError } from "@/lib/api/errors";
import { hashPassword } from "@/lib/auth/password";
import { getSessionFromCookies } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const createUserSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(256),
  role: z.enum(["ADMIN", "USER"]).optional(),
  displayName: z.string().trim().max(120).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.user.role !== "ADMIN") {
      throw new ApiError("Unauthorized.", 403);
    }

    const payload = createUserSchema.parse(await request.json());
    const role = payload.role === "ADMIN" ? "ADMIN" : "USER";
    const displayName = payload.displayName || null;

    const existing = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      throw new ApiError("User already exists.", 409);
    }

    const passwordHash = await hashPassword(payload.password);
    const user = await prisma.user.create({
      data: {
        email: payload.email,
        passwordHash,
        role,
        displayName,
      },
    });

    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
