import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { getAdminOverviewData } from "@/lib/services/user-service";

export default async function AdminUsersPage() {
  const { users } = await getAdminOverviewData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Users</h2>
        <p className="mt-2 text-sm text-slate-500">
          Account list with role and workspace counts.
        </p>
      </div>

      <Card>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="hidden grid-cols-[1fr_1.2fr_0.6fr_0.6fr_0.6fr_0.8fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 lg:grid">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Proposals</span>
              <span>Clients</span>
              <span>Created</span>
            </div>
            <div className="divide-y divide-slate-200">
              {users.map((user) => (
                <div
                  className="grid gap-3 px-4 py-4 lg:grid-cols-[1fr_1.2fr_0.6fr_0.6fr_0.6fr_0.8fr] lg:items-center"
                  key={user.id}
                >
                  <p className="font-semibold text-slate-950">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                  <p className="text-sm font-semibold text-slate-950">{user.role}</p>
                  <p className="text-sm text-slate-700">{user._count.proposals}</p>
                  <p className="text-sm text-slate-700">{user._count.clients}</p>
                  <p className="text-sm text-slate-500">{formatDate(user.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
