import { ProposalForm } from "@/components/proposals/proposal-form";
import { requireUser } from "@/lib/auth";
import { listProposalOptionsForUser } from "@/lib/services/proposal-service";

export default async function NewProposalPage({
  searchParams,
}: {
  searchParams?: Promise<{ clientId?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const clients = await listProposalOptionsForUser(user.id);
  const requestedClientId = params?.clientId;
  const selectedClientId =
    requestedClientId && clients.some((client) => client.id === requestedClientId)
      ? requestedClientId
      : clients[0]?.id ?? "";

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
        proposal={
          selectedClientId
            ? {
                title: "",
                clientId: selectedClientId,
                description: "",
                amount: 0,
                status: "SENT",
                dueDate: "",
              }
            : undefined
        }
      />
    </div>
  );
}
