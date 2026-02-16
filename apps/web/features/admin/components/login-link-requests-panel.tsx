"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

type RequestItem = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  reviewedAt: string | null;
  reviewReason: string | null;
  requester: {
    email: string;
    displayName: string | null;
  };
  reviewer: {
    email: string;
    displayName: string | null;
  } | null;
  loginLink: {
    link: string;
    expiresAt: string;
  } | null;
};

export function LoginLinkRequestsPanel() {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function loadRequests(options?: { showLoading?: boolean }) {
    if (options?.showLoading ?? true) {
      setLoading(true);
    }
    const response = await fetch("/api/admin/login-link-requests", { method: "GET" });
    const result = await response.json().catch(() => ({}));
    setItems(Array.isArray(result?.requests) ? result.requests : []);
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const response = await fetch("/api/admin/login-link-requests", { method: "GET" });
        const result = await response.json().catch(() => ({}));
        if (cancelled) {
          return;
        }
        setItems(Array.isArray(result?.requests) ? result.requests : []);
      } catch {
        if (!cancelled) {
          setStatusMessage("Unable to load login-link requests.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const pending = useMemo(
    () => items.filter((item) => item.status === "PENDING"),
    [items]
  );

  const approved = useMemo(
    () => items.filter((item) => item.status === "APPROVED" && item.loginLink),
    [items]
  );

  const rejected = useMemo(
    () => items.filter((item) => item.status === "REJECTED"),
    [items]
  );

  async function reviewRequest(requestId: string, decision: "APPROVE" | "REJECT") {
    setProcessingId(requestId);
    setStatusMessage(null);

    const response = await fetch("/api/admin/login-link-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, decision }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      setStatusMessage(result.error ?? "Unable to review request.");
      setProcessingId(null);
      return;
    }

    setStatusMessage(decision === "APPROVE" ? "Request approved." : "Request rejected.");
    await loadRequests({ showLoading: false });
    setProcessingId(null);
  }

  async function copyLink(requestId: string, link: string) {
    await navigator.clipboard.writeText(link);
    setCopiedId(requestId);
    window.setTimeout(() => {
      setCopiedId((current) => (current === requestId ? null : current));
    }, 1500);
  }

  if (loading) {
    return <p className="text-xs text-[color:var(--text-muted)]">Loading sign-in requests...</p>;
  }

  return (
    <div className="space-y-4">
      {statusMessage ? <p className="text-xs text-[color:var(--text-muted)]">{statusMessage}</p> : null}

      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--text-muted)]">Pending</p>
        {pending.length === 0 ? (
          <p className="text-xs text-[color:var(--text-muted)]">No pending login-link requests.</p>
        ) : (
          pending.map((item) => (
            <div key={item.id} className="rounded border border-[color:var(--border)] p-3 text-xs">
              <p className="font-medium text-[color:var(--text)]">{item.requester.displayName ?? "Unknown user"}</p>
              <p className="text-[color:var(--text-muted)]">{item.requester.email}</p>
              <p className="mt-1 text-[color:var(--text-muted)]">
                Requested: {new Date(item.createdAt).toLocaleString()}
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => reviewRequest(item.id, "APPROVE")}
                  disabled={processingId === item.id}
                >
                  {processingId === item.id ? "Working..." : "Approve"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => reviewRequest(item.id, "REJECT")}
                  disabled={processingId === item.id}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))
        )}
      </section>

      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--text-muted)]">Approved Links</p>
        {approved.length === 0 ? (
          <p className="text-xs text-[color:var(--text-muted)]">No active approved links.</p>
        ) : (
          approved.map((item) => (
            <div key={item.id} className="rounded border border-[color:var(--border)] p-3 text-xs">
              <p className="font-medium text-[color:var(--text)]">{item.requester.displayName ?? "Unknown user"}</p>
              <p className="text-[color:var(--text-muted)]">{item.requester.email}</p>
              <p className="mt-2 break-all text-[color:var(--text-muted)]">{item.loginLink?.link}</p>
              <p className="mt-1 text-[color:var(--text-muted)]">
                Expires: {item.loginLink ? new Date(item.loginLink.expiresAt).toLocaleString() : "-"}
              </p>
              <Button
                type="button"
                className="mt-3"
                size="sm"
                onClick={() => copyLink(item.id, item.loginLink?.link ?? "")}
              >
                {copiedId === item.id ? "Copied" : "Copy link"}
              </Button>
            </div>
          ))
        )}
      </section>

      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--text-muted)]">Recently Rejected</p>
        {rejected.length === 0 ? (
          <p className="text-xs text-[color:var(--text-muted)]">No recent rejections.</p>
        ) : (
          rejected.map((item) => (
            <div key={item.id} className="rounded border border-[color:var(--border)] p-3 text-xs">
              <p className="font-medium text-[color:var(--text)]">{item.requester.displayName ?? "Unknown user"}</p>
              <p className="text-[color:var(--text-muted)]">{item.requester.email}</p>
              <p className="mt-1 text-[color:var(--text-muted)]">
                Rejected: {item.reviewedAt ? new Date(item.reviewedAt).toLocaleString() : "-"}
              </p>
              {item.reviewReason ? (
                <p className="mt-1 text-[color:var(--text-muted)]">Reason: {item.reviewReason}</p>
              ) : null}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
