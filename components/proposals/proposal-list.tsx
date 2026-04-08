"use client";

import { useMemo, useState } from "react";
import { LinkButton } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency, proposals } from "@/lib/mock-data";
import type { ProposalStatus } from "@/lib/types";

const statuses: Array<"All" | ProposalStatus> = [
  "All",
  "Draft",
  "Sent",
  "Viewed",
  "Accepted",
  "Rejected",
];

export function ProposalList() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");

  const filteredProposals = useMemo(() => {
    return proposals.filter((proposal) => {
      const matchesStatus = status === "All" || proposal.status === status;
      const matchesQuery = `${proposal.title} ${proposal.client}`
        .toLowerCase()
        .includes(query.toLowerCase());

      return matchesStatus && matchesQuery;
    });
  }, [query, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Proposals</h2>
          <p className="mt-2 text-sm text-slate-500">
            Manage draft, sent, viewed, and closed proposals from one pipeline.
          </p>
        </div>
        <LinkButton href="/dashboard/proposals/new">New Proposal</LinkButton>
      </div>

      <Card>
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Input
              className="lg:max-w-sm"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search proposals..."
              type="search"
              value={query}
            />
            <div className="flex flex-wrap gap-2">
              {statuses.map((item) => (
                <button
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                    status === item
                      ? "bg-slate-950 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                  key={item}
                  onClick={() => setStatus(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="hidden grid-cols-[1.5fr_1fr_0.7fr_0.7fr_0.8fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 lg:grid">
              <span>Proposal</span>
              <span>Client</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Updated</span>
            </div>
            <div className="divide-y divide-slate-200">
              {filteredProposals.map((proposal) => (
                <div
                  className="grid gap-4 px-4 py-4 lg:grid-cols-[1.5fr_1fr_0.7fr_0.7fr_0.8fr] lg:items-center"
                  key={proposal.id}
                >
                  <div>
                    <p className="font-semibold text-slate-950">{proposal.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{proposal.id}</p>
                  </div>
                  <p className="text-sm text-slate-700">{proposal.client}</p>
                  <p className="text-sm font-semibold text-slate-950">
                    {formatCurrency(proposal.amount)}
                  </p>
                  <StatusBadge status={proposal.status} />
                  <p className="text-sm text-slate-500">{proposal.updatedAt}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
