import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700 ring-slate-200",
  SENT: "bg-sky-50 text-sky-700 ring-sky-200",
  VIEWED: "bg-amber-50 text-amber-700 ring-amber-200",
  ACCEPTED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  REJECTED: "bg-red-50 text-red-700 ring-red-200",
};

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
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

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge className={statusStyles[status] ?? statusStyles.DRAFT}>{formatStatus(status)}</Badge>;
}
