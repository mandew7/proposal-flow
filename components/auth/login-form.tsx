"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-store";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "error">("error");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setMessageTone("error");
    setIsSubmitting(true);

    const result = login(email, password);

    if (!result.ok) {
      setMessage(result.message);
      setIsSubmitting(false);
      return;
    }

    setMessageTone("success");
    setMessage(result.message);
    window.setTimeout(() => router.replace("/dashboard"), 250);
  }

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
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {message ? (
            <div
              className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                messageTone === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {message}
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="maya@proposalflow.com"
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
              placeholder="Password"
              type="password"
              value={password}
            />
          </div>
          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
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
