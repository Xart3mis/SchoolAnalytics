import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateUserForm } from "@/features/admin/components/create-user-form";
import { LoginLinkRequestsPanel } from "@/features/admin/components/login-link-requests-panel";
import { requireAdmin } from "@/lib/auth/guards";

export default async function AdminUsersPage() {
  await requireAdmin();

  return (
    <div className="flex flex-col gap-6">
      <Card className="transition-transform duration-300 ease-out hover:-translate-y-0.5">
        <CardHeader>
          <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)] sm:text-sm">
            Create User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CreateUserForm />
        </CardContent>
      </Card>

      <Card className="transition-transform duration-300 ease-out hover:-translate-y-0.5">
        <CardHeader>
          <CardTitle className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)] sm:text-sm">
            Sign-In Link Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoginLinkRequestsPanel />
        </CardContent>
      </Card>

    </div>
  );
}
