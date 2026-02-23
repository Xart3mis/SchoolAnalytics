"use client";

import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemedSelect } from "@/components/ui/themed-select";

type InviteLink = {
  id: string;
  name: string;
  email: string;
  link: string;
  expiresAt: string;
};

export function CreateUserForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [inviteLinks, setInviteLinks] = useState<InviteLink[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loadingInvites, setLoadingInvites] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchInvites() {
      setLoadingInvites(true);
      const response = await fetch("/api/admin/users", { method: "GET" });
      const result = await response.json().catch(() => ({}));
      if (!cancelled) {
        setInviteLinks(Array.isArray(result?.invites) ? result.invites : []);
        setLoadingInvites(false);
      }
    }

    fetchInvites().catch(() => {
      if (!cancelled) {
        setLoadingInvites(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const activeLinks = useMemo(
    () =>
      inviteLinks
        .filter((item) => new Date(item.expiresAt) > new Date())
        .sort((a, b) => new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime()),
    [inviteLinks]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      role: String(formData.get("role") ?? "USER"),
    };

    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      setStatus(result.error ?? "Unable to create user.");
      setLoading(false);
      return;
    }

    const result = await response.json();
    if (result?.invite?.link && result?.invite?.expiresAt) {
      setInviteLinks((current) => [
        {
          id: uuidv4(),
          name: `${payload.firstName} ${payload.lastName}`.trim(),
          email: payload.email,
          link: String(result.invite.link),
          expiresAt: String(result.invite.expiresAt),
        },
        ...current,
      ]);
    }
    form?.reset();
    setStatus("User invited.");
    setLoading(false);
  }

  async function copyInviteLink(id: string, link: string) {
    await navigator.clipboard.writeText(link);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="firstName" placeholder="First name" required />
        <Input name="lastName" placeholder="Last name" required />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="email" type="email" placeholder="Email" required />
        <ThemedSelect
          name="role"
          className="h-10 text-sm"
          defaultValue="USER"
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </ThemedSelect>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create User Invite"}
        </Button>
        {status ? <span className="text-xs text-[color:var(--text-muted)]">{status}</span> : null}
      </div>
      {loadingInvites ? (
        <p className="text-xs text-[color:var(--text-muted)]">Loading active invite links...</p>
      ) : null}
      {activeLinks.length > 0 ? (
        <div className="space-y-3">
          {activeLinks.map((item) => (
            <div key={item.id} className="rounded border border-[color:var(--border)] p-3 text-xs">
              <p className="font-medium text-[color:var(--text)]">{item.name}</p>
              <p className="text-[color:var(--text-muted)]">{item.email}</p>
              <p className="mt-2 break-all text-[color:var(--text-muted)]">{item.link}</p>
              <p className="mt-1 text-[color:var(--text-muted)]">
                Expires: {new Date(item.expiresAt).toLocaleString()}
              </p>
              <Button
                type="button"
                className="mt-3"
                size="sm"
                onClick={() => copyInviteLink(item.id, item.link)}
              >
                {copiedId === item.id ? "Copied" : "Copy link"}
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </form>
  );
}
