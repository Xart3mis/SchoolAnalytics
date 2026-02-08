"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ConsumeError = "invalid" | "expired" | "used";

export default function ActivatePage() {
  return (
    <Suspense fallback={<div className="app-background min-h-screen" />}>
      <ActivatePageContent />
    </Suspense>
  );
}

function ActivatePageContent() {
  const params = useSearchParams();
  const token = useMemo(() => params.get("token") ?? "", [params]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<ConsumeError | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleActivate() {
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/auth/magic/consume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const apiError = String(result.error ?? "Invalid or expired link").toLowerCase();
      if (apiError.includes("used")) {
        setError("used");
      } else if (apiError.includes("expired")) {
        setError("expired");
      } else {
        setError("invalid");
      }
      setLoading(false);
      return;
    }

    window.location.href = result.redirectTo ?? "/";
  }

  async function handleResend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResendLoading(true);
    setMessage(null);

    await fetch("/api/auth/magic/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, purpose: "INVITE_ACTIVATE" }),
    });

    setMessage("If eligible, a new activation link has been issued.");
    setResendLoading(false);
  }

  return (
    <div className="app-background flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Activate account</CardTitle>
          <CardDescription>Use your invite link to activate and continue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error === "expired" ? <p className="text-sm text-red-500">Link expired.</p> : null}
          {error === "used" ? <p className="text-sm text-red-500">Link already used.</p> : null}
          {error === "invalid" ? <p className="text-sm text-red-500">Invalid or expired link.</p> : null}

          <Button className="w-full" onClick={handleActivate} disabled={loading || !token}>
            {loading ? "Activating..." : "Activate account"}
          </Button>

          <form className="space-y-2 border-t border-[color:var(--border)] pt-4" onSubmit={handleResend}>
            <p className="text-xs text-[color:var(--text-muted)]">Need a new activation link?</p>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@school.org"
              required
            />
            <Button className="w-full" type="submit" disabled={resendLoading}>
              {resendLoading ? "Sending..." : "Resend link"}
            </Button>
            {message ? <p className="text-xs text-[color:var(--text-muted)]">{message}</p> : null}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
