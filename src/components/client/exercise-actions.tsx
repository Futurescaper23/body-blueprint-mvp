"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Heart } from "lucide-react";

export function ExerciseActions({ exerciseId }: { exerciseId: string }) {
  const [complete, setComplete] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(`complete:${exerciseId}`) === "true",
  );
  const [favourite, setFavourite] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(`favourite:${exerciseId}`) === "true",
  );

  useEffect(() => {
    function handleCompleted(event: Event) {
      const detail = (event as CustomEvent<{ exerciseId: string }>).detail;
      if (detail?.exerciseId === exerciseId) {
        setComplete(true);
      }
    }

    window.addEventListener("bb_exercise_completed", handleCompleted);
    return () => window.removeEventListener("bb_exercise_completed", handleCompleted);
  }, [exerciseId]);

  function toggleComplete() {
    const next = !complete;
    setComplete(next);
    localStorage.setItem(`complete:${exerciseId}`, String(next));
  }

  function toggleFavourite() {
    const next = !favourite;
    setFavourite(next);
    localStorage.setItem(`favourite:${exerciseId}`, String(next));
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={toggleComplete}
        className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-emerald-300 px-4 text-sm font-bold text-slate-950 transition hover:bg-emerald-200"
      >
        <CheckCircle2 className="h-5 w-5" aria-hidden />
        {complete ? "Completed" : "Mark Complete"}
      </button>
      <button
        type="button"
        onClick={toggleFavourite}
        className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-4 text-sm font-bold text-white transition hover:bg-white/10"
      >
        <Heart className={favourite ? "h-5 w-5 fill-rose-300 text-rose-300" : "h-5 w-5"} aria-hidden />
        {favourite ? "Saved" : "Favourite"}
      </button>
    </div>
  );
}
