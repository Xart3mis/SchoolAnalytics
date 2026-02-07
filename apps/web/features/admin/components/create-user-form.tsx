"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemedSelect } from "@/components/ui/themed-select";

export function CreateUserForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
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

    form?.reset();
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
          {loading ? "Creating..." : "Create User"}
        </Button>
        {status ? <span className="text-xs text-[color:var(--text-muted)]">{status}</span> : null}
      </div>
    </form>
  );
}
