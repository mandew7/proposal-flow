import type { ProposalStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<ProposalStatus, string> = {
  Draft: "bg-slate-100 text-slate-700 ring-slate-200",
  Sent: "bg-sky-50 text-sky-700 ring-sky-200",
  Viewed: "bg-amber-50 text-amber-700 ring-amber-200",
  Accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Rejected: "bg-red-50 text-red-700 ring-red-200",
};

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: ProposalStatus }) {
  return <Badge className={statusStyles[status]}>{status}</Badge>;
}
