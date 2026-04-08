import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/app/providers";
import { getFlashMessage } from "@/lib/flash";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProposalFlow | Proposal management for modern teams",
  description:
    "Create, send, and track polished client proposals from one focused workspace.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const initialToast = await getFlashMessage();

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Providers initialToast={initialToast}>{children}</Providers>
      </body>
    </html>
  );
}
