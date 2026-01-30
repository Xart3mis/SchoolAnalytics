import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateUserForm } from "@/features/admin/components/create-user-form";
import { AdminNotes } from "@/features/notes/components/admin-notes";
import { requireAdmin } from "@/lib/auth/guards";

export default async function AdminUsersPage() {
  await requireAdmin();

  return (
    <div className="flex flex-col gap-6">
      <Card className="transition-transform duration-300 ease-out hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-[0.25em] text-slate-500">
            Create User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CreateUserForm />
        </CardContent>
      </Card>

      <AdminNotes pageKey="admin-users" />
    </div>
  );
}
