import { notFound } from "next/navigation";
import { PublicProposalResponse } from "@/components/proposals/public-proposal-response";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { registerPublicProposalView } from "@/lib/services/proposal-service";

export default async function PublicProposalPage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = await params;
  const proposal = await registerPublicProposalView(publicId);

  if (!proposal) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            ProposalFlow
          </p>
          <div className="mt-3 flex items-center gap-3">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">{proposal.title}</h1>
            <StatusBadge status={proposal.status} />
          </div>
          <p className="mt-3 text-sm text-slate-500">
            For {proposal.client?.company ?? "Client"} | Due {formatDate(proposal.dueDate)}
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Card>
            <CardHeader title="Proposal summary" description="A shared client view with live response tracking." />
            <CardContent className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-slate-500">Client</p>
                  <p className="mt-2 font-semibold text-slate-950">{proposal.client?.company ?? "No client"}</p>
                  <p className="mt-1 text-sm text-slate-600">{proposal.client?.name ?? "No contact"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Amount</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {formatCurrency(proposal.amount)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Description</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {proposal.description}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <PublicProposalResponse publicId={proposal.publicId} status={proposal.status} />

            <Card>
              <CardHeader title="Prepared by" description="Proposal owner details." />
              <CardContent className="space-y-2">
                <p className="font-semibold text-slate-950">{proposal.user.name}</p>
                <p className="text-sm text-slate-500">{proposal.user.email}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
