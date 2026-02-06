import { redirect } from "next/navigation";

import { getSessionFromCookies } from "@/lib/auth/session";

export async function requireSession() {
  const session = await getSessionFromCookies();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireSession();
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }
  return session;
}
