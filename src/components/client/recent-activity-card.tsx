"use client";

import { useEffect, useState } from "react";
import { Clock3, Dumbbell } from "lucide-react";
import { Panel } from "@/components/ui";

type ExerciseOption = {
  id: string;
  name: string;
};

type WeightEntry = {
  id: string;
  weight: string;
  sets: string;
  reps: string;
  notes: string;
  date: string;
};

type RecentActivity = {
  exerciseName: string;
  label: string;
  date: string;
};

function buildSummary(entry: WeightEntry) {
  const parts = [];
  if (entry.weight) parts.push(`${entry.weight}kg`);
  if (entry.reps) parts.push(`${entry.reps} reps`);
  if (entry.sets) parts.push(`${entry.sets} sets`);
  return parts.join(" | ") || "Completed";
}

export function RecentActivityCard({ exercises }: { exercises: ExerciseOption[] }) {
  const [activity, setActivity] = useState<RecentActivity | null>(null);

  useEffect(() => {
    let latest: RecentActivity | null = null;

    for (const exercise of exercises) {
      const saved = localStorage.getItem(`bb_weight_log:${exercise.id}`);
      if (!saved) continue;

      const entries = JSON.parse(saved) as WeightEntry[];
      const newest = entries[0];
      if (!newest?.date) continue;

      if (!latest || new Date(newest.date).getTime() > new Date(latest.date).getTime()) {
        latest = {
          exerciseName: exercise.name,
          label: buildSummary(newest),
          date: newest.date,
        };
      }
    }

    setActivity(latest);
  }, [exercises]);

  return (
    <Panel className="p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-emerald-200">
          <Clock3 className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-emerald-200">Last time you trained</p>
          {activity ? (
            <>
              <h2 className="mt-1 break-words text-lg font-semibold text-white">{activity.exerciseName}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-300">{activity.label}</p>
              <p className="mt-1 text-xs text-slate-500">
                {new Date(activity.date).toLocaleDateString()}
              </p>
            </>
          ) : (
            <>
              <h2 className="mt-1 text-lg font-semibold text-white">Nothing logged yet</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Save your weight, sets, and reps on any exercise and your recent workout snapshot will show up here.
              </p>
            </>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Dumbbell className="h-4 w-4" aria-hidden />
        Personal progress for solo users or coached members
      </div>
    </Panel>
  );
}
