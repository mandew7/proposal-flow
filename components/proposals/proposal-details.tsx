import { LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate, formatMetadata } from "@/lib/format";
import Link from "next/link";

interface ProposalDetailItem {
  id: string;
  publicId: string;
  title: string;
  description: string;
  amount: number;
  status: string;
  dueDate: Date;
  updatedAt: Date;
  client: {
    id: string;
    name: string;
    company: string;
    email: string;
  } | null;
}

interface ProposalActivity {
  id: string;
  action: string;
  metadata: string | null;
  createdAt: Date;
}

export function ProposalDetails({
  proposal,
  activity,
}: {
  proposal: ProposalDetailItem;
  activity: ProposalActivity[];
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{proposal.title}</h2>
            <StatusBadge status={proposal.status} />
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Updated {formatDate(proposal.updatedAt)} | Due {formatDate(proposal.dueDate)}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <LinkButton href={`/dashboard/proposals/${proposal.id}/edit`} variant="secondary">
            Edit proposal
          </LinkButton>
          <LinkButton href={`/dashboard/proposals/${proposal.id}/pdf`} variant="secondary">
            Export PDF
          </LinkButton>
          <LinkButton href={`/p/${proposal.publicId}`}>Open shared view</LinkButton>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader title="Proposal overview" description="Full proposal details and delivery summary." />
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-medium text-slate-500">Description</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {proposal.description}
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-slate-500">Amount</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {formatCurrency(proposal.amount)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Share link</p>
                <p className="mt-2 break-all text-sm text-slate-700">/p/{proposal.publicId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Client" description="Primary recipient for this proposal." />
            <CardContent className="space-y-3">
              {proposal.client ? (
                <Link
                  className="font-semibold text-slate-950 hover:text-slate-700"
                  href={`/dashboard/clients/${proposal.client.id}`}
                >
                  {proposal.client.company}
                </Link>
              ) : (
                <p className="font-semibold text-slate-950">No client attached</p>
              )}
              <p className="text-sm text-slate-600">{proposal.client?.name ?? "No contact"}</p>
              <p className="text-sm text-slate-500">{proposal.client?.email ?? "No email"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Activity" description="Server-tracked history for this proposal." />
            <CardContent className="space-y-4">
              {activity.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                  No proposal activity yet.
                </p>
              ) : (
                activity.map((item) => (
                  <div className="border-l-2 border-slate-200 pl-4" key={item.id}>
                    <p className="text-sm font-semibold text-slate-950">
                      {item.action.replaceAll("_", " ")}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                    {item.metadata ? (
                      <p className="mt-2 text-sm text-slate-600">{formatMetadata(item.metadata)}</p>
                    ) : null}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
