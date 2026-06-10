import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PlansEmptyState } from "@/components/client/plans-empty-state";
import { SavedSessionPlans } from "@/components/client/saved-session-plans";
import { Panel, ScreenHeader } from "@/components/ui";
import { getClientDashboard, getExerciseLibrary } from "@/lib/queries";

export default async function MyPlanIndexPage() {
  const exercises = await getExerciseLibrary();
  const { assignedPlans, activePlan } = await getClientDashboard();

  return (
    <>
      <ScreenHeader eyebrow="Your training" title="My Plans" />
      <div className="grid gap-4 px-5 pb-6">
        <Panel className="p-5">
          <h2 className="text-lg font-semibold text-white">What lives here</h2>
          <div className="mt-3 grid gap-3 text-sm leading-6 text-slate-300">
            <p>`My Plans` are the more structured workouts you want to follow regularly.</p>
            <p>They can be plans you built for yourself or ones a trainer shared with you.</p>
            <p>`My Sessions` are quicker, more flexible workouts you put together on the fly.</p>
          </div>
        </Panel>
        <SavedSessionPlans exercises={exercises} />
        {assignedPlans.length ? (
          <div className="grid gap-3">
            {assignedPlans.map((plan, index) => (
              <Link
                key={plan.id}
                href={`/app/plan/${plan.id}`}
                className="rounded-lg border border-white/10 bg-white/[0.06] p-4 transition hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-emerald-300">
                      {plan.id === activePlan?.id ? "Current plan" : `Plan ${index + 1}`}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-white">{plan.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{plan.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-300">
                      <span className="rounded-full bg-white/10 px-3 py-1">{plan.exercises.length} exercises</span>
                      <span className="rounded-full bg-white/10 px-3 py-1">{plan.goal}</span>
                    </div>
                    <p className="mt-4 text-sm font-semibold text-white">
                      {plan.id === activePlan?.id ? "Start now" : "Open plan"}
                    </p>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 text-slate-400" aria-hidden />
                </div>
              </Link>
            ))}
          </div>
        ) : null}
        <PlansEmptyState hasAssignedPlans={assignedPlans.length > 0} />
      </div>
    </>
  );
}
