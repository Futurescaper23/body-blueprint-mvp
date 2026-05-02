"use client";

import { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { inputClass } from "@/components/ui";

type WeightEntry = {
  id: string;
  weight: string;
  sets: string;
  reps: string;
  notes: string;
  date: string;
};

function formatEntry(entry: WeightEntry) {
  const volume =
    Number(entry.weight || 0) * Number(entry.sets || 0) * Number(entry.reps || 0);

  return {
    label: `${entry.weight}kg${
      entry.sets || entry.reps
        ? ` • ${entry.sets || "-"} sets x ${entry.reps || "-"} reps`
        : ""
    }`,
    volume,
  };
}

function compareToPrevious(entry: WeightEntry, previous?: WeightEntry) {
  if (!previous) return "First log";

  const currentWeight = Number(entry.weight || 0);
  const previousWeight = Number(previous.weight || 0);
  const currentVolume = formatEntry(entry).volume;
  const previousVolume = formatEntry(previous).volume;

  if (currentWeight && previousWeight && currentWeight !== previousWeight) {
    const diff = currentWeight - previousWeight;
    return diff > 0 ? `Weight up ${diff}kg` : `Weight down ${Math.abs(diff)}kg`;
  }

  if (currentVolume && previousVolume && currentVolume !== previousVolume) {
    const diff = currentVolume - previousVolume;
    return diff > 0 ? "More total work" : "Less total work";
  }

  return "Matched last time";
}

export function WeightLogger({ exerciseId }: { exerciseId: string }) {
  const storageKey = `bb_weight_log:${exerciseId}`;
  const [entries, setEntries] = useState<WeightEntry[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? "[]") as Array<Partial<WeightEntry>>;
    return saved.map((entry) => ({
      id: entry.id ?? crypto.randomUUID(),
      weight: entry.weight ?? "",
      sets: entry.sets ?? "",
      reps: entry.reps ?? "",
      notes: entry.notes ?? "",
      date: entry.date ?? new Date().toISOString(),
    }));
  });
  const [weight, setWeight] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [notes, setNotes] = useState("");

  const lastEntry = entries[0];
  const trend = useMemo(() => {
    if (!entries[0]) return null;
    return compareToPrevious(entries[0], entries[1]);
  }, [entries]);

  function addEntry() {
    if (!weight.trim()) return;
    const next = [
      {
        id: crypto.randomUUID(),
        weight: weight.trim(),
        sets: sets.trim(),
        reps: reps.trim(),
        notes: notes.trim(),
        date: new Date().toISOString(),
      },
      ...entries,
    ].slice(0, 8);
    setEntries(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
    setWeight("");
    setSets("");
    setReps("");
    setNotes("");
    localStorage.setItem(`complete:${exerciseId}`, "true");
    window.dispatchEvent(
      new CustomEvent("bb_exercise_completed", { detail: { exerciseId } }),
    );
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Completion history</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Log what you did each time you complete this exercise.
          </p>
        </div>
        <TrendingUp className="h-6 w-6 text-emerald-300" aria-hidden />
      </div>
      <div className="mt-4 rounded-lg bg-black/20 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Last time</p>
        <p className="mt-1 text-2xl font-semibold text-white">
          {lastEntry ? formatEntry(lastEntry).label : "No weight logged"}
        </p>
        {lastEntry ? (
          <p className="mt-1 text-sm text-slate-400">
            {new Date(lastEntry.date).toLocaleDateString()} {trend ? `• ${trend}` : ""}
          </p>
        ) : null}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <input className={inputClass} value={weight} onChange={(event) => setWeight(event.target.value)} inputMode="decimal" placeholder="Weight kg" />
        <input className={inputClass} value={sets} onChange={(event) => setSets(event.target.value)} inputMode="numeric" placeholder="Sets" />
        <input className={inputClass} value={reps} onChange={(event) => setReps(event.target.value)} inputMode="numeric" placeholder="Reps" />
      </div>
      <input className={`${inputClass} mt-2 w-full`} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional note" />
      <button
        type="button"
        onClick={addEntry}
        className="mt-3 min-h-12 w-full rounded-lg bg-emerald-300 px-5 text-sm font-bold text-slate-950"
      >
        Save & Complete
      </button>
      {entries.length ? (
        <div className="mt-4 grid gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Previous completions
          </p>
          {entries.map((entry, index) => (
            <div key={entry.id} className="rounded-lg bg-white/[0.05] px-3 py-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-300">{new Date(entry.date).toLocaleDateString()}</span>
                <span className="font-semibold text-white">{formatEntry(entry).label}</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-emerald-200">
                {compareToPrevious(entry, entries[index + 1])}
              </p>
              {entry.notes ? <p className="mt-1 text-xs text-slate-400">{entry.notes}</p> : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
