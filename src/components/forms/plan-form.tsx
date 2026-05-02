import type { Plan } from "@/lib/types";
import { savePlan } from "@/lib/actions";
import { FormField, inputClass, textareaClass } from "@/components/ui";

export function PlanForm({ plan }: { plan?: Plan }) {
  return (
    <form action={savePlan} className="grid gap-4">
      {plan ? <input type="hidden" name="id" value={plan.id} /> : null}
      <FormField label="Plan title">
        <input className={inputClass} name="title" required defaultValue={plan?.title} placeholder="Beginner Full Body" />
      </FormField>
      <FormField label="Goal">
        <input className={inputClass} name="goal" required defaultValue={plan?.goal} placeholder="Strength and confidence" />
      </FormField>
      <FormField label="Description">
        <textarea className={textareaClass} name="description" required defaultValue={plan?.description} />
      </FormField>
      <button className="min-h-12 rounded-lg bg-emerald-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-emerald-200">
        Save Plan
      </button>
    </form>
  );
}
