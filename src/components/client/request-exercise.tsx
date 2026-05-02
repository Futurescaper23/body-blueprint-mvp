"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { inputClass } from "@/components/ui";

export function RequestExercise() {
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);

  function submit() {
    const request = value.trim();
    if (!request) return;
    const existing = JSON.parse(localStorage.getItem("bb_exercise_requests") ?? "[]") as string[];
    localStorage.setItem("bb_exercise_requests", JSON.stringify([request, ...existing].slice(0, 20)));
    setValue("");
    setSent(true);
    window.setTimeout(() => setSent(false), 2500);
  }

  return (
    <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Can’t find a movement?</h2>
        <p className="mt-1 text-sm leading-6 text-slate-400">
          Request it now. Lisa can film the real demo later.
        </p>
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <input
          className={inputClass}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="e.g. Bulgarian split squat"
        />
        <button
          type="button"
          onClick={submit}
          className="grid min-h-12 w-12 place-items-center rounded-lg bg-emerald-300 text-slate-950"
          aria-label="Request exercise"
        >
          <Send className="h-5 w-5" aria-hidden />
        </button>
      </div>
      {sent ? <p className="text-sm font-semibold text-emerald-200">Request saved for the demo.</p> : null}
    </div>
  );
}
