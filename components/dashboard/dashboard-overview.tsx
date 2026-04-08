import { LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { StatsCard } from "@/components/ui/stats-card";
import { formatCurrency, formatDate } from "@/lib/format";
import type { DashboardStat } from "@/lib/types";

interface RecentProposal {
  id: string;
  title: string;
  clientName: string;
  amount: number;
  status: string;
  updatedAt: Date;
}

interface ActivityItem {
  id: string;
  action: string;
  detail: string;
  createdAt: Date;
}

export function DashboardOverview({
  stats,
  recentProposals,
  activity,
}: {
  stats: DashboardStat[];
  recentProposals: RecentProposal[];
  activity: ActivityItem[];
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Dashboard</h2>
          <p className="mt-2 text-sm text-slate-500">
            Track proposal velocity, open opportunities, and recent client activity.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <LinkButton href="/dashboard/proposals/new" variant="secondary">
            New Proposal
          </LinkButton>
          <LinkButton href="/dashboard/clients">Manage Clients</LinkButton>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader title="Recent proposals" description="The deals most likely to need attention." />
          <CardContent className="space-y-4">
            {recentProposals.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
                <p className="font-semibold text-slate-950">No proposals yet</p>
                <p className="mt-2 text-sm text-slate-500">
                  Create your first proposal to populate the dashboard.
                </p>
                <LinkButton className="mt-5" href="/dashboard/proposals/new">
                  New Proposal
                </LinkButton>
              </div>
            ) : (
              recentProposals.map((proposal) => (
                <div
                  className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  key={proposal.id}
                >
                  <div>
                    <p className="font-semibold text-slate-950">{proposal.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {proposal.clientName} | {formatDate(proposal.updatedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-semibold text-slate-950">
                      {formatCurrency(proposal.amount)}
                    </p>
                    <StatusBadge status={proposal.status} />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Activity" description="Recent actions across the workspace." />
          <CardContent className="space-y-5">
            {activity.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                Activity will appear here after you create, update, or delete records.
              </p>
            ) : (
              activity.map((item) => (
                <div className="border-l-2 border-slate-200 pl-4" key={item.id}>
                  <p className="text-sm font-semibold text-slate-950">{item.action}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatDate(item.createdAt)}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
