import { ExerciseForm } from "@/components/forms/exercise-form";
import { Panel, ScreenHeader } from "@/components/ui";

export default function NewExercisePage() {
  return (
    <div className="pb-10">
      <ScreenHeader eyebrow="Library" title="New Exercise" />
      <div className="px-5">
        <Panel className="p-5">
          <ExerciseForm />
        </Panel>
      </div>
    </div>
  );
}
