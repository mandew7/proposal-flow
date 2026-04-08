import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";

interface ClientProposalItem {
  id: string;
  title: string;
  amount: number;
  status: string;
  dueDate: Date;
  updatedAt: Date;
}

interface DealSectionProps {
  title: string;
  description: string;
  proposals: ClientProposalItem[];
  emptyTitle: string;
  emptyDescription: string;
}

function DealSection({
  title,
  description,
  proposals,
  emptyTitle,
  emptyDescription,
}: DealSectionProps) {
  return (
    <Card>
      <CardHeader
        title={title}
        description={`${description} ${proposals.length} ${proposals.length === 1 ? "deal" : "deals"}.`}
      />
      <CardContent className="space-y-4">
        {proposals.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-5">
            <p className="font-semibold text-slate-950">{emptyTitle}</p>
            <p className="mt-2 text-sm text-slate-500">{emptyDescription}</p>
          </div>
        ) : (
          proposals.map((proposal) => (
            <div
              className="grid gap-4 rounded-lg border border-slate-200 p-4 lg:grid-cols-[minmax(0,1.5fr)_0.8fr_0.8fr_0.9fr_auto] lg:items-center"
              key={proposal.id}
            >
              <div>
                <Link
                  className="font-semibold text-slate-950 hover:text-slate-700"
                  href={`/dashboard/proposals/${proposal.id}`}
                >
                  {proposal.title}
                </Link>
                <p className="mt-1 text-xs text-slate-500">Updated {formatDate(proposal.updatedAt)}</p>
              </div>
              <p className="text-sm font-semibold text-slate-950">{formatCurrency(proposal.amount)}</p>
              <div>
                <StatusBadge status={proposal.status} />
              </div>
              <p className="text-sm text-slate-500">Due {formatDate(proposal.dueDate)}</p>
              <div className="flex flex-wrap gap-2">
                <LinkButton
                  className="px-3 py-1.5 text-xs"
                  href={`/dashboard/proposals/${proposal.id}`}
                  variant="secondary"
                >
                  View
                </LinkButton>
                <LinkButton
                  className="px-3 py-1.5 text-xs"
                  href={`/dashboard/proposals/${proposal.id}/edit`}
                  variant="secondary"
                >
                  Edit
                </LinkButton>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function ClientDetails({
  client,
  stats,
  groupedProposals,
}: {
  client: {
    id: string;
    name: string;
    company: string;
    email: string;
    createdAt: Date;
  };
  stats: {
    totalProposals: number;
    totalProposalValue: number;
    acceptedProposalValue: number;
    activeDeals: number;
    upcomingDeals: number;
    closedDeals: number;
  };
  groupedProposals: {
    activeDeals: ClientProposalItem[];
    upcomingDeals: ClientProposalItem[];
    closedDeals: ClientProposalItem[];
  };
}) {
  const createProposalHref = `/dashboard/proposals/new?clientId=${encodeURIComponent(client.id)}`;
  const hasProposals = stats.totalProposals > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Client account</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{client.name}</h2>
          <p className="mt-2 text-sm text-slate-500">
            {client.company} | {client.email} | Added {formatDate(client.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <LinkButton href={createProposalHref}>Create proposal for this client</LinkButton>
          <LinkButton href="/dashboard/clients" variant="secondary">
            Back to clients
          </LinkButton>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="space-y-1">
            <p className="text-sm font-medium text-slate-500">Total proposals</p>
            <p className="text-2xl font-semibold text-slate-950">{stats.totalProposals}</p>
            <p className="text-sm text-slate-500">Connected deals for this client</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-sm font-medium text-slate-500">Total proposal value</p>
            <p className="text-2xl font-semibold text-slate-950">
              {formatCurrency(stats.totalProposalValue)}
            </p>
            <p className="text-sm text-slate-500">Combined value across all deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-sm font-medium text-slate-500">Accepted value</p>
            <p className="text-2xl font-semibold text-slate-950">
              {formatCurrency(stats.acceptedProposalValue)}
            </p>
            <p className="text-sm text-slate-500">Closed-won value for this client</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-sm font-medium text-slate-500">Deal breakdown</p>
            <p className="text-2xl font-semibold text-slate-950">
              {stats.activeDeals}/{stats.upcomingDeals}/{stats.closedDeals}
            </p>
            <p className="text-sm text-slate-500">Active, upcoming, and closed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {!hasProposals ? (
            <Card>
              <CardHeader
                title="No deals yet"
                description="This client is ready for their first proposal."
              />
              <CardContent>
                <p className="text-sm leading-6 text-slate-600">
                  Create a proposal for {client.company} to start tracking active, upcoming, and closed deals here.
                </p>
                <LinkButton className="mt-5" href={createProposalHref}>
                  Create proposal for this client
                </LinkButton>
              </CardContent>
            </Card>
          ) : null}

          <DealSection
            description="Deals currently in motion with draft, sent, or viewed status."
            emptyDescription="Deals in progress will show up here as soon as a draft or sent proposal exists."
            emptyTitle="No active deals"
            proposals={groupedProposals.activeDeals}
            title="Active deals"
          />
          <DealSection
            description="All proposals with a future due date, including ones that are also active."
            emptyDescription="Future due dates will show here so upcoming work is easy to spot."
            emptyTitle="No upcoming deals"
            proposals={groupedProposals.upcomingDeals}
            title="Upcoming deals"
          />
          <DealSection
            description="Completed outcomes for this client, including accepted and rejected proposals."
            emptyDescription="Accepted or rejected proposals will appear here once decisions are made."
            emptyTitle="No closed deals"
            proposals={groupedProposals.closedDeals}
            title="Closed deals"
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Client summary" description="Relationship-level view for this account." />
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Contact</p>
                <p className="mt-1 font-semibold text-slate-950">{client.name}</p>
                <p className="text-sm text-slate-600">{client.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Company</p>
                <p className="mt-1 text-slate-800">{client.company}</p>
              </div>
              <div className="grid grid-cols-3 gap-3 rounded-lg bg-slate-50 p-4 text-center">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Active</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{stats.activeDeals}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Upcoming</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{stats.upcomingDeals}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Closed</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{stats.closedDeals}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
