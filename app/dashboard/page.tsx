import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/format";
import type { DashboardStat } from "@/lib/types";

export default async function DashboardPage() {
  const user = await requireUser();
  const [proposals, activity] = await Promise.all([
    prisma.proposal.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      include: { client: true },
    }),
    prisma.activityLog.findMany({
      where: { targetUserId: user.id },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const acceptedProposals = proposals.filter((proposal) => proposal.status === "ACCEPTED");
  const pendingProposals = proposals.filter((proposal) =>
    ["DRAFT", "SENT", "VIEWED"].includes(proposal.status),
  );
  const revenue = acceptedProposals.reduce((total, proposal) => total + proposal.amount, 0);
  const stats: DashboardStat[] = [
    { label: "Total proposals", value: String(proposals.length), change: "Saved in SQLite", tone: "neutral" },
    { label: "Accepted", value: String(acceptedProposals.length), change: "Closed deals", tone: "positive" },
    { label: "Pending", value: String(pendingProposals.length), change: "Draft, sent, or viewed", tone: "warning" },
    { label: "Revenue", value: formatCurrency(revenue), change: "Accepted proposal value", tone: "positive" },
  ];

  return (
    <DashboardOverview
      activity={activity.map((item) => ({
        id: item.id,
        action: item.action.replaceAll("_", " "),
        detail: item.metadata ?? "Workspace activity",
        createdAt: item.createdAt,
      }))}
      recentProposals={proposals.slice(0, 4).map((proposal) => ({
        id: proposal.id,
        title: proposal.title,
        clientName: proposal.client?.company ?? "No client",
        amount: proposal.amount,
        status: proposal.status,
        updatedAt: proposal.updatedAt,
      }))}
      stats={stats}
    />
  );
}
