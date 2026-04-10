"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { createClientAction, type ClientActionState } from "@/app/actions/clients";
import { useToast } from "@/app/providers";
import { Button, LinkButton } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { formatCurrency } from "@/lib/format";

interface ClientListItem {
  id: string;
  name: string;
  company: string;
  email: string;
  proposals: number;
  totalValue: number;
}

const initialState: ClientActionState = { message: "", tone: "error" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending ? "Saving..." : "Save Client"}
    </Button>
  );
}

export function ClientManagement({ clients }: { clients: ClientListItem[] }) {
  const [state, formAction] = useActionState(createClientAction, initialState);
  const { showToast } = useToast();
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [query, setQuery] = useState("");

  const filteredClients = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    return clients.filter((client) =>
      `${client.name} ${client.company} ${client.email}`.toLowerCase().includes(normalizedQuery),
    );
  }, [clients, query]);

  useEffect(() => {
    if (state.message) {
      showToast(state);

      if (state.tone === "success") {
        setIsAddingClient(false);
      }
    }
  }, [showToast, state]);

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

      {isAddingClient ? (
        <Card>
          <CardContent>
            <form action={formAction} className="grid gap-5 lg:grid-cols-[1fr_1fr_1fr_auto]">
              <div className="space-y-2">
                <Label htmlFor="client-name">Name</Label>
                <Input id="client-name" name="name" placeholder="Taylor Morgan" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-company">Company</Label>
                <Input id="client-company" name="company" placeholder="Acme Studio" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-email">Email</Label>
                <Input id="client-email" name="email" placeholder="taylor@acme.studio" type="email" />
              </div>
              <div className="flex items-end">
                <SubmitButton />
              </div>
            </form>
            {state.message ? (
              <p
                className={`mt-4 rounded-lg border px-4 py-3 text-sm font-medium ${
                  state.tone === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {state.message}
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
            placeholder="Search clients by name, company, or email..."
            type="search"
            value={query}
          />
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="hidden grid-cols-[1fr_1fr_1.2fr_0.6fr_0.8fr_0.8fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 lg:grid">
              <span>Name</span>
              <span>Company</span>
              <span>Email</span>
              <span>Proposals</span>
              <span>Total value</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-slate-200">
              {filteredClients.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="font-semibold text-slate-950">No clients found</p>
                  <p className="mt-2 text-sm text-slate-500">
                    {query
                      ? "Try a different name, company, or email search."
                      : "Add your first client to start building proposal history."}
                  </p>
                  {!query ? (
                    <Button className="mt-5" onClick={() => setIsAddingClient(true)} type="button">
                      Add your first client
                    </Button>
                  ) : null}
                </div>
              ) : (
                filteredClients.map((client) => (
                  <div
                    className="grid gap-3 px-4 py-4 lg:grid-cols-[1fr_1fr_1.2fr_0.6fr_0.8fr_0.8fr] lg:items-center"
                    key={client.id}
                  >
                    <Link
                      className="font-semibold text-slate-950 hover:text-slate-700"
                      href={`/dashboard/clients/${client.id}`}
                    >
                      {client.name}
                    </Link>
                    <p className="text-sm text-slate-700">{client.company}</p>
                    <p className="text-sm text-slate-500">{client.email}</p>
                    <p className="text-sm font-semibold text-slate-950">{client.proposals}</p>
                    <p className="text-sm font-semibold text-slate-950">
                      {formatCurrency(client.totalValue)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <LinkButton
                        className="px-3 py-1.5 text-xs"
                        href={`/dashboard/clients/${client.id}`}
                        variant="secondary"
                      >
                        View
                      </LinkButton>
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
