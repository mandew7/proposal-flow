import { notFound } from "next/navigation";
import { ClientDetails } from "@/components/clients/client-details";
import { requireUser } from "@/lib/auth";
import { getClientDetailsForUser } from "@/lib/services/client-service";

export default async function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const clientData = await getClientDetailsForUser(user.id, id);

  if (!clientData) {
    notFound();
  }

  return (
    <ClientDetails
      client={{
        id: clientData.client.id,
        name: clientData.client.name,
        company: clientData.client.company,
        email: clientData.client.email,
        createdAt: clientData.client.createdAt,
      }}
      groupedProposals={clientData.groupedProposals}
      stats={clientData.stats}
    />
  );
}
