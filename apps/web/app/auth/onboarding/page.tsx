import { redirect } from "next/navigation";

import { AdminOnboardingForm } from "@/features/auth/components/admin-onboarding-form";
import { isAdminBootstrapped } from "@/lib/auth/bootstrap";

export default async function AdminOnboardingPage() {
  if (await isAdminBootstrapped()) {
    redirect("/login");
  }

  return <AdminOnboardingForm />;
}
