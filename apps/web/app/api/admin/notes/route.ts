import { NextResponse } from "next/server";

import { getSessionFromCookies } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const pageKey = searchParams.get("pageKey");
  if (!pageKey) {
    return NextResponse.json({ error: "pageKey required." }, { status: 400 });
  }

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
}

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const payload = await request.json();
  const pageKey = payload.pageKey?.trim();
  const content = payload.content?.trim();

  if (!pageKey || !content) {
    return NextResponse.json({ error: "pageKey and content required." }, { status: 400 });
  }

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
}

export async function DELETE(request: Request) {
  const session = await getSessionFromCookies();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const noteId = searchParams.get("id");
  if (!noteId) {
    return NextResponse.json({ error: "id required." }, { status: 400 });
  }

  await prisma.adminNote.delete({ where: { id: noteId } });

  return NextResponse.json({ ok: true });
}
