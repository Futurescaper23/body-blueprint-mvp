"use client";

import { useMemo, useState } from "react";
import { ExerciseCard } from "@/components/exercise-card";
import { CompleteWorkout } from "@/components/client/complete-workout";
import type { PlanExerciseDetail } from "@/lib/types";

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function endOfDayIso(day: string) {
  return new Date(`${day}T23:59:59.000`).toISOString();
}

function loadSessionState({
  planId,
  exerciseIds,
  initialCompletedIds,
}: {
  planId: string;
  exerciseIds: string[];
  initialCompletedIds: string[];
}) {
  if (typeof window === "undefined") {
    return { completedIds: new Set(initialCompletedIds), autoCompleted: false };
  }

  const currentDay = todayKey();
  const activeDayKey = `plan_active_day:${planId}`;
  const activeDay = localStorage.getItem(activeDayKey);
  const localCompletedIds = exerciseIds.filter(
    (exerciseId) => localStorage.getItem(`complete:${exerciseId}`) === "true",
  );

  if (activeDay && activeDay < currentDay && localCompletedIds.length > 0) {
    const historyKey = `bb_workout_history:${planId}`;
    const history = JSON.parse(localStorage.getItem(historyKey) ?? "[]") as Array<{
      id: string;
      planId: string;
      completedAt: string;
      exerciseCount: number;
      autoCompleted?: boolean;
    }>;

    localStorage.setItem(`plan_complete:${planId}`, "true");
    localStorage.setItem(`plan_completed_at:${planId}`, endOfDayIso(activeDay));
    localStorage.setItem(
      historyKey,
      JSON.stringify([
        {
          id: crypto.randomUUID(),
          planId,
          completedAt: endOfDayIso(activeDay),
          exerciseCount: localCompletedIds.length,
          autoCompleted: true,
        },
        ...history,
      ].slice(0, 12)),
    );

    exerciseIds.forEach((exerciseId) => localStorage.removeItem(`complete:${exerciseId}`));
    localStorage.setItem(activeDayKey, currentDay);
    return { completedIds: new Set(initialCompletedIds), autoCompleted: true };
  }

  localStorage.setItem(activeDayKey, currentDay);
  return {
    completedIds: new Set([...initialCompletedIds, ...localCompletedIds]),
    autoCompleted: false,
  };
}

export function WorkoutSession({
  planId,
  exercises,
  initialCompletedIds,
  favouriteIds,
}: {
  planId: string;
  exercises: PlanExerciseDetail[];
  initialCompletedIds: string[];
  favouriteIds: string[];
}) {
  const exerciseIds = useMemo(
    () => exercises.map((item) => item.exercise.id),
    [exercises],
  );
  const [session, setSession] = useState(() =>
    loadSessionState({ planId, exerciseIds, initialCompletedIds }),
  );

  return (
    <div className="grid gap-4">
      {session.autoCompleted ? (
        <div className="rounded-lg border border-sky-300/20 bg-sky-300/10 p-4 text-sm leading-6 text-sky-100">
          Yesterday&apos;s partial workout was closed automatically, so today starts clean.
        </div>
      ) : null}
      <div className="grid gap-3">
        {exercises.map((item) => (
          <ExerciseCard
            key={item.id}
            item={item}
            completed={session.completedIds.has(item.exercise.id)}
            favourite={favouriteIds.includes(item.exercise.id)}
          />
        ))}
      </div>
      <CompleteWorkout
        planId={planId}
        exerciseIds={exerciseIds}
        onComplete={() =>
          setSession({
            completedIds: new Set([...session.completedIds, ...exerciseIds]),
            autoCompleted: false,
          })
        }
      />
    </div>
  );
}
