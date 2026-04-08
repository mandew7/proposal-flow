"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type AuthActionState } from "@/app/actions/auth";
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

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

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
            <Input id="email" name="email" placeholder="maya@proposalflow.com" type="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" placeholder="Password" type="password" />
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
