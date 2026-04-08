"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import {
  respondToPublicProposalAction,
  type ProposalActionState,
} from "@/app/actions/proposals";
import { useToast } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const initialState: ProposalActionState = { message: "", tone: "error" };

function ResponseButtons({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button disabled={disabled || pending} name="status" type="submit" value="ACCEPTED">
        {pending ? "Saving..." : "Accept proposal"}
      </Button>
      <Button disabled={disabled || pending} name="status" type="submit" value="REJECTED" variant="secondary">
        {pending ? "Saving..." : "Decline proposal"}
      </Button>
    </div>
  );
}

export function PublicProposalResponse({
  publicId,
  status,
}: {
  publicId: string;
  status: string;
}) {
  const [state, formAction] = useActionState(respondToPublicProposalAction, initialState);
  const { showToast } = useToast();
  const isFinal = status === "ACCEPTED" || status === "REJECTED";

  useEffect(() => {
    if (state.message) {
      showToast(state);
    }
  }, [showToast, state]);

  return (
    <Card>
      <CardHeader
        title="Next step"
        description={
          isFinal
            ? "This proposal already has a recorded decision."
            : "Respond here so the ProposalFlow workspace updates instantly."
        }
      />
      <CardContent className="space-y-4">
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
        {isFinal ? (
          <p className="text-sm leading-6 text-slate-600">
            {status === "ACCEPTED"
              ? "This proposal has already been accepted. The owner can continue from their dashboard."
              : "This proposal has been declined. The owner can revise and resend if needed."}
          </p>
        ) : (
          <form action={formAction} className="space-y-4">
            <input name="publicId" type="hidden" value={publicId} />
            <p className="text-sm leading-6 text-slate-600">
              Review the details and record your decision. This will update the proposal status for the team immediately.
            </p>
            <ResponseButtons disabled={isFinal} />
          </form>
        )}
      </CardContent>
    </Card>
  );
}
