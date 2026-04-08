import { ProposalForm } from "@/components/proposals/proposal-form";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function NewProposalPage() {
  const user = await requireUser();
  const clients = await prisma.client.findMany({
    where: { userId: user.id },
    orderBy: { company: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">New proposal</h2>
        <p className="mt-2 text-sm text-slate-500">
          Draft a client proposal now; real save and send actions can connect to APIs later.
        </p>
      </div>
      <ProposalForm
        clients={clients.map((client) => ({
          id: client.id,
          company: client.company,
          name: client.name,
        }))}
      />
    </div>
  );
}
