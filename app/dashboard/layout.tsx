import type { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 lg:flex">
        <AppSidebar />
        <div className="min-w-0 flex-1">
          <AppHeader />
          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
