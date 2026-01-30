"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CreateUserForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      role: String(formData.get("role") ?? "USER"),
      displayName: String(formData.get("displayName") ?? ""),
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

    event.currentTarget.reset();
    setStatus("User created.");
    setLoading(false);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="displayName" placeholder="Display name" />
        <Input name="email" type="email" placeholder="Email" required />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="password" type="password" placeholder="Temporary password" required />
        <select
          name="role"
          className="h-10 rounded-md border border-slate-200 bg-white/80 px-3 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200 dark:focus-visible:ring-slate-600"
          defaultValue="USER"
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create User"}
        </Button>
        {status ? <span className="text-xs text-slate-500">{status}</span> : null}
      </div>
    </form>
  );
}
