"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [magicStatus, setMagicStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [checkingBootstrap, setCheckingBootstrap] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function checkBootstrap() {
      const response = await fetch("/api/auth/onboarding/status");
      const result = await response.json().catch(() => ({ bootstrapped: true }));
      if (!mounted) return;
      if (!result.bootstrapped) {
        window.location.href = "/auth/onboarding";
        return;
      }
      setCheckingBootstrap(false);
    }
    void checkBootstrap();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      if (response.status === 409) {
        window.location.href = "/auth/onboarding";
        return;
      }
      setError(result.error ?? "Login failed.");
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  async function handleMagicLinkRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMagicStatus(null);
    setMagicLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? ""),
    };

    const response = await fetch("/api/auth/login-link-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));
    setMagicStatus(result.message ?? "Your request was submitted for admin approval.");
    setMagicLoading(false);
  }

  return (
    <div className="app-background flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md shadow-[0_30px_60px_-40px_rgba(44,73,127,0.3)] dark:shadow-[0_30px_60px_-40px_rgba(0,14,20,0.8)] animate-fade-up">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to view performance analytics.</CardDescription>
        </CardHeader>
        <CardContent>
          {checkingBootstrap ? (
            <p className="text-sm text-[color:var(--text-muted)]">Checking system setup...</p>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[color:var(--text)]" htmlFor="email">
                  Email
                </label>
                <Input id="email" name="email" type="email" placeholder="you@school.org" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[color:var(--text)]" htmlFor="password">
                  Password
                </label>
                <Input id="password" name="password" type="password" required />
              </div>
              {error ? <p className="text-sm text-red-500">{error}</p> : null}
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          )}
          {!checkingBootstrap ? (
            <form className="mt-4 space-y-3 border-t border-[color:var(--border)] pt-4" onSubmit={handleMagicLinkRequest}>
              <p className="text-xs text-[color:var(--text-muted)]">Need a sign-in link instead? Submit a request for admin approval.</p>
              <Input name="email" type="email" placeholder="you@school.org" required />
              {magicStatus ? <p className="text-xs text-[color:var(--text-muted)]">{magicStatus}</p> : null}
              <Button className="w-full" type="submit" disabled={magicLoading}>
                {magicLoading ? "Sending..." : "Email sign-in link"}
              </Button>
            </form>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
