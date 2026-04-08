import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { clients, formatCurrency } from "@/lib/mock-data";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Clients</h2>
          <p className="mt-2 text-sm text-slate-500">
            Keep account contacts and proposal value organized before CRM integration.
          </p>
        </div>
        <Button type="button">Add Client</Button>
      </div>

      <Card>
        <CardContent className="space-y-5">
          <Input className="lg:max-w-sm" placeholder="Search clients..." type="search" />
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="hidden grid-cols-[1fr_1fr_1.2fr_0.6fr_0.8fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 lg:grid">
              <span>Name</span>
              <span>Company</span>
              <span>Email</span>
              <span>Proposals</span>
              <span>Total value</span>
            </div>
            <div className="divide-y divide-slate-200">
              {clients.map((client) => (
                <div
                  className="grid gap-3 px-4 py-4 lg:grid-cols-[1fr_1fr_1.2fr_0.6fr_0.8fr] lg:items-center"
                  key={client.id}
                >
                  <p className="font-semibold text-slate-950">{client.name}</p>
                  <p className="text-sm text-slate-700">{client.company}</p>
                  <p className="text-sm text-slate-500">{client.email}</p>
                  <p className="text-sm font-semibold text-slate-950">{client.proposals}</p>
                  <p className="text-sm font-semibold text-slate-950">
                    {formatCurrency(client.totalValue)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
