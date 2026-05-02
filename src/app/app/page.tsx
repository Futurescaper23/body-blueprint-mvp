import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Flame, Heart, Library, ListChecks, PlayCircle } from "lucide-react";
import { ExerciseCard } from "@/components/exercise-card";
import { Badge, ButtonLink, EmptyState, Panel, ScreenHeader } from "@/components/ui";
import { getClientDashboard } from "@/lib/queries";

export default async function ClientHomePage() {
  const { viewer, activePlan, completedIds, favouriteIds } = await getClientDashboard();
  const completedCount =
    activePlan?.exercises.filter((item) => completedIds.has(item.exercise.id)).length ?? 0;
  const nextExercise = activePlan?.exercises.find(
    (item) => !completedIds.has(item.exercise.id),
  );

  return (
    <>
      <ScreenHeader eyebrow={`Hi ${viewer.full_name.split(" ")[0]}`} title="My Plan" />
      <div className="grid gap-4 px-5 pb-6">
        {activePlan ? (
          <>
            <Panel className="overflow-hidden">
              <div className="relative min-h-64 p-5">
                <Image
                  src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 448px, 100vw"
                  className="absolute inset-0 h-full w-full object-cover opacity-45"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101720] via-[#101720]/70 to-transparent" />
                <div className="relative flex h-full min-h-56 flex-col justify-end">
                  <Badge tone="green">{activePlan.exercises.length} exercises</Badge>
                  <h2 className="mt-4 text-3xl font-semibold text-white">{activePlan.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{activePlan.goal}</p>
                  <ButtonLink href={`/app/plan/${activePlan.id}`} className="mt-5 w-full">
                    Start Session <ArrowRight className="h-4 w-4" aria-hidden />
                  </ButtonLink>
                </div>
              </div>
            </Panel>
            <div className="grid grid-cols-3 gap-3">
              <Panel className="p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-300" aria-hidden />
                <p className="mt-2 text-2xl font-semibold">{completedCount}</p>
                <p className="text-xs text-slate-400">Done</p>
              </Panel>
              <Panel className="p-4">
                <Flame className="h-5 w-5 text-orange-200" aria-hidden />
                <p className="mt-2 text-2xl font-semibold">3</p>
                <p className="text-xs text-slate-400">Week</p>
              </Panel>
              <Panel className="p-4">
                <Heart className="h-5 w-5 text-rose-300" aria-hidden />
                <p className="mt-2 text-2xl font-semibold">{favouriteIds.size}</p>
                <p className="text-xs text-slate-400">Saved</p>
              </Panel>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/app/library" className="rounded-lg border border-white/10 bg-white/[0.06] p-4 transition hover:bg-white/10">
                <Library className="h-6 w-6 text-sky-200" aria-hidden />
                <h2 className="mt-3 text-base font-semibold text-white">Browse library</h2>
                <p className="mt-1 text-xs leading-5 text-slate-400">Find moves or request one.</p>
              </Link>
              <Link href="/app/routines" className="rounded-lg border border-white/10 bg-white/[0.06] p-4 transition hover:bg-white/10">
                <ListChecks className="h-6 w-6 text-emerald-300" aria-hidden />
                <h2 className="mt-3 text-base font-semibold text-white">Build routine</h2>
                <p className="mt-1 text-xs leading-5 text-slate-400">Save your own playlist.</p>
              </Link>
            </div>
            {nextExercise ? (
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Up next</h2>
                  <Link href="/app/plan" className="text-sm font-semibold text-emerald-200">
                    View all
                  </Link>
                </div>
                <ExerciseCard
                  item={nextExercise}
                  completed={completedIds.has(nextExercise.exercise.id)}
                  favourite={favouriteIds.has(nextExercise.exercise.id)}
                />
              </section>
            ) : (
              <Panel className="p-5">
                <PlayCircle className="h-8 w-8 text-emerald-300" aria-hidden />
                <h2 className="mt-3 text-lg font-semibold">Session complete</h2>
                <p className="mt-1 text-sm leading-6 text-slate-400">Nice work. Your trainer can review logged progress once Supabase is connected.</p>
              </Panel>
            )}
          </>
        ) : (
          <EmptyState
            title="No active plan"
            body="A trainer can assign a plan from the trainer dashboard."
            action={<ButtonLink href="/trainer">Trainer dashboard</ButtonLink>}
          />
        )}
      </div>
    </>
  );
}
