"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { formatCurrency } from "@/lib/mock-data";
import { useProposalFlow } from "@/lib/proposalflow-store";

export function ClientManagement() {
  const { addClient, clearFeedback, clients, feedback, isHydrated, proposals } = useProposalFlow();
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clientsWithMetrics = useMemo(() => {
    return clients.map((client) => {
      const clientProposals = proposals.filter((proposal) => {
        const proposalClient = proposal.client.toLowerCase();
        return (
          proposalClient === client.company.toLowerCase() ||
          proposalClient === client.name.toLowerCase()
        );
      });

      return {
        ...client,
        proposals: clientProposals.length,
        totalValue: clientProposals.reduce((total, proposal) => total + proposal.amount, 0),
      };
    });
  }, [clients, proposals]);

  const filteredClients = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    return clientsWithMetrics.filter((client) =>
      `${client.name} ${client.company} ${client.email}`.toLowerCase().includes(normalizedQuery),
    );
  }, [clientsWithMetrics, query]);

  function resetForm() {
    setName("");
    setCompany("");
    setEmail("");
    setError("");
    setIsSubmitting(false);
  }

  function handleSubmit() {
    setError("");

    if (!name.trim() || !company.trim() || !email.trim()) {
      setError("Please complete the client name, company, and email.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid client email address.");
      return;
    }

    setIsSubmitting(true);
    addClient({
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
    });
    resetForm();
    setIsAddingClient(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Clients</h2>
          <p className="mt-2 text-sm text-slate-500">
            Keep account contacts and proposal value organized before CRM integration.
          </p>
        </div>
        <Button onClick={() => setIsAddingClient((current) => !current)} type="button">
          {isAddingClient ? "Close Form" : "Add Client"}
        </Button>
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

      {isAddingClient ? (
        <Card>
          <CardContent>
            <form className="grid gap-5 lg:grid-cols-[1fr_1fr_1fr_auto]" onSubmit={(event) => event.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="client-name">Name</Label>
                <Input
                  id="client-name"
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Taylor Morgan"
                  value={name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-company">Company</Label>
                <Input
                  id="client-company"
                  onChange={(event) => setCompany(event.target.value)}
                  placeholder="Acme Studio"
                  value={company}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-email">Email</Label>
                <Input
                  id="client-email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="taylor@acme.studio"
                  type="email"
                  value={email}
                />
              </div>
              <div className="flex items-end">
                <Button disabled={!isHydrated || isSubmitting} onClick={handleSubmit} type="button">
                  {isSubmitting ? "Saving..." : "Save Client"}
                </Button>
              </div>
            </form>
            {error ? (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                {error}
              </p>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardContent className="space-y-5">
          <Input
            className="lg:max-w-sm"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search clients..."
            type="search"
            value={query}
          />
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="hidden grid-cols-[1fr_1fr_1.2fr_0.6fr_0.8fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 lg:grid">
              <span>Name</span>
              <span>Company</span>
              <span>Email</span>
              <span>Proposals</span>
              <span>Total value</span>
            </div>
            <div className="divide-y divide-slate-200">
              {!isHydrated ? (
                <div className="p-8 text-center text-sm text-slate-500">Loading clients...</div>
              ) : filteredClients.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="font-semibold text-slate-950">No clients found</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Add a client or adjust your search query.
                  </p>
                </div>
              ) : (
                filteredClients.map((client) => (
                  <div
                    className="grid gap-3 px-4 py-4 lg:grid-cols-[1fr_1fr_1.2fr_0.6fr_0.8fr] lg:items-center"
                    key={client.id}
                  >
                    <p className="font-semibold text-slate-950">{client.name}</p>
                    <p className="text-sm text-slate-700">{client.company}</p>
                    <p className="text-sm text-slate-500">{client.email}</p>
                    <p className="text-sm font-semibold text-slate-950">{client.proposals}</p>
                    <p className="text-sm font-semibold text-slate-950">
                      {formatCurrency(client.totalValue)}
                    </p>
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
