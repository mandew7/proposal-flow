import type { ActivityItem, Client, DashboardStat, Proposal } from "@/lib/types";

export const proposals: Proposal[] = [
  {
    id: "PF-1048",
    title: "Customer onboarding portal",
    client: "Northstar Labs",
    amount: 42000,
    status: "Viewed",
    updatedAt: "Apr 7, 2026",
    dueDate: "Apr 18, 2026",
    owner: "Maya Chen",
  },
  {
    id: "PF-1047",
    title: "Brand systems refresh",
    client: "Oak & Ember",
    amount: 18500,
    status: "Accepted",
    updatedAt: "Apr 5, 2026",
    dueDate: "Apr 14, 2026",
    owner: "Jordan Lee",
  },
  {
    id: "PF-1046",
    title: "Analytics implementation sprint",
    client: "Summit Freight",
    amount: 27600,
    status: "Sent",
    updatedAt: "Apr 3, 2026",
    dueDate: "Apr 21, 2026",
    owner: "Maya Chen",
  },
  {
    id: "PF-1045",
    title: "Sales enablement microsite",
    client: "Brightline Health",
    amount: 33800,
    status: "Draft",
    updatedAt: "Apr 1, 2026",
    dueDate: "Apr 24, 2026",
    owner: "Avery Stone",
  },
  {
    id: "PF-1044",
    title: "Partner portal discovery",
    client: "HarborPoint Capital",
    amount: 12500,
    status: "Rejected",
    updatedAt: "Mar 29, 2026",
    dueDate: "Apr 8, 2026",
    owner: "Jordan Lee",
  },
];

export const clients: Client[] = [
  {
    id: "CL-301",
    name: "Riley Brooks",
    company: "Northstar Labs",
    email: "riley@northstarlabs.co",
    proposals: 4,
    totalValue: 96800,
  },
  {
    id: "CL-302",
    name: "Samira Patel",
    company: "Oak & Ember",
    email: "samira@oakember.com",
    proposals: 2,
    totalValue: 31100,
  },
  {
    id: "CL-303",
    name: "Marcus King",
    company: "Summit Freight",
    email: "marcus@summitfreight.com",
    proposals: 3,
    totalValue: 64200,
  },
  {
    id: "CL-304",
    name: "Elena Voss",
    company: "Brightline Health",
    email: "elena@brightlinehealth.com",
    proposals: 5,
    totalValue: 128400,
  },
];

export const dashboardStats: DashboardStat[] = [
  { label: "Total proposals", value: "48", change: "+12% this month", tone: "positive" },
  { label: "Accepted", value: "19", change: "7 this quarter", tone: "positive" },
  { label: "Pending", value: "14", change: "5 viewed", tone: "warning" },
  { label: "Revenue", value: "$284.6k", change: "+$38.2k forecast", tone: "positive" },
];

export const activity: ActivityItem[] = [
  {
    id: "ACT-1",
    action: "Proposal viewed",
    detail: "Northstar Labs opened Customer onboarding portal.",
    time: "18 minutes ago",
  },
  {
    id: "ACT-2",
    action: "Proposal accepted",
    detail: "Oak & Ember approved Brand systems refresh.",
    time: "2 hours ago",
  },
  {
    id: "ACT-3",
    action: "Draft updated",
    detail: "Avery edited Sales enablement microsite.",
    time: "Yesterday",
  },
  {
    id: "ACT-4",
    action: "Client added",
    detail: "HarborPoint Capital was added to the pipeline.",
    time: "Mar 29",
  },
];

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
