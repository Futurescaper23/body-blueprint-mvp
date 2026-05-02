import { notFound } from "next/navigation";
import { addPlanExercise } from "@/lib/actions";
import { PlanForm } from "@/components/forms/plan-form";
import { Badge, FormField, inputClass, Panel, ScreenHeader } from "@/components/ui";
import { exercises, plans } from "@/lib/sample-data";
import { getClientPlan } from "@/lib/queries";
import { formatRest } from "@/lib/utils";

export default async function EditPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const planWithExercises = await getClientPlan(id);
  const plan = plans.find((item) => item.id === id);
  if (!plan || !planWithExercises) notFound();

  return (
    <div className="pb-10">
      <ScreenHeader eyebrow="Builder" title="Edit Plan" />
      <div className="grid gap-4 px-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Panel className="p-5">
          <PlanForm plan={plan} />
        </Panel>
        <Panel className="p-5">
          <h2 className="text-xl font-semibold text-white">Exercise order</h2>
          <div className="mt-4 grid gap-3">
            {planWithExercises.exercises.map((item) => (
              <div key={item.id} className="rounded-lg bg-white/[0.05] p-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-white">#{item.order_index} {item.exercise.name}</h3>
                  <Badge>{item.sets} x {item.reps}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-400">Rest {formatRest(item.rest_seconds)}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.notes}</p>
              </div>
            ))}
          </div>
          <form action={addPlanExercise} className="mt-5 grid gap-3">
            <input type="hidden" name="plan_id" value={plan.id} />
            <FormField label="Add exercise">
              <select className={inputClass} name="exercise_id" defaultValue={exercises[0]?.id}>
                {exercises.map((exercise) => (
                  <option className="bg-slate-950" key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
              </select>
            </FormField>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <input className={inputClass} name="order_index" type="number" min="1" defaultValue={planWithExercises.exercises.length + 1} aria-label="Order" />
              <input className={inputClass} name="sets" type="number" min="1" defaultValue="3" aria-label="Sets" />
              <input className={inputClass} name="reps" placeholder="Reps" required />
              <input className={inputClass} name="rest_seconds" type="number" min="0" defaultValue="60" aria-label="Rest seconds" />
            </div>
            <input className={inputClass} name="notes" placeholder="Plan-specific notes" />
            <button className="min-h-12 rounded-lg border border-white/10 bg-white/[0.06] px-5 text-sm font-bold text-white">
              Add to Plan
            </button>
          </form>
        </Panel>
      </div>
    </div>
  );
}
