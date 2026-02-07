import { NextResponse } from "next/server";
import { z } from "zod";

import { ApiError, handleApiError } from "@/lib/api/errors";
import { getSessionFromCookies } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const pageKeySchema = z.object({
  pageKey: z.string().trim().min(1).max(100),
});

const createNoteSchema = z.object({
  pageKey: z.string().trim().min(1).max(100),
  content: z.string().trim().min(1).max(5000),
});

const noteIdSchema = z.object({
  id: z.string().trim().min(10).max(64),
});

export async function GET(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      throw new ApiError("Unauthorized.", 403);
    }

    const { searchParams } = new URL(request.url);
    const { pageKey } = pageKeySchema.parse({
      pageKey: searchParams.get("pageKey") ?? "",
    });

    const notes = await prisma.adminNote.findMany({
      where: { pageKey },
      orderBy: { createdAt: "desc" },
      include: { author: true },
    });

    return NextResponse.json({
      notes: notes.map((note) => ({
        id: note.id,
        content: note.content,
        author: note.author.displayName ?? note.author.email,
        createdAt: note.createdAt,
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

    const { pageKey, content } = createNoteSchema.parse(await request.json());
    const note = await prisma.adminNote.create({
      data: {
        authorId: session.user.id,
        pageKey,
        content,
      },
      include: { author: true },
    });

    return NextResponse.json({
      ok: true,
      note: {
        id: note.id,
        content: note.content,
        author: note.author.displayName ?? note.author.email,
        createdAt: note.createdAt,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.user.role !== "ADMIN") {
      throw new ApiError("Unauthorized.", 403);
    }

    const { searchParams } = new URL(request.url);
    const { id } = noteIdSchema.parse({
      id: searchParams.get("id") ?? "",
    });

    await prisma.adminNote.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
