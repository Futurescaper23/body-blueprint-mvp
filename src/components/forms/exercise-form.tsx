import type { Exercise } from "@/lib/types";
import { saveExercise } from "@/lib/actions";
import { FormField, inputClass, textareaClass } from "@/components/ui";

export function ExerciseForm({ exercise }: { exercise?: Exercise }) {
  return (
    <form action={saveExercise} className="grid gap-4">
      {exercise ? <input type="hidden" name="id" value={exercise.id} /> : null}
      <FormField label="Exercise name">
        <input className={inputClass} name="name" required defaultValue={exercise?.name} placeholder="Goblet Squat" />
      </FormField>
      <FormField label="Description">
        <textarea className={textareaClass} name="description" required defaultValue={exercise?.description} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Muscle group">
          <input className={inputClass} name="muscle_group" required defaultValue={exercise?.muscle_group} placeholder="Quads, glutes" />
        </FormField>
        <FormField label="Equipment">
          <input className={inputClass} name="equipment" required defaultValue={exercise?.equipment} placeholder="Dumbbell" />
        </FormField>
      </div>
      <FormField label="Difficulty">
        <select className={inputClass} name="difficulty" defaultValue={exercise?.difficulty ?? "Beginner"}>
          <option className="bg-slate-950">Beginner</option>
          <option className="bg-slate-950">Intermediate</option>
          <option className="bg-slate-950">Advanced</option>
        </select>
      </FormField>
      <FormField label="Trainer cues">
        <textarea className={textareaClass} name="cues" defaultValue={exercise?.cues.join("\n")} placeholder="One cue per line" />
      </FormField>
      <FormField label="Common mistakes">
        <textarea className={textareaClass} name="common_mistakes" defaultValue={exercise?.common_mistakes.join("\n")} placeholder="One mistake per line" />
      </FormField>
      <FormField label="Portrait video URL">
        <input className={inputClass} name="video_url" type="url" required defaultValue={exercise?.video_url} placeholder="https://..." />
      </FormField>
      <FormField label="Thumbnail URL">
        <input className={inputClass} name="thumbnail_url" type="url" required defaultValue={exercise?.thumbnail_url} placeholder="https://..." />
      </FormField>
      <button className="min-h-12 rounded-lg bg-emerald-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-emerald-200">
        Save Exercise
      </button>
    </form>
  );
}
