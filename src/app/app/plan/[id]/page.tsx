import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, PlayCircle } from "lucide-react";
import { WorkoutSession } from "@/components/client/workout-session";
import { Badge, ButtonLink, Panel, ScreenHeader } from "@/components/ui";
import { getClientDashboard, getClientPlan } from "@/lib/queries";

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = await getClientPlan(id);
  const { completedIds, favouriteIds } = await getClientDashboard();

  if (!plan) notFound();

  return (
    <>
      <div className="px-5 pt-5">
        <Link href="/app" className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-slate-300">
          <ChevronLeft className="h-5 w-5" aria-hidden />
          Back
        </Link>
      </div>
      <ScreenHeader eyebrow={plan.goal} title={plan.title} />
      <div className="grid gap-4 px-5 pb-6">
        <div className="flex gap-2">
          <Badge tone="green">{plan.exercises.length} exercises</Badge>
          <Badge>35-45 min</Badge>
        </div>
        <p className="text-sm leading-6 text-slate-400">{plan.description}</p>
        <Panel className="p-5">
          <div className="flex items-start gap-3">
            <PlayCircle className="mt-0.5 h-6 w-6 text-emerald-300" aria-hidden />
            <div>
              <h2 className="text-lg font-semibold text-white">Start now</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Work through the exercises below in order. If you are not sure where to begin,
                just open the first one and press on from there.
              </p>
            </div>
          </div>
          <ButtonLink href="#session" className="mt-4 w-full">
            Start this workout
          </ButtonLink>
        </Panel>
        <section id="session">
          <WorkoutSession
            planId={plan.id}
            exercises={plan.exercises}
            initialCompletedIds={[...completedIds]}
            favouriteIds={[...favouriteIds]}
          />
        </section>
      </div>
    </>
  );
}
