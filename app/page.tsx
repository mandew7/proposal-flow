import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/section-title";

const features = [
  {
    title: "Proposal builder",
    description: "Turn scoped work, pricing, and terms into client-ready proposals without formatting drag.",
  },
  {
    title: "Pipeline visibility",
    description: "See which deals are drafted, sent, viewed, accepted, or stalled from one place.",
  },
  {
    title: "Client workspace",
    description: "Keep client contacts, proposal history, and deal value organized for every account.",
  },
  {
    title: "Fast follow-up",
    description: "Spot viewed proposals and prioritize the next message while interest is still warm.",
  },
];

const steps = [
  "Create a proposal from your sales notes and project scope.",
  "Send a polished link that feels consistent with your brand.",
  "Track progress and follow up when the client is ready to move.",
];

const plans = [
  { name: "Starter", price: "$19", description: "For solo consultants", features: ["10 active proposals", "Client records", "Basic analytics"] },
  { name: "Studio", price: "$49", description: "For small teams", features: ["Unlimited proposals", "Shared workspace", "Pipeline insights"] },
  { name: "Scale", price: "$129", description: "For growing agencies", features: ["Team permissions", "Approval workflows", "Priority support"] },
];

export default function LandingPage() {
  return (
    <main className="bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="/" className="text-xl font-semibold text-slate-950">
            ProposalFlow
          </a>
          <div className="flex items-center gap-3">
            <LinkButton href="/login" variant="ghost">
              Login
            </LinkButton>
            <LinkButton href="/register">Get Started</LinkButton>
          </div>
        </div>
      </nav>

      <section
        className="relative min-h-[560px] bg-slate-950 bg-cover bg-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(15,23,42,0.92), rgba(15,23,42,0.78)), url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1800&q=80')",
        }}
      >
        <div className="mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-200">
              Proposal management for modern service teams
            </p>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl">
              Close better deals with proposals that move fast.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              ProposalFlow helps consultants, studios, and agencies organize proposals,
              track client intent, and keep revenue conversations moving without a messy spreadsheet.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/register" variant="secondary">
                Start free
              </LinkButton>
              <LinkButton href="/dashboard" className="border border-white/20">
                Open dashboard
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Features"
          title="A focused workflow from first draft to signed deal."
          description="Keep the proposal process simple while leaving room for real product depth later."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6">
              <div className="mb-5 h-10 w-10 rounded-lg bg-slate-950" />
              <h3 className="text-lg font-semibold text-slate-950">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="How it works"
            title="Three steps from scope to momentum."
            description="ProposalFlow is designed around the daily rhythm of client service teams."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={step} className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-950">
                  {index + 1}
                </div>
                <p className="mt-5 text-base leading-7 text-slate-700">{step}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Pricing"
          title="Simple plans for serious proposal work."
          description="Start small, then add team workflows when the sales motion gets bigger."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className="p-6">
              <h3 className="text-xl font-semibold text-slate-950">{plan.name}</h3>
              <p className="mt-2 text-sm text-slate-500">{plan.description}</p>
              <p className="mt-6 text-4xl font-semibold text-slate-950">
                {plan.price}
                <span className="text-base font-medium text-slate-500">/mo</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {plan.features.map((feature) => (
                  <li key={feature}>Included: {feature}</li>
                ))}
              </ul>
              <LinkButton href="/register" variant="secondary" className="mt-8 w-full">
                Choose {plan.name}
              </LinkButton>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Build a cleaner proposal pipeline today.
            </h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              Replace scattered docs and status guesswork with a workspace your team can extend.
            </p>
          </div>
          <LinkButton href="/register" variant="secondary">
            Get Started
          </LinkButton>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>(c) 2026 ProposalFlow. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="/login">Login</a>
            <a href="/register">Get Started</a>
            <a href="/dashboard">Demo</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
