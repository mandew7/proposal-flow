export type ProposalStatus = "Draft" | "Sent" | "Viewed" | "Accepted" | "Rejected";

export interface Proposal {
  id: string;
  title: string;
  client: string;
  amount: number;
  status: ProposalStatus;
  updatedAt: string;
  dueDate: string;
  owner: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  proposals: number;
  totalValue: number;
}

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  tone: "neutral" | "positive" | "warning";
}

export interface ActivityItem {
  id: string;
  action: string;
  detail: string;
  time: string;
}
