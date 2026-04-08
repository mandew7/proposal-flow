import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatMetadata } from "@/lib/format";
import { getAdminOverviewData } from "@/lib/services/user-service";

export default async function AdminActivityPage() {
  const { activity } = await getAdminOverviewData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Activity</h2>
        <p className="mt-2 text-sm text-slate-500">
          Platform-wide event stream for user and proposal actions.
        </p>
      </div>

      <Card>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="hidden grid-cols-[0.8fr_1fr_0.8fr_0.7fr_1.2fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 lg:grid">
              <span>Time</span>
              <span>Actor</span>
              <span>Action</span>
              <span>Entity</span>
              <span>Metadata</span>
            </div>
            <div className="divide-y divide-slate-200">
              {activity.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">No activity logged yet.</div>
              ) : (
                activity.map((item) => (
                  <div
                    className="grid gap-3 px-4 py-4 lg:grid-cols-[0.8fr_1fr_0.8fr_0.7fr_1.2fr] lg:items-center"
                    key={item.id}
                  >
                    <p className="text-sm text-slate-500">{formatDate(item.createdAt)}</p>
                    <p className="text-sm font-semibold text-slate-950">{item.actorUser?.email ?? "System"}</p>
                    <p className="text-sm text-slate-700">{item.action.replaceAll("_", " ")}</p>
                    <p className="text-sm text-slate-700">{item.entityType}</p>
                    <p className="break-words text-xs text-slate-500">
                      {item.metadata ? formatMetadata(item.metadata) : "None"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
