import { ProposalList } from "@/components/proposals/proposal-list";
import { requireUser } from "@/lib/auth";
import { listProposalsForUser } from "@/lib/services/proposal-service";

export default async function ProposalsPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const proposals = await listProposalsForUser(user.id);

  return (
    <ProposalList
      message={params?.message}
      proposals={proposals.map((proposal) => ({
        id: proposal.id,
        title: proposal.title,
        description: proposal.description,
        clientId: proposal.client?.id ?? null,
        clientName: proposal.client?.company ?? "No client",
        amount: proposal.amount,
        status: proposal.status,
        updatedAt: proposal.updatedAt.toISOString(),
      }))}
    />
  );
}
