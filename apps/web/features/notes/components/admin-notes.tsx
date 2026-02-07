"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Note | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
  const mounted = typeof document !== "undefined";

  useEffect(() => {
    if (!pendingDelete) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setPendingDelete(null);
        return;
      }

      if (event.key !== "Tab") return;

      const container = modalRef.current;
      if (!container) return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled"));

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const isShift = event.shiftKey;

      if (!isShift && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (isShift && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    cancelButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [pendingDelete]);

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

  async function handleDelete(noteId: string) {
    setDeletingId(noteId);
    const response = await fetch(`/api/admin/notes?id=${encodeURIComponent(noteId)}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
    }

    setDeletingId(null);
    return response.ok;
  }

  return (
    <Card className="transition-transform duration-300 ease-out hover:-translate-y-0.5">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)] sm:text-sm">
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
            className="min-h-[80px] w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3 text-sm text-[color:var(--text)] placeholder:text-[color:var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
          />
        ) : null}
        {notes.length === 0 ? (
          <p className="text-sm text-[color:var(--text-muted)]">No notes yet.</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3 text-sm text-[color:var(--text)]"
              >
                <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                  <span>{note.author}</span>
                  <div className="flex items-center gap-3">
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    {user?.role === "ADMIN" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setPendingDelete(note)}
                        disabled={deletingId === note.id}
                        aria-label={`Delete note from ${note.author}`}
                        className="h-6 px-2 text-[10px] uppercase tracking-[0.2em]"
                      >
                        {deletingId === note.id ? "Deleting..." : "Delete"}
                      </Button>
                    ) : null}
                  </div>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm">{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {mounted && pendingDelete
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
              onClick={() => setPendingDelete(null)}
            >
              <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-note-title"
                className="w-full max-w-sm rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[0_24px_60px_-35px_rgba(0,14,20,0.7)]"
                onClick={(event) => event.stopPropagation()}
              >
                <div id="delete-note-title" className="text-sm font-semibold text-[color:var(--text)]">
                  Delete note?
                </div>
                <p className="mt-2 text-xs text-[color:var(--text-muted)]">
                  This will permanently remove the note: “{pendingDelete.content.slice(0, 80)}
                  {pendingDelete.content.length > 80 ? "…" : ""}”
                </p>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button
                    ref={cancelButtonRef}
                    size="sm"
                    variant="ghost"
                    onClick={() => setPendingDelete(null)}
                    disabled={deletingId === pendingDelete.id}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={async () => {
                      await handleDelete(pendingDelete.id);
                      setPendingDelete(null);
                    }}
                    disabled={deletingId === pendingDelete.id}
                    aria-label={`Confirm delete note from ${pendingDelete.author}`}
                    className="bg-[color:var(--danger)] text-white hover:brightness-95"
                  >
                    {deletingId === pendingDelete.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </Card>
  );
}
