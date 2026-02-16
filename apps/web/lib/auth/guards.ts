import { redirect } from "next/navigation";

import { isAdminBootstrapped } from "@/lib/auth/bootstrap";
import { getSessionFromCookies } from "@/lib/auth/session";

export async function requireSession() {
  const bootstrapped = await isAdminBootstrapped();
  if (!bootstrapped) {
    redirect("/auth/onboarding");
  }

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
