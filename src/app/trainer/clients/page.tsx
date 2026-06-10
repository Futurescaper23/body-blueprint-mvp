import { Badge, Panel, ScreenHeader } from "@/components/ui";
import { getTrainerDashboard } from "@/lib/queries";
import { initials } from "@/lib/utils";

export default async function ClientsPage() {
  const { clients, plans, assignments } = await getTrainerDashboard();

  return (
    <div className="pb-10">
      <ScreenHeader eyebrow="People" title="Clients" />
      <div className="grid gap-3 px-5">
        {clients.map((client) => {
          const assignment = assignments.find((item) => item.client_id === client.id && item.is_active);
          const plan = plans.find((item) => item.id === assignment?.plan_id);
          return (
            <Panel key={client.id} className="p-5">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-sky-200 text-lg font-bold text-slate-950">
                  {initials(client.full_name)}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold text-white">{client.full_name}</h2>
                  <p className="truncate text-sm text-slate-400">{client.email}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge tone="green">Active</Badge>
                {plan ? <Badge>{plan.title}</Badge> : null}
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
