"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookmarkPlus, Plus, Trash2 } from "lucide-react";
import type { Exercise } from "@/lib/types";
import { inputClass } from "@/components/ui";

type Routine = {
  id: string;
  title: string;
  description?: string;
  tag?: string;
  exerciseIds: string[];
};

function pickExercises(exercises: Exercise[], ids: string[]) {
  const available = ids.filter((id) => exercises.some((exercise) => exercise.id === id));
  return available.length ? available : exercises.slice(0, 5).map((exercise) => exercise.id);
}

function starterRoutines(exercises: Exercise[]): Routine[] {
  return [
    {
      id: "template-full-body",
      title: "Beginner Full Body",
      description: "A balanced starter session for someone who wants to train everything.",
      tag: "35-45 min",
      exerciseIds: pickExercises(exercises, [
        "ex-goblet-squat",
        "ex-incline-push-up",
        "ex-seated-row",
        "ex-dumbbell-rdl",
        "ex-plank",
      ]),
    },
    {
      id: "template-upper",
      title: "Upper Body Builder",
      description: "Simple push and pull work for chest, back, shoulders, and arms.",
      tag: "30-40 min",
      exerciseIds: pickExercises(exercises, [
        "ex-db-press",
        "ex-lat-pulldown",
        "ex-seated-row",
        "ex-face-pull",
        "ex-incline-push-up",
      ]),
    },
    {
      id: "template-legs",
      title: "Leg Day Starter",
      description: "Lower-body strength without making the session too intimidating.",
      tag: "35 min",
      exerciseIds: pickExercises(exercises, [
        "ex-leg-press",
        "ex-split-squat",
        "ex-hamstring-curl",
        "ex-calf-raise",
        "ex-plank",
      ]),
    },
    {
      id: "template-quick",
      title: "Quick Core & Posture",
      description: "A short top-up routine for core, back, and shoulder control.",
      tag: "20 min",
      exerciseIds: pickExercises(exercises, [
        "ex-plank",
        "ex-face-pull",
        "ex-seated-row",
        "ex-lat-pulldown",
      ]),
    },
  ];
}

