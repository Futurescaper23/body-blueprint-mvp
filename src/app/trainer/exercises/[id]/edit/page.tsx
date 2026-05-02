import { notFound } from "next/navigation";
import { ExerciseForm } from "@/components/forms/exercise-form";
import { Panel, ScreenHeader } from "@/components/ui";
import { getExerciseDetail } from "@/lib/queries";

export default async function EditExercisePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exercise = await getExerciseDetail(id);
  if (!exercise) notFound();

  return (
    <div className="pb-10">
      <ScreenHeader eyebrow="Library" title="Edit Exercise" />
      <div className="px-5">
        <Panel className="p-5">
          <ExerciseForm exercise={exercise} />
        </Panel>
      </div>
    </div>
  );
}
