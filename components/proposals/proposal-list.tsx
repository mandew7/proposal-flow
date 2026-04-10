"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { changeProposalStatusAction, deleteProposalAction } from "@/app/actions/proposals";
import { Button, LinkButton } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";

const statuses = ["ALL", "DRAFT", "SENT", "VIEWED", "ACCEPTED", "REJECTED"] as const;
const proposalStatuses = ["DRAFT", "SENT", "VIEWED", "ACCEPTED", "REJECTED"] as const;

interface ProposalListItem {
  id: string;
  title: string;
  description: string;
  clientId: string | null;
  clientName: string;
  amount: number;
  status: string;
  updatedAt: string;
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

export function ProposalList({
  proposals,
  message,
}: {
  proposals: ProposalListItem[];
  message?: string;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("ALL");

  const filteredProposals = useMemo(() => {
    return proposals.filter((proposal) => {
      const matchesStatus = status === "ALL" || proposal.status === status;
      const matchesQuery = `${proposal.title} ${proposal.description} ${proposal.clientName} ${proposal.status}`
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

      {message ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {message}
        </div>
      ) : null}

      <Card>
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Input
              className="lg:max-w-sm"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search proposals by title, description, client, or status..."
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
                  {formatStatus(item)}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="hidden grid-cols-[1.3fr_1fr_0.7fr_0.9fr_0.8fr_0.8fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 lg:grid">
              <span>Proposal</span>
              <span>Client</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Updated</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-slate-200">
              {filteredProposals.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="font-semibold text-slate-950">No proposals found</p>
                  <p className="mt-2 text-sm text-slate-500">
                    {query || status !== "ALL"
                      ? "Adjust your search or status filter to find matching proposals."
                      : "Create your first proposal to start building a live pipeline."}
                  </p>
                  <LinkButton className="mt-5" href="/dashboard/proposals/new">
                    Create proposal
                  </LinkButton>
                </div>
              ) : (
                filteredProposals.map((proposal) => (
                  <div
                    className="grid gap-4 px-4 py-4 lg:grid-cols-[1.3fr_1fr_0.7fr_0.9fr_0.8fr_0.8fr] lg:items-center"
                    key={proposal.id}
                  >
                    <div>
                      <Link
                        className="font-semibold text-slate-950 hover:text-slate-700"
                        href={`/dashboard/proposals/${proposal.id}`}
                      >
                        {proposal.title}
                      </Link>
                      <p className="mt-1 text-xs text-slate-500">{proposal.id}</p>
                    </div>
                    {proposal.clientId ? (
                      <Link
                        className="text-sm text-slate-700 hover:text-slate-950"
                        href={`/dashboard/clients/${proposal.clientId}`}
                      >
                        {proposal.clientName}
                      </Link>
                    ) : (
                      <p className="text-sm text-slate-700">{proposal.clientName}</p>
                    )}
                    <p className="text-sm font-semibold text-slate-950">
                      {formatCurrency(proposal.amount)}
                    </p>
                    <div className="space-y-2">
                      <StatusBadge status={proposal.status} />
                      <form action={changeProposalStatusAction}>
                        <input name="id" type="hidden" value={proposal.id} />
                        <select
                          aria-label={`Change status for ${proposal.title}`}
                          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                          defaultValue={proposal.status}
                          name="status"
                          onChange={(event) => event.currentTarget.form?.requestSubmit()}
                        >
                          {proposalStatuses.map((item) => (
                            <option key={item} value={item}>
                              {formatStatus(item)}
                            </option>
                          ))}
                        </select>
                      </form>
                    </div>
                    <p className="text-sm text-slate-500">{formatDate(proposal.updatedAt)}</p>
                    <div className="flex flex-wrap gap-2">
                      <LinkButton
                        className="px-3 py-1.5 text-xs"
                        href={`/dashboard/proposals/${proposal.id}`}
                        variant="secondary"
                      >
                        View
                      </LinkButton>
                      <LinkButton
                        className="px-3 py-1.5 text-xs"
                        href={`/dashboard/proposals/${proposal.id}/edit`}
                        variant="secondary"
                      >
                        Edit
                      </LinkButton>
                      <form
                        action={deleteProposalAction}
                        onSubmit={(event) => {
                          if (!window.confirm("Delete this proposal? This cannot be undone.")) {
                            event.preventDefault();
                          }
                        }}
                      >
                        <input name="id" type="hidden" value={proposal.id} />
                        <Button className="px-3 py-1.5 text-xs" type="submit" variant="danger">
                          Delete
                        </Button>
                      </form>
                    </div>
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
