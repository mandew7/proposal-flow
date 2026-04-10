"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type AuthActionState } from "@/app/actions/auth";
import { useToast } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

const initialState: AuthActionState = {
  message: "",
  tone: "error",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" disabled={pending} type="submit">
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  );
}

export function LoginForm({ demoPassword }: { demoPassword: string }) {
  const [state, formAction] = useActionState(loginAction, initialState);
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const demoAccounts = [
    { label: "Demo user", email: "maya@proposalflow.demo", password: demoPassword, role: "User workspace" },
    { label: "Second demo", email: "ethan@proposalflow.demo", password: demoPassword, role: "User workspace" },
    { label: "Admin", email: "admin@proposalflow.demo", password: demoPassword, role: "Admin area" },
  ] as const;

  useEffect(() => {
    if (state.message && state.tone === "error") {
      showToast(state);
    }
  }, [showToast, state]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <Link href="/" className="text-xl font-semibold text-slate-950">
          ProposalFlow
        </Link>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight text-slate-950">
          Welcome back
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Sign in to review proposals, clients, and your current pipeline.
        </p>
        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">Demo login</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Use one of the seeded accounts to explore the workspace right away.
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {demoAccounts.map((account) => (
              <button
                className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-slate-300 hover:bg-slate-50"
                key={account.email}
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
                type="button"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-950">{account.label}</p>
                  <p className="text-xs text-slate-500">{account.role}</p>
                </div>
                <p className="text-xs text-slate-500">{account.email}</p>
              </button>
            ))}
          </div>
        </div>
        <form action={formAction} className="mt-8 space-y-5">
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="maya@proposalflow.demo"
              type="email"
              value={email}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder={demoPassword}
              type="password"
              value={password}
            />
          </div>
          <SubmitButton />
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          New to ProposalFlow?{" "}
          <Link className="font-semibold text-slate-950" href="/register">
            Create an account
          </Link>
        </p>
      </Card>
    </main>
  );
}
