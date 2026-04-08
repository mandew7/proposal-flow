"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import {
  updatePasswordAction,
  updateProfileAction,
  type SettingsActionState,
} from "@/app/actions/settings";
import { useToast } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

const initialState: SettingsActionState = { message: "", tone: "error" };

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" variant="secondary">
      {pending ? "Saving..." : label}
    </Button>
  );
}

function Message({ state }: { state: SettingsActionState }) {
  if (!state.message) {
    return null;
  }

  return (
    <p
      className={`rounded-lg border px-4 py-3 text-sm font-medium ${
        state.tone === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      {state.message}
    </p>
  );
}

export function SettingsPanel({
  user,
}: {
  user: { name: string; email: string; role: string };
}) {
  const [profileState, profileAction] = useActionState(updateProfileAction, initialState);
  const [passwordState, passwordAction] = useActionState(updatePasswordAction, initialState);
  const { showToast } = useToast();

  useEffect(() => {
    if (profileState.message) {
      showToast(profileState);
    }
  }, [profileState, showToast]);

  useEffect(() => {
    if (passwordState.message) {
      showToast(passwordState);
    }
  }, [passwordState, showToast]);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader title="Profile" description="Personal information for the current user." />
        <CardContent>
          <form action={profileAction} className="space-y-5">
            <Message state={profileState} />
            <div className="space-y-2">
              <Label htmlFor="profile-name">Name</Label>
              <Input id="profile-name" name="name" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input id="profile-email" defaultValue={user.email} disabled type="email" />
            </div>
            <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {user.role}
            </div>
            <div>
              <SaveButton label="Save profile" />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Password" description="Update your local account password." />
        <CardContent>
          <form action={passwordAction} className="space-y-5">
            <Message state={passwordState} />
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input id="new-password" name="password" placeholder="At least 8 characters" type="password" />
            </div>
            <SaveButton label="Update password" />
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Company info" description="Details used across proposal documents." />
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company name</Label>
            <Input id="company-name" defaultValue="ProposalFlow Studio" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-site">Website</Label>
            <Input id="company-site" defaultValue="https://proposalflow.test" />
          </div>
          <Button type="button" variant="secondary">
            Save company
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Billing" description="Plan and invoices will connect to billing later." />
        <CardContent>
          <div className="rounded-lg bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-950">Studio plan</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Billing is still mocked for this MVP. Add subscription status, invoices, and payment
              management in a later iteration.
            </p>
            <Button className="mt-5" type="button" variant="secondary">
              Manage billing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
