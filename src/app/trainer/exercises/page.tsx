import { Plus } from "lucide-react";
import { ExerciseLibraryCard } from "@/components/exercise-card";
import { ButtonLink, Panel, ScreenHeader } from "@/components/ui";
import { deleteExercise } from "@/lib/actions";
import { getTrainerDashboard } from "@/lib/queries";

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string }>;
}) {
  const params = await searchParams;
  const { exercises } = await getTrainerDashboard();

  return (
    <div className="pb-10">
      <ScreenHeader
        eyebrow="Library"
        title="Exercises"
        action={<ButtonLink href="/trainer/exercises/new"><Plus className="h-4 w-4" aria-hidden /> New</ButtonLink>}
      />
      <div className="grid gap-4 px-5">
        {params?.message ? (
          <Panel className="p-4 text-sm text-amber-100">{params.message}</Panel>
        ) : null}
        {exercises.map((exercise) => (
          <div key={exercise.id} className="grid gap-2">
            <ExerciseLibraryCard exercise={exercise} />
            <form action={deleteExercise} className="flex justify-end">
              <input type="hidden" name="id" value={exercise.id} />
              <button className="min-h-10 rounded-lg px-3 text-sm font-semibold text-rose-200 hover:bg-rose-300/10">
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
