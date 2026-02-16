"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AdminOnboardingForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      displayName: String(formData.get("displayName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    };

    if (payload.password !== payload.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/auth/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: payload.displayName,
        email: payload.email,
        password: payload.password,
      }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      setError(result.error ?? "Unable to create admin account.");
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <div className="app-background flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md shadow-[0_30px_60px_-40px_rgba(44,73,127,0.3)] dark:shadow-[0_30px_60px_-40px_rgba(0,14,20,0.8)] animate-fade-up">
        <CardHeader>
          <CardTitle className="text-2xl">Set up your admin account</CardTitle>
          <CardDescription>
            First run detected. Create the first administrator to finish onboarding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input name="displayName" placeholder="Administrator name" required />
            <Input name="email" type="email" placeholder="admin@school.org" required />
            <Input name="password" type="password" placeholder="Password" required />
            <Input name="confirmPassword" type="password" placeholder="Confirm password" required />
            <p className="text-xs text-[color:var(--text-muted)]">
              Password must be at least 8 characters and include uppercase, lowercase, and a number.
            </p>
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Creating admin..." : "Create admin account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
