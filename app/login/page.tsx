"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      setError(result.error ?? "Login failed.");
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <div className="app-background flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md border-slate-200/60 bg-white/95 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/80 dark:shadow-slate-950/60 animate-fade-up">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to view performance analytics.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300" htmlFor="email">
                Email
              </label>
              <Input id="email" name="email" type="email" placeholder="you@school.org" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300" htmlFor="password">
                Password
              </label>
              <Input id="password" name="password" type="password" required />
            </div>
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
