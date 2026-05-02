import { RoutineBuilder } from "@/components/client/routine-builder";
import { ScreenHeader } from "@/components/ui";
import { getExerciseLibrary } from "@/lib/queries";

export default async function RoutinesPage() {
  const exercises = await getExerciseLibrary();

  return (
    <>
      <ScreenHeader eyebrow="Playlists" title="My Routines" />
      <div className="px-5 pb-6">
        <RoutineBuilder exercises={exercises} />
      </div>
    </>
  );
}
