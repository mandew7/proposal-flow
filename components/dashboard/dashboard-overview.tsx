"use client";

import { LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { StatsCard } from "@/components/ui/stats-card";
import { formatCurrency } from "@/lib/mock-data";
import { useProposalFlow } from "@/lib/proposalflow-store";
import type { DashboardStat } from "@/lib/types";

function LoadingCard() {
  return (
    <Card className="p-5">
      <div className="h-4 w-24 rounded bg-slate-100" />
      <div className="mt-4 h-8 w-20 rounded bg-slate-100" />
      <div className="mt-3 h-4 w-32 rounded bg-slate-100" />
    </Card>
  );
}

export function DashboardOverview() {
  const { activity, isHydrated, proposals } = useProposalFlow();
  const acceptedProposals = proposals.filter((proposal) => proposal.status === "Accepted");
  const pendingProposals = proposals.filter((proposal) =>
    ["Draft", "Sent", "Viewed"].includes(proposal.status),
  );
  const revenue = acceptedProposals.reduce((total, proposal) => total + proposal.amount, 0);

  const stats: DashboardStat[] = [
    {
      label: "Total proposals",
      value: String(proposals.length),
      change: isHydrated ? "Saved locally" : "Loading workspace",
      tone: "neutral",
    },
    {
      label: "Accepted",
      value: String(acceptedProposals.length),
      change: `${acceptedProposals.length} closed deals`,
      tone: "positive",
    },
    {
      label: "Pending",
      value: String(pendingProposals.length),
      change: "Draft, sent, or viewed",
      tone: "warning",
    },
    {
      label: "Revenue",
      value: formatCurrency(revenue),
      change: "Accepted proposal value",
      tone: "positive",
    },
  ];

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
        {isHydrated ? (
          stats.map((stat) => <StatsCard key={stat.label} stat={stat} />)
        ) : (
          <>
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader title="Recent proposals" description="The deals most likely to need attention." />
          <CardContent className="space-y-4">
            {!isHydrated ? (
              <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                Loading recent proposals...
              </div>
            ) : proposals.length === 0 ? (
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
              proposals.slice(0, 4).map((proposal) => (
                <div
                  className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  key={proposal.id}
                >
                  <div>
                    <p className="font-semibold text-slate-950">{proposal.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {proposal.client} | {proposal.updatedAt}
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
            {!isHydrated ? (
              <p className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                Loading activity...
              </p>
            ) : activity.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                Activity will appear here after you create, update, or delete records.
              </p>
            ) : (
              activity.slice(0, 6).map((item) => (
                <div className="border-l-2 border-slate-200 pl-4" key={item.id}>
                  <p className="text-sm font-semibold text-slate-950">{item.action}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.time}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
