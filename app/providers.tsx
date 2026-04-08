"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth-store";
import { ProposalFlowProvider } from "@/lib/proposalflow-store";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ProposalFlowProvider>{children}</ProposalFlowProvider>
    </AuthProvider>
  );
}
