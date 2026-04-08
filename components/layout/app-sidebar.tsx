import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Proposals", href: "/dashboard/proposals" },
  { label: "Clients", href: "/dashboard/clients" },
  { label: "Settings", href: "/dashboard/settings" },
];

export function AppSidebar({ role }: { role?: string }) {
  const items =
    role === "ADMIN"
      ? [
          ...navItems,
          { label: "Admin", href: "/admin" },
          { label: "Admin Users", href: "/admin/users" },
          { label: "Admin Activity", href: "/admin/activity" },
          { label: "Admin Proposals", href: "/admin/proposals" },
        ]
      : navItems;

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-950 text-white lg:block">
      <div className="flex h-full min-h-screen flex-col">
        <div className="border-b border-white/10 px-6 py-6">
          <Link href="/" className="text-xl font-semibold">
            ProposalFlow
          </Link>
          <p className="mt-1 text-sm text-slate-400">Proposal workspace</p>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-5">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="m-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <p className="text-sm font-semibold">Pipeline health</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            64% of active proposals have been viewed by decision makers.
          </p>
        </div>
      </div>
    </aside>
  );
}
