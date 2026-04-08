import { ProposalList } from "@/components/proposals/proposal-list";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function ProposalsPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const proposals = await prisma.proposal.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { client: true },
  });

  return (
    <ProposalList
      message={params?.message}
      proposals={proposals.map((proposal) => ({
        id: proposal.id,
        title: proposal.title,
        clientName: proposal.client?.company ?? "No client",
        amount: proposal.amount,
        status: proposal.status,
        updatedAt: proposal.updatedAt.toISOString(),
      }))}
    />
  );
}
