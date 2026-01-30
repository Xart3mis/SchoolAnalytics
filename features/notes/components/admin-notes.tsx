"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Note = {
  id: string;
  content: string;
  author: string;
  createdAt: string;
};

type UserInfo = {
  role: "ADMIN" | "USER";
};

interface AdminNotesProps {
  pageKey: string;
}

export function AdminNotes({ pageKey }: AdminNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const [meResponse, notesResponse] = await Promise.all([
        fetch("/api/auth/me"),
        fetch(`/api/admin/notes?pageKey=${encodeURIComponent(pageKey)}`),
      ]);

      if (meResponse.ok) {
        const data = await meResponse.json();
        setUser(data.user);
      }

      if (notesResponse.ok) {
        const data = await notesResponse.json();
        setNotes(data.notes ?? []);
      }
    }

    load();
  }, [pageKey]);

  async function handleSubmit() {
    if (!content.trim()) return;
    setLoading(true);

    const response = await fetch("/api/admin/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageKey, content }),
    });

    if (response.ok) {
      const data = await response.json();
      setNotes((prev) => [data.note, ...prev]);
      setContent("");
    }

    setLoading(false);
  }

  return (
    <Card className="transition-transform duration-300 ease-out hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm uppercase tracking-[0.25em] text-slate-500">
          Admin Notes
        </CardTitle>
        {user?.role === "ADMIN" ? (
          <Button size="sm" variant="outline" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Add Note"}
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {user?.role === "ADMIN" ? (
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Share guidance for teachers..."
            className="min-h-[80px] w-full rounded-lg border border-slate-200 bg-white/90 p-3 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200 dark:focus-visible:ring-slate-600"
          />
        ) : null}
        {notes.length === 0 ? (
          <p className="text-sm text-slate-500">No notes yet.</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="rounded-lg border border-slate-200 bg-white/80 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                  <span>{note.author}</span>
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm">{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
