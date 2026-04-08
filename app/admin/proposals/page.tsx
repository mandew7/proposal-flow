import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function AdminProposalsPage() {
  const proposals = await prisma.proposal.findMany({
    orderBy: { updatedAt: "desc" },
    include: { user: true, client: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">All proposals</h2>
        <p className="mt-2 text-sm text-slate-500">
          Platform-wide proposal visibility for the admin account.
        </p>
      </div>
      <Card>
        <CardContent>
          <div className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200">
            {proposals.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">No proposals yet.</div>
            ) : (
              proposals.map((proposal) => (
                <div className="grid gap-3 px-4 py-4 lg:grid-cols-[1fr_1fr_0.8fr_0.6fr_0.7fr]" key={proposal.id}>
                  <div>
                    <p className="font-semibold text-slate-950">{proposal.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{proposal.user.email}</p>
                  </div>
                  <p className="text-sm text-slate-700">{proposal.client?.company ?? "No client"}</p>
                  <p className="text-sm font-semibold text-slate-950">{formatCurrency(proposal.amount)}</p>
                  <StatusBadge status={proposal.status} />
                  <p className="text-sm text-slate-500">{formatDate(proposal.updatedAt)}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