export function RoutineBuilder({ exercises }: { exercises: Exercise[] }) {
  const [routines, setRoutines] = useState<Routine[]>(() => {
    const templates = starterRoutines(exercises);
    if (typeof window === "undefined") {
      return templates;
    }
    const saved = localStorage.getItem("bb_routines");
    if (!saved) return templates;
    const parsed = JSON.parse(saved) as Routine[];
    const missingTemplates = templates.filter(
      (template) => !parsed.some((routine) => routine.id === template.id),
    );
    return [...missingTemplates, ...parsed];
  });
  const [title, setTitle] = useState("");
  const [selectedRoutineId, setSelectedRoutineId] = useState(routines[0]?.id ?? "");
  const [selectedExerciseId, setSelectedExerciseId] = useState(exercises[0]?.id ?? "");

  const selectedRoutine = useMemo(
    () => routines.find((routine) => routine.id === selectedRoutineId) ?? routines[0],
    [routines, selectedRoutineId],
  );
  const hasExercises = exercises.length > 0;

  useEffect(() => {
    if (!exercises.length) {
      if (selectedExerciseId !== "") {
        setSelectedExerciseId("");
      }
      return;
    }

    const stillExists = exercises.some((exercise) => exercise.id === selectedExerciseId);
    if (!selectedExerciseId || !stillExists) {
      setSelectedExerciseId(exercises[0].id);
    }
  }, [exercises, selectedExerciseId]);

  function save(next: Routine[]) {
    setRoutines(next);
    localStorage.setItem("bb_routines", JSON.stringify(next));
  }

  function createRoutine() {
    const name = title.trim();
    if (!name) return;
    const nextRoutine = {
      id: crypto.randomUUID(),
      title: name,
      description: "Custom routine",
      tag: "Custom",
      exerciseIds: [],
    };
    save([nextRoutine, ...routines]);
    setSelectedRoutineId(nextRoutine.id);
    setTitle("");
  }

  function addExercise() {
    if (!selectedRoutine || !selectedExerciseId) return;
    save(
      routines.map((routine) =>
        routine.id === selectedRoutine.id
          ? { ...routine, exerciseIds: [...routine.exerciseIds, selectedExerciseId] }
          : routine,
      ),
    );
  }

  function removeExercise(index: number) {
    if (!selectedRoutine) return;
    save(
      routines.map((routine) =>
        routine.id === selectedRoutine.id
          ? { ...routine, exerciseIds: routine.exerciseIds.filter((_, itemIndex) => itemIndex !== index) }
          : routine,
      ),
    );
  }

  function saveAsPlan() {
    if (!selectedRoutine) return;
    const savedPlanIds = JSON.parse(localStorage.getItem("bb_saved_plan_ids") ?? "[]") as string[];
    const next = savedPlanIds.includes(selectedRoutine.id)
      ? savedPlanIds
      : [selectedRoutine.id, ...savedPlanIds];
    localStorage.setItem("bb_saved_plan_ids", JSON.stringify(next));
  }

  return (
    <div className="grid gap-4">
      <section className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
        <h2 className="text-lg font-semibold text-white">Create a session</h2>
        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
          <input className={inputClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Saturday upper body" />
          <button type="button" onClick={createRoutine} className="grid min-h-12 w-12 place-items-center rounded-lg bg-emerald-300 text-slate-950" aria-label="Create session">
            <Plus className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </section>
      <section className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          Session
          <select className={inputClass} value={selectedRoutine?.id ?? ""} onChange={(event) => setSelectedRoutineId(event.target.value)}>
            {routines.map((routine) => (
              <option className="bg-slate-950" key={routine.id} value={routine.id}>{routine.title}</option>
            ))}
          </select>
        </label>
        <div className="mt-3 grid gap-2">
          <label className="grid gap-2 text-sm font-semibold text-slate-200">
            Exercise to add
            <select
              className={inputClass}
              value={selectedExerciseId}
              onChange={(event) => setSelectedExerciseId(event.target.value)}
              disabled={!hasExercises}
            >
              {hasExercises ? (
                exercises.map((exercise) => (
                  <option className="bg-slate-950" key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))
              ) : (
                <option className="bg-slate-950" value="">
                  No exercises available yet
                </option>
              )}
            </select>
          </label>
          <p className="text-xs text-slate-400">
            {hasExercises
              ? `${exercises.length} exercise${exercises.length === 1 ? "" : "s"} available to add.`
              : "You do not have any visible exercises yet."}
          </p>
          <div className="grid gap-2">
            <button
              type="button"
              onClick={addExercise}
              disabled={!hasExercises || !selectedExerciseId}
              className="min-h-12 rounded-lg bg-emerald-300 px-4 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add to session
            </button>
            {selectedRoutine ? (
              <button
                type="button"
                onClick={saveAsPlan}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <BookmarkPlus className="h-4 w-4" aria-hidden />
                Save session as plan
              </button>
            ) : null}
          </div>
        </div>
      </section>
      {selectedRoutine ? (
        <section className="grid gap-3">
          <div>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">{selectedRoutine.title}</h2>
              {selectedRoutine.tag ? (
                <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-bold text-emerald-200">
                  {selectedRoutine.tag}
                </span>
              ) : null}
            </div>
            {selectedRoutine.description ? (
              <p className="mt-1 text-sm leading-6 text-slate-400">{selectedRoutine.description}</p>
            ) : null}
          </div>
          {selectedRoutine.exerciseIds.length ? (
            selectedRoutine.exerciseIds.map((exerciseId, index) => {
              const exercise = exercises.find((item) => item.id === exerciseId);
              if (!exercise) return null;
              return (
                <div key={`${exerciseId}-${index}`} className="grid grid-cols-[1fr_auto] gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-4">
                  <Link href={`/app/exercise/${exercise.id}`}>
                    <p className="text-sm font-bold text-emerald-300">#{index + 1}</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">{exercise.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">{exercise.muscle_group}</p>
                  </Link>
                  <button type="button" onClick={() => removeExercise(index)} className="grid h-11 w-11 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Remove exercise">
                    <Trash2 className="h-5 w-5" aria-hidden />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5 text-sm leading-6 text-slate-400">
              Add exercises from the library to build this session.
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
