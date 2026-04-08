import { ClientManagement } from "@/components/clients/client-management";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function ClientsPage() {
  const user = await requireUser();
  const clients = await prisma.client.findMany({
    where: { userId: user.id },
    orderBy: { company: "asc" },
    include: { proposals: true },
  });

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
