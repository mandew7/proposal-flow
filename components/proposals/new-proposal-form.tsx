"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/mock-data";
import { useProposalFlow } from "@/lib/proposalflow-store";
import type { ProposalStatus } from "@/lib/types";

const statuses: ProposalStatus[] = ["Draft", "Sent", "Viewed", "Accepted", "Rejected"];

export function NewProposalForm() {
  const router = useRouter();
  const { addProposal, isHydrated } = useProposalFlow();
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<ProposalStatus>("Draft");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amountPreview = useMemo(() => {
    const numericAmount = Number(amount);
    return Number.isFinite(numericAmount) ? formatCurrency(numericAmount) : "$0";
  }, [amount]);

  function handleSubmit(nextStatus: ProposalStatus) {
    setError("");

    const numericAmount = Number(amount);

    if (!title.trim() || !client.trim() || !description.trim() || !amount.trim() || !dueDate) {
      setError("Please complete the title, client, description, amount, and due date.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    setIsSubmitting(true);

    addProposal({
      title: title.trim(),
      client: client.trim(),
      description: description.trim(),
      amount: numericAmount,
      status: nextStatus,
      dueDate,
    });

    router.push("/dashboard/proposals");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card>
        <CardHeader
          title="Proposal details"
          description="Use this form shape now so API and persistence wiring can come later."
        />
        <CardContent>
          <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                {error}
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="title">Proposal title</Label>
              <Input
                id="title"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Website redesign and conversion sprint"
                value={title}
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client">Client name</Label>
                <Input
                  id="client"
                  onChange={(event) => setClient(event.target.value)}
                  placeholder="Northstar Labs"
                  value={client}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  min="0"
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
                  onChange={(event) => setStatus(event.target.value as ProposalStatus)}
                  value={status}
                >
                  {statuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="due-date">Due date</Label>
                <Input
                  id="due-date"
                  onChange={(event) => setDueDate(event.target.value)}
                  type="date"
                  value={dueDate}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <Button
                disabled={!isHydrated || isSubmitting}
                onClick={() => handleSubmit("Draft")}
                type="button"
                variant="secondary"
              >
                {isSubmitting ? "Saving..." : "Save Draft"}
              </Button>
              <Button
                disabled={!isHydrated || isSubmitting}
                onClick={() => handleSubmit("Sent")}
                type="button"
              >
                {isSubmitting ? "Saving..." : "Send Proposal"}
              </Button>
            </div>
          </form>
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
            <p className="mt-1 text-slate-800">{client || "No client selected"}</p>
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
