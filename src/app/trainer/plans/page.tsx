import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge, ButtonLink, Panel, ScreenHeader } from "@/components/ui";
import { deletePlan } from "@/lib/actions";
import { getTrainerDashboard } from "@/lib/queries";

export default async function PlansPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string }>;
}) {
  const params = await searchParams;
  const { plans, orderedPlanExercises } = await getTrainerDashboard();

  return (
    <div className="pb-10">
      <ScreenHeader
        eyebrow="Builder"
        title="Plans"
        action={<ButtonLink href="/trainer/plans/new"><Plus className="h-4 w-4" aria-hidden /> New</ButtonLink>}
      />
      <div className="grid gap-4 px-5">
        {params?.message ? <Panel className="p-4 text-sm text-amber-100">{params.message}</Panel> : null}
        {plans.map((plan) => {
          const count = orderedPlanExercises.filter((item) => item.plan_id === plan.id).length;
          return (
            <Panel key={plan.id} className="p-5">
              <div className="flex flex-wrap gap-2">
                <Badge tone="green">{count} exercises</Badge>
                <Badge>{plan.goal}</Badge>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-white">{plan.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{plan.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href={`/trainer/plans/${plan.id}/edit`} className="inline-flex min-h-11 items-center rounded-lg bg-white/10 px-4 text-sm font-semibold text-white">
                  Edit
                </Link>
                <form action={deletePlan}>
                  <input type="hidden" name="id" value={plan.id} />
                  <button className="min-h-11 rounded-lg px-4 text-sm font-semibold text-rose-200 hover:bg-rose-300/10">
                    Delete
                  </button>
                </form>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
