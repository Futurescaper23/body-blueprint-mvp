import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Clock3, Heart, PlayCircle } from "lucide-react";
import type { Exercise, PlanExerciseDetail } from "@/lib/types";
import { Badge, Panel } from "@/components/ui";
import { cn, formatRest } from "@/lib/utils";

export function ExerciseCard({
  item,
  completed,
  favourite,
}: {
  item: PlanExerciseDetail;
  completed?: boolean;
  favourite?: boolean;
}) {
  return (
    <Panel className="overflow-hidden">
      <Link href={`/app/exercise/${item.exercise.id}`} className="grid grid-cols-[92px_1fr] gap-4 p-3">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-slate-900">
          <Image
            src={item.exercise.thumbnail_url}
            alt=""
            fill
            sizes="92px"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          <PlayCircle className="absolute bottom-2 left-2 h-7 w-7 text-white" aria-hidden />
        </div>
        <div className="min-w-0 py-1">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-bold text-emerald-300">#{item.order_index}</p>
            <div className="flex gap-2">
              {favourite ? <Heart className="h-5 w-5 fill-rose-300 text-rose-300" aria-hidden /> : null}
              {completed ? <CheckCircle2 className="h-5 w-5 text-emerald-300" aria-hidden /> : null}
            </div>
          </div>
          <h2 className="mt-1 truncate text-lg font-semibold text-white">{item.exercise.name}</h2>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-400">{item.notes}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>{item.sets} sets</Badge>
            <Badge>{item.reps}</Badge>
            <Badge tone="blue">
              <Clock3 className="mr-1 h-3.5 w-3.5" aria-hidden />
              {formatRest(item.rest_seconds)}
            </Badge>
          </div>
        </div>
      </Link>
    </Panel>
  );
}

export function ExerciseLibraryCard({ exercise }: { exercise: Exercise }) {
  return (
    <Panel className="overflow-hidden">
      <div className="grid gap-4 p-4 sm:grid-cols-[120px_1fr]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-slate-900">
          <Image
            src={exercise.thumbnail_url}
            alt=""
            fill
            sizes="(min-width: 640px) 120px, 100vw"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="green">{exercise.difficulty}</Badge>
            <Badge>{exercise.muscle_group}</Badge>
          </div>
          <h2 className="mt-3 text-xl font-semibold text-white">{exercise.name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{exercise.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/trainer/exercises/${exercise.id}/edit`}
              className={cn(
                "inline-flex min-h-11 items-center rounded-lg bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15",
              )}
            >
              Edit
            </Link>
            <Link
              href={`/app/exercise/${exercise.id}`}
              className="inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              Preview
            </Link>
          </div>
        </div>
      </div>
    </Panel>
  );
}
