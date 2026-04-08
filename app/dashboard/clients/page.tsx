import { ClientManagement } from "@/components/clients/client-management";
import { requireUser } from "@/lib/auth";
import { listClientsForUser } from "@/lib/services/client-service";

export default async function ClientsPage() {
  const user = await requireUser();
  const clients = await listClientsForUser(user.id);

  return (
    <ClientManagement
      clients={clients.map((client) => ({
        id: client.id,
        name: client.name,
        company: client.company,
        email: client.email,
        proposals: client.proposals.length,
        totalValue: client.proposals.reduce((total, proposal) => total + proposal.amount, 0),
      }))}
    />
  );
}
