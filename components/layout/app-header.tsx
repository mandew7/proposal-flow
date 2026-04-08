"use client";

import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/proposals": "Proposals",
  "/dashboard/proposals/new": "New proposal",
  "/dashboard/clients": "Clients",
  "/dashboard/settings": "Settings",
  "/admin": "Admin",
  "/admin/users": "Users",
  "/admin/activity": "Activity",
  "/admin/proposals": "All proposals",
};

export function AppHeader({
  user,
}: {
  user: { name: string; email: string; role: string };
}) {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Workspace";
  const initials =
    user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PF";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex min-h-20 flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-sm font-medium text-slate-500">ProposalFlow</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            aria-label="Search workspace"
            className="sm:w-72"
            placeholder="Search proposals, clients..."
            type="search"
          />
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
              {initials}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-950">{user.name}</p>
              <p className="text-xs text-slate-500">{user.role === "ADMIN" ? "Admin" : "Founder plan"}</p>
            </div>
            <form action={logoutAction}>
              <Button className="px-3 py-1.5 text-xs" type="submit" variant="ghost">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
