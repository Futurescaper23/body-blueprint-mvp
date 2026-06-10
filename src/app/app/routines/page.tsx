import { RoutineBuilder } from "@/components/client/routine-builder";
import { ScreenHeader } from "@/components/ui";
import { getExerciseLibrary } from "@/lib/queries";

export default async function RoutinesPage() {
  const exercises = await getExerciseLibrary();

  return (
    <>
      <ScreenHeader eyebrow="Build your own" title="My Sessions" />
      <div className="grid gap-4 px-5 pb-6">
        <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-slate-300">
          Use this area for extra workouts you want to save for yourself. These are separate from
          the coach plans assigned to you.
        </div>
        <RoutineBuilder exercises={exercises} />
      </div>
    </>
  );
}
