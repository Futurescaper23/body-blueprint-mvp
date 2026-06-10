import Link from "next/link";
import Image from "next/image";
import { Apple, ArrowRight, CheckCircle2, Heart, Library, ListChecks, PlayCircle } from "lucide-react";
import { RecentActivityCard } from "@/components/client/recent-activity-card";
import { ExerciseCard } from "@/components/exercise-card";
import { Badge, ButtonLink, EmptyState, Panel, ScreenHeader } from "@/components/ui";
import { getClientDashboard, getExerciseLibrary } from "@/lib/queries";

export default async function ClientHomePage() {
  const exerciseLibrary = await getExerciseLibrary();
  const { viewer, assignedPlans, activePlan, completedIds, favouriteIds } = await getClientDashboard();
  const completedCount =
    activePlan?.exercises.filter((item) => completedIds.has(item.exercise.id)).length ?? 0;
  const nextExercise = activePlan?.exercises.find(
    (item) => !completedIds.has(item.exercise.id),
  );

  return (
    <>
      <ScreenHeader eyebrow={`Hi ${viewer.full_name.split(" ")[0]}`} title="Start Here" />
      <div className="grid gap-4 px-5 pb-6">
        {activePlan ? (
          <>
            <Panel className="overflow-hidden">
              <div className="relative min-h-72 p-5">
                <Image
                  src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 448px, 100vw"
                  className="absolute inset-0 h-full w-full object-cover opacity-45"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101720] via-[#101720]/70 to-transparent" />
                <div className="relative flex h-full min-h-64 flex-col justify-end">
                  <Badge tone="green">Your main plan right now</Badge>
                  <h2 className="mt-4 text-3xl font-semibold text-white">{activePlan.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{activePlan.goal}</p>
                  <div className="mt-5 grid gap-3">
                    <ButtonLink href={`/app/plan/${activePlan.id}`} className="w-full">
                      Let&apos;s get started <ArrowRight className="h-4 w-4" aria-hidden />
                    </ButtonLink>
                    <ButtonLink href="/app/plan" variant="secondary" className="w-full">
                      See all my plans
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </Panel>
            <RecentActivityCard
              exercises={exerciseLibrary.map((exercise) => ({
                id: exercise.id,
                name: exercise.name,
              }))}
            />
            <Panel className="p-4">
              <p className="text-sm font-semibold text-emerald-200">How this works</p>
              <div className="mt-3 grid gap-3 text-sm leading-6 text-slate-300">
                <p>`My Plans` are structured workouts you want to follow, whether you are training solo or with support.</p>
                <p>`My Sessions` are extra workouts you build for yourself from the library whenever you want something flexible.</p>
              </div>
            </Panel>
            <div className="grid grid-cols-3 gap-3">
              <Panel className="p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-300" aria-hidden />
                <p className="mt-2 text-2xl font-semibold">{completedCount}</p>
                <p className="text-xs text-slate-400">Done today</p>
              </Panel>
              <Panel className="p-4">
                <ListChecks className="h-5 w-5 text-sky-200" aria-hidden />
                <p className="mt-2 text-2xl font-semibold">{assignedPlans.length}</p>
                <p className="text-xs text-slate-400">Plans ready</p>
              </Panel>
              <Panel className="p-4">
                <Heart className="h-5 w-5 text-rose-300" aria-hidden />
                <p className="mt-2 text-2xl font-semibold">{favouriteIds.size}</p>
                <p className="text-xs text-slate-400">Saved</p>
              </Panel>
            </div>
            {assignedPlans.length > 1 ? (
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Your plans</h2>
                  <Link href="/app/plan" className="text-sm font-semibold text-emerald-200">
                    Open all
                  </Link>
                </div>
                <div className="grid gap-3">
                  {assignedPlans.map((plan, index) => (
                    <Link
                      key={plan.id}
                      href={`/app/plan/${plan.id}`}
                      className="rounded-lg border border-white/10 bg-white/[0.06] p-4 transition hover:bg-white/10"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-emerald-300">
                            {index === 0 ? "Start with this one" : `Plan ${index + 1}`}
                          </p>
                          <h3 className="mt-1 text-lg font-semibold text-white">{plan.title}</h3>
                          <p className="mt-1 text-sm text-slate-400">{plan.goal}</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-400" aria-hidden />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
            <div className="grid grid-cols-3 gap-3">
              <Link href="/app/nutrition" className="rounded-lg border border-white/10 bg-white/[0.06] p-4 transition hover:bg-white/10">
                <Apple className="h-6 w-6 text-amber-200" aria-hidden />
                <h2 className="mt-3 text-base font-semibold text-white">Nutrition</h2>
                <p className="mt-1 text-xs leading-5 text-slate-400">Log meals and watch your daily totals.</p>
              </Link>
              <Link href="/app/library" className="rounded-lg border border-white/10 bg-white/[0.06] p-4 transition hover:bg-white/10">
                <Library className="h-6 w-6 text-sky-200" aria-hidden />
                <h2 className="mt-3 text-base font-semibold text-white">Exercise library</h2>
                <p className="mt-1 text-xs leading-5 text-slate-400">Browse movements and request missing ones.</p>
              </Link>
              <Link href="/app/routines" className="rounded-lg border border-white/10 bg-white/[0.06] p-4 transition hover:bg-white/10">
                <ListChecks className="h-6 w-6 text-emerald-300" aria-hidden />
                <h2 className="mt-3 text-base font-semibold text-white">My sessions</h2>
                <p className="mt-1 text-xs leading-5 text-slate-400">Build your own extra workouts.</p>
              </Link>
            </div>
            {nextExercise ? (
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Up next</h2>
                  <Link href={`/app/plan/${activePlan.id}`} className="text-sm font-semibold text-emerald-200">
                    Open workout
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
                <h2 className="mt-3 text-lg font-semibold">You&apos;re done for today</h2>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Nice work. You can revisit your coach plans or build an extra session anytime.
                </p>
              </Panel>
            )}
          </>
        ) : (
          <EmptyState
            title="No plan set up yet"
            body="Start by exploring the exercise library or build your own session. If you work with a trainer, any assigned plans will also appear here."
            action={<ButtonLink href="/app/library">Open exercise library</ButtonLink>}
          />
        )}
      </div>
    </>
  );
}
