"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAuthHydrated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isAuthHydrated && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isAuthHydrated, pathname, router]);

  if (!isAuthHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-sm font-medium text-slate-500">
        Checking your session...
      </div>
    );
  }

  return <>{children}</>;
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAuthHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthHydrated && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isAuthHydrated, router]);

  if (!isAuthHydrated || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-sm font-medium text-slate-500">
        Loading account...
      </div>
    );
  }

  return <>{children}</>;
}
