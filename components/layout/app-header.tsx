"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/proposals": "Proposals",
  "/dashboard/proposals/new": "New proposal",
  "/dashboard/clients": "Clients",
  "/dashboard/settings": "Settings",
};

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const title = titles[pathname] ?? "Workspace";

  function handleLogout() {
    logout();
    router.replace("/login");
  }

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
              {currentUser?.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "PF"}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-950">{currentUser?.name ?? "ProposalFlow User"}</p>
              <p className="text-xs text-slate-500">Founder plan</p>
            </div>
            <Button className="px-3 py-1.5 text-xs" onClick={handleLogout} type="button" variant="ghost">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
