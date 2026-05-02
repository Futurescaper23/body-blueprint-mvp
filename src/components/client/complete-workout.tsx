"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

type WorkoutHistoryEntry = {
  id: string;
  planId: string;
  completedAt: string;
  exerciseCount: number;
};

export function CompleteWorkout({
  planId,
  exerciseIds,
  onComplete,
}: {
  planId: string;
  exerciseIds: string[];
  onComplete?: () => void;
}) {
  const [complete, setComplete] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(`plan_complete:${planId}`) === "true",
  );
  const [lastCompletedAt, setLastCompletedAt] = useState<string | null>(
    () => (typeof window !== "undefined" ? localStorage.getItem(`plan_completed_at:${planId}`) : null),
  );

  function completeWorkout() {
    const completedAt = new Date().toISOString();
    const historyKey = `bb_workout_history:${planId}`;
    const history = JSON.parse(localStorage.getItem(historyKey) ?? "[]") as WorkoutHistoryEntry[];
    const nextHistory = [
      {
        id: crypto.randomUUID(),
        planId,
        completedAt,
        exerciseCount: exerciseIds.length,
      },
      ...history,
    ].slice(0, 12);

    exerciseIds.forEach((exerciseId) => {
      localStorage.setItem(`complete:${exerciseId}`, "true");
    });
    localStorage.setItem(`plan_complete:${planId}`, "true");
    localStorage.setItem(`plan_completed_at:${planId}`, completedAt);
    localStorage.setItem(historyKey, JSON.stringify(nextHistory));
    setComplete(true);
    setLastCompletedAt(completedAt);
    onComplete?.();
  }

  return (
    <section className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-4">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-300" aria-hidden />
        <div>
          <h2 className="text-lg font-semibold text-white">
            {complete ? "Workout complete" : "Ready to finish?"}
          </h2>
          <p className="mt-1 text-sm leading-6 text-emerald-50/80">
            {lastCompletedAt
              ? `Last completed ${new Date(lastCompletedAt).toLocaleDateString()}.`
              : "Tap once at the end of the session to mark the full workout done."}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={completeWorkout}
        className="mt-4 min-h-14 w-full rounded-lg bg-emerald-300 px-5 text-base font-bold text-slate-950 transition hover:bg-emerald-200"
      >
        {complete ? "Complete Workout Again" : "Complete Workout"}
      </button>
    </section>
  );
}
