import { SettingsPanel } from "@/components/settings/settings-panel";
import { requireUser } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Settings</h2>
        <p className="mt-2 text-sm text-slate-500">
          Configure the workspace shell before real account, billing, and notification services exist.
        </p>
      </div>
      <SettingsPanel user={{ name: user.name, email: user.email, role: user.role }} />
    </div>
  );
}
