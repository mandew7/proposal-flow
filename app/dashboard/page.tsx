import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { requireUser } from "@/lib/auth";
import { formatMetadata } from "@/lib/format";
import { getUserDashboardData } from "@/lib/services/user-service";

export default async function DashboardPage() {
  const user = await requireUser();
  const { proposals, activity, stats } = await getUserDashboardData(user.id);

  return (
    <DashboardOverview
      activity={activity.map((item) => ({
        id: item.id,
        action: item.action.replaceAll("_", " "),
        detail: formatMetadata(item.metadata) || "Workspace activity",
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
