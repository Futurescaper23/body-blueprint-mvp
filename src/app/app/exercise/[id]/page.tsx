import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ExerciseActions } from "@/components/client/exercise-actions";
import { WeightLogger } from "@/components/client/weight-logger";
import { Badge, Panel } from "@/components/ui";
import { getExerciseDetail } from "@/lib/queries";

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exercise = await getExerciseDetail(id);

  if (!exercise) notFound();

  return (
    <div className="pb-6">
      <div className="px-5 pt-5">
        <Link href="/app/plan" className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-slate-300">
          <ChevronLeft className="h-5 w-5" aria-hidden />
          Plan
        </Link>
      </div>
      <section className="px-5 pt-2">
        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black">
          <video
            className="aspect-[9/16] w-full object-cover"
            src={exercise.video_url}
            poster={exercise.thumbnail_url}
            controls
            playsInline
          />
        </div>
      </section>
      <section className="grid gap-4 px-5 pt-5">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="green">{exercise.difficulty}</Badge>
            <Badge>{exercise.equipment}</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-white">{exercise.name}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">{exercise.description}</p>
        </div>
        <ExerciseActions exerciseId={exercise.id} />
        <WeightLogger exerciseId={exercise.id} />
        <Panel className="p-5">
          <h2 className="text-lg font-semibold text-white">Muscles worked</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">{exercise.muscle_group}</p>
        </Panel>
        <Panel className="p-5">
          <h2 className="text-lg font-semibold text-white">Trainer cues</h2>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300">
            {exercise.cues.map((cue) => (
              <li key={cue} className="rounded-lg bg-white/[0.05] px-3 py-2">{cue}</li>
            ))}
          </ul>
        </Panel>
        <Panel className="p-5">
          <h2 className="text-lg font-semibold text-white">Common mistakes</h2>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300">
            {exercise.common_mistakes.map((mistake) => (
              <li key={mistake} className="rounded-lg bg-white/[0.05] px-3 py-2">{mistake}</li>
            ))}
          </ul>
        </Panel>
      </section>
    </div>
  );
}
