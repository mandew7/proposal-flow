import { Card } from "@/components/ui/card";
import type { DashboardStat } from "@/lib/types";
import { cn } from "@/lib/utils";

const toneStyles: Record<DashboardStat["tone"], string> = {
  neutral: "text-slate-500",
  positive: "text-emerald-700",
  warning: "text-amber-700",
};

export function StatsCard({ stat }: { stat: DashboardStat }) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-slate-500">{stat.label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
      <p className={cn("mt-2 text-sm font-medium", toneStyles[stat.tone])}>{stat.change}</p>
    </Card>
  );
}
