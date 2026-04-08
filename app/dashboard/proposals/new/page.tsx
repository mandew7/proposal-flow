import { NewProposalForm } from "@/components/proposals/new-proposal-form";

export default function NewProposalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">New proposal</h2>
        <p className="mt-2 text-sm text-slate-500">
          Draft a client proposal now; real save and send actions can connect to APIs later.
        </p>
      </div>
      <NewProposalForm />
    </div>
  );
}
