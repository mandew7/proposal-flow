import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatsCard } from "@/components/ui/stats-card";
import { LinkButton } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/format";
import type { DashboardStat } from "@/lib/types";

export default async function AdminPage() {
  const [users, proposals, clients, activity] = await Promise.all([
    prisma.user.count(),
    prisma.proposal.findMany(),
    prisma.client.count(),
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { actorUser: true, targetUser: true },
    }),
  ]);
  const acceptedRevenue = proposals
    .filter((proposal) => proposal.status === "ACCEPTED")
    .reduce((total, proposal) => total + proposal.amount, 0);
  const stats: DashboardStat[] = [
    { label: "Total users", value: String(users), change: "All accounts", tone: "neutral" },
    { label: "Total proposals", value: String(proposals.length), change: "Platform-wide", tone: "neutral" },
    { label: "Total clients", value: String(clients), change: "Platform-wide", tone: "neutral" },
    { label: "Accepted revenue", value: formatCurrency(acceptedRevenue), change: "All users", tone: "positive" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Admin dashboard</h2>
          <p className="mt-2 text-sm text-slate-500">
            Platform-wide usage, revenue, and activity for the master account.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <LinkButton href="/admin/users" variant="secondary">
            View Users
          </LinkButton>
          <LinkButton href="/admin/activity">View Activity</LinkButton>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.label} stat={stat} />
        ))}
      </div>

      <Card>
        <CardHeader title="Recent platform activity" description="The latest tracked actions across all users." />
        <CardContent className="space-y-4">
          {activity.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-500">
              No activity has been logged yet.
            </p>
          ) : (
            activity.map((item) => (
              <div className="rounded-lg border border-slate-200 p-4" key={item.id}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-slate-950">{item.action.replaceAll("_", " ")}</p>
                  <p className="text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Actor: {item.actorUser?.email ?? "System"} | Target: {item.targetUser?.email ?? "None"}
                </p>
                {item.metadata ? <p className="mt-2 text-xs text-slate-500">{item.metadata}</p> : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
