export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  tone: "neutral" | "positive" | "warning";
}
