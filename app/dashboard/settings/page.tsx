import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Settings</h2>
        <p className="mt-2 text-sm text-slate-500">
          Configure the workspace shell before real account, billing, and notification services exist.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Profile" description="Personal information for the current user." />
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Name</Label>
              <Input id="profile-name" defaultValue="Maya Chen" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input id="profile-email" defaultValue="maya@proposalflow.com" type="email" />
            </div>
            <Button type="button" variant="secondary">
              Save profile
            </Button>
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
          <CardHeader title="Notifications" description="Placeholder preferences for follow-up events." />
          <CardContent className="space-y-4">
            {["Proposal viewed", "Proposal accepted", "Weekly pipeline digest"].map((item) => (
              <label
                className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                key={item}
              >
                <span className="text-sm font-medium text-slate-800">{item}</span>
                <input className="h-4 w-4 accent-slate-950" defaultChecked type="checkbox" />
              </label>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Billing" description="Plan and invoices will connect to billing later." />
          <CardContent>
            <div className="rounded-lg bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-950">Studio plan</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Billing is mocked for this MVP. Add subscription status, invoices, and payment
                management in the next backend iteration.
              </p>
              <Button className="mt-5" type="button" variant="secondary">
                Manage billing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
