import { notFound } from "next/navigation";
import { ProposalForm } from "@/components/proposals/proposal-form";
import { requireUser } from "@/lib/auth";
import { getProposalById, listProposalOptionsForUser } from "@/lib/services/proposal-service";

function dateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function EditProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const [proposalData, clients] = await Promise.all([
    getProposalById(user.id, id),
    listProposalOptionsForUser(user.id),
  ]);

  if (!proposalData) {
    notFound();
  }

  const { proposal } = proposalData;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Edit proposal</h2>
        <p className="mt-2 text-sm text-slate-500">
          Update scope, amount, due date, and pipeline status for this proposal.
        </p>
      </div>
      <ProposalForm
        clients={clients.map((client) => ({ id: client.id, company: client.company, name: client.name }))}
        proposal={{
          id: proposal.id,
          title: proposal.title,
          clientId: proposal.clientId ?? "",
          description: proposal.description,
          amount: proposal.amount,
          status: proposal.status,
          dueDate: dateInputValue(proposal.dueDate),
        }}
      />
    </div>
  );
}
