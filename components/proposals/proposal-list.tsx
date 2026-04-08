"use client";

import { useMemo, useState } from "react";
import { Button, LinkButton } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/mock-data";
import { useProposalFlow } from "@/lib/proposalflow-store";
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
  const {
    clearFeedback,
    deleteProposal,
    feedback,
    isHydrated,
    proposals,
    updateProposalStatus,
  } = useProposalFlow();
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
  }, [proposals, query, status]);

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

      {feedback ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm font-medium ${
            feedback.tone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
          role="status"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{feedback.message}</span>
            <button className="text-left text-xs font-semibold uppercase" onClick={clearFeedback} type="button">
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

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
            <div className="hidden grid-cols-[1.4fr_1fr_0.7fr_0.9fr_0.8fr_0.6fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 lg:grid">
              <span>Proposal</span>
              <span>Client</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Updated</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-slate-200">
              {!isHydrated ? (
                <div className="p-8 text-center text-sm text-slate-500">Loading proposals...</div>
              ) : filteredProposals.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="font-semibold text-slate-950">No proposals found</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Create a proposal or adjust your search and filters.
                  </p>
                  <LinkButton className="mt-5" href="/dashboard/proposals/new">
                    New Proposal
                  </LinkButton>
                </div>
              ) : (
                filteredProposals.map((proposal) => (
                  <div
                    className="grid gap-4 px-4 py-4 lg:grid-cols-[1.4fr_1fr_0.7fr_0.9fr_0.8fr_0.6fr] lg:items-center"
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
                    <div className="space-y-2">
                      <StatusBadge status={proposal.status} />
                      <select
                        aria-label={`Change status for ${proposal.title}`}
                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        onChange={(event) =>
                          updateProposalStatus(proposal.id, event.target.value as ProposalStatus)
                        }
                        value={proposal.status}
                      >
                        {statuses
                          .filter((item): item is ProposalStatus => item !== "All")
                          .map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                      </select>
                    </div>
                    <p className="text-sm text-slate-500">{proposal.updatedAt}</p>
                    <Button
                      onClick={() => deleteProposal(proposal.id)}
                      type="button"
                      variant="danger"
                    >
                      Delete
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
