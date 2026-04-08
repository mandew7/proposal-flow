import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProposalFlow | Proposal management for modern teams",
  description:
    "Create, send, and track polished client proposals from one focused workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
