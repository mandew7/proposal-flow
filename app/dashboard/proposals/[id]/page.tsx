import { notFound } from "next/navigation";
import { ProposalDetails } from "@/components/proposals/proposal-details";
import { requireUser } from "@/lib/auth";
import { getProposalById } from "@/lib/services/proposal-service";

export default async function ProposalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const proposalData = await getProposalById(user.id, id);

  if (!proposalData) {
    notFound();
  }

  return (
    <ProposalDetails
      activity={proposalData.activity}
      proposal={{
        id: proposalData.proposal.id,
        publicId: proposalData.proposal.publicId,
        title: proposalData.proposal.title,
        description: proposalData.proposal.description,
        amount: proposalData.proposal.amount,
        status: proposalData.proposal.status,
        dueDate: proposalData.proposal.dueDate,
        updatedAt: proposalData.proposal.updatedAt,
        client: proposalData.proposal.client
          ? {
              id: proposalData.proposal.client.id,
              name: proposalData.proposal.client.name,
              company: proposalData.proposal.client.company,
              email: proposalData.proposal.client.email,
            }
          : null,
      }}
    />
  );
}
