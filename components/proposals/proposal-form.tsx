"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  createProposalAction,
  updateProposalAction,
  type ProposalActionState,
} from "@/app/actions/proposals";
import { useToast } from "@/app/providers";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button, LinkButton } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";

const statuses = ["DRAFT", "SENT", "VIEWED", "ACCEPTED", "REJECTED"] as const;
const initialState: ProposalActionState = { message: "", tone: "error" };

interface ClientOption {
  id: string;
  company: string;
  name: string;
}

interface ProposalFormValue {
  id?: string;
  title: string;
  clientId: string;
  description: string;
  amount: number;
  status: string;
  dueDate: string;
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function SubmitButtons({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
      {!isEditing ? (
        <Button
          disabled={pending}
          name="submitStatus"
          type="submit"
          value="DRAFT"
          variant="secondary"
        >
          {pending ? "Saving..." : "Save Draft"}
        </Button>
      ) : null}
      <Button disabled={pending} type="submit">
        {pending ? "Saving..." : isEditing ? "Save Changes" : "Send Proposal"}
      </Button>
    </div>
  );
}

export function ProposalForm({
  clients,
  proposal,
}: {
  clients: ClientOption[];
  proposal?: ProposalFormValue;
}) {
  const isEditing = Boolean(proposal?.id);
  const action = isEditing ? updateProposalAction : createProposalAction;
  const [state, formAction] = useActionState(action, initialState);
  const { showToast } = useToast();
  const [title, setTitle] = useState(proposal?.title ?? "");
  const [clientId, setClientId] = useState(proposal?.clientId ?? clients[0]?.id ?? "");
  const [description, setDescription] = useState(proposal?.description ?? "");
  const [amount, setAmount] = useState(proposal?.amount ? String(proposal.amount) : "");
  const [status, setStatus] = useState(proposal?.status ?? "SENT");
  const [dueDate, setDueDate] = useState(proposal?.dueDate ?? "");

  const amountPreview = useMemo(() => {
    const numericAmount = Number(amount);
    return Number.isFinite(numericAmount) ? formatCurrency(numericAmount) : "$0";
  }, [amount]);
  const selectedClient = clients.find((client) => client.id === clientId);

  useEffect(() => {
    if (state.message) {
      showToast(state);
    }
  }, [showToast, state]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card>
        <CardHeader
          title={isEditing ? "Edit proposal" : "Proposal details"}
          description="Use structured proposal data that can power client-facing documents later."
        />
        <CardContent>
          {clients.length === 0 ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <p className="font-semibold">Add a client before creating a proposal.</p>
              <p className="mt-2">
                ProposalFlow connects each proposal to a real client record so dashboards and deal pages stay useful.
              </p>
              <LinkButton className="mt-4" href="/dashboard/clients" variant="secondary">
                Go to clients
              </LinkButton>
            </div>
          ) : (
            <form action={formAction} className="space-y-5">
              {proposal?.id ? <input name="id" type="hidden" value={proposal.id} /> : null}
              {state.message ? (
                <div
                  className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                    state.tone === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  {state.message}
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="title">Proposal title</Label>
                <Input
                  id="title"
                  name="title"
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Website redesign and conversion sprint"
                  value={title}
                />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client</Label>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    id="clientId"
                    name="clientId"
                    onChange={(event) => setClientId(event.target.value)}
                    value={clientId}
                  >
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.company} - {client.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    min="0"
                    name="amount"
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="24000"
                    type="number"
                    value={amount}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Project description</Label>
                <Textarea
                  id="description"
                  name="description"
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="A focused engagement covering discovery, design direction, build support, and launch handoff."
                  value={description}
                />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    id="status"
                    name="status"
                    onChange={(event) => setStatus(event.target.value)}
                    value={status}
                  >
                    {statuses.map((item) => (
                      <option key={item} value={item}>
                        {formatStatus(item)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due date</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    onChange={(event) => setDueDate(event.target.value)}
                    type="date"
                    value={dueDate}
                  />
                </div>
              </div>
              <SubmitButtons isEditing={isEditing} />
            </form>
          )}
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader title="Preview summary" description="Client-facing proposal snapshot." />
        <CardContent className="space-y-5">
          <div>
            <p className="text-sm font-medium text-slate-500">Title</p>
            <p className="mt-1 font-semibold text-slate-950">{title || "Untitled proposal"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Client</p>
            <p className="mt-1 text-slate-800">{selectedClient?.company ?? "No client selected"}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Amount</p>
              <p className="mt-1 font-semibold text-slate-950">{amountPreview}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Status</p>
              <div className="mt-1">
                <StatusBadge status={status} />
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Due date</p>
            <p className="mt-1 text-slate-800">{dueDate || "No due date"}</p>
          </div>
          <p className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            {description || "Add a short description to set clear expectations for the client."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
