import { assignPlan } from "@/lib/actions";
import { clientPlans, plans } from "@/lib/sample-data";
import { getTrainerDashboard } from "@/lib/queries";
import { FormField, inputClass, Panel, ScreenHeader } from "@/components/ui";

export default async function AssignmentsPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string }>;
}) {
  const params = await searchParams;
  const { clients } = await getTrainerDashboard();

  return (
    <div className="pb-10">
      <ScreenHeader eyebrow="Plans" title="Assignments" />
      <div className="grid gap-4 px-5 lg:grid-cols-[420px_1fr]">
        <Panel className="p-5">
          {params?.message ? (
            <div className="mb-4 rounded-lg border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100">
              {params.message}
            </div>
          ) : null}
          <form action={assignPlan} className="grid gap-4">
            <FormField label="Client">
              <select className={inputClass} name="client_id">
                {clients.map((client) => (
                  <option className="bg-slate-950" key={client.id} value={client.id}>
                    {client.full_name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Plan">
              <select className={inputClass} name="plan_id">
                {plans.map((plan) => (
                  <option className="bg-slate-950" key={plan.id} value={plan.id}>
                    {plan.title}
                  </option>
                ))}
              </select>
            </FormField>
            <button className="min-h-12 rounded-lg bg-emerald-300 px-5 text-sm font-bold text-slate-950">
              Assign Plan
            </button>
          </form>
        </Panel>
        <Panel className="p-5">
          <h2 className="text-xl font-semibold text-white">Current assignments</h2>
          <div className="mt-4 grid gap-3">
            {clientPlans.map((assignment) => {
              const client = clients.find((item) => item.id === assignment.client_id);
              const plan = plans.find((item) => item.id === assignment.plan_id);
              return (
                <div key={assignment.id} className="rounded-lg bg-white/[0.05] p-3 text-sm">
                  <p className="font-semibold text-white">{client?.full_name}</p>
                  <p className="mt-1 text-slate-400">{plan?.title}</p>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}
