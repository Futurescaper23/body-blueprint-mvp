"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Exercise } from "@/lib/types";

type Routine = {
  id: string;
  title: string;
  description?: string;
  tag?: string;
  exerciseIds: string[];
};

export function SavedSessionPlans({ exercises }: { exercises: Exercise[] }) {
  const [plans, setPlans] = useState<Routine[]>([]);

  useEffect(() => {
    const savedPlanIds = JSON.parse(localStorage.getItem("bb_saved_plan_ids") ?? "[]") as string[];
    const routines = JSON.parse(localStorage.getItem("bb_routines") ?? "[]") as Routine[];
    setPlans(routines.filter((routine) => savedPlanIds.includes(routine.id)));
  }, []);

  const exerciseCountByPlan = useMemo(
    () =>
      new Map(
        plans.map((plan) => [
          plan.id,
          plan.exerciseIds.filter((id) => exercises.some((exercise) => exercise.id === id)).length,
        ]),
      ),
    [exercises, plans],
  );

  if (!plans.length) return null;

  return (
    <section className="grid gap-3">
      <div>
        <p className="text-sm font-semibold text-emerald-200">Saved from your sessions</p>
        <h2 className="mt-1 text-lg font-semibold text-white">Your own plans</h2>
      </div>
      {plans.map((plan, index) => (
        <Link
          key={plan.id}
          href="/app/routines"
          className="rounded-lg border border-white/10 bg-white/[0.06] p-4 transition hover:bg-white/10"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-emerald-300">{index === 0 ? "Ready to run" : `Saved plan ${index + 1}`}</p>
              <h3 className="mt-1 text-xl font-semibold text-white">{plan.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                {plan.description || "Built by you in My Sessions."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-300">
                <span className="rounded-full bg-white/10 px-3 py-1">
                  {exerciseCountByPlan.get(plan.id) ?? 0} exercises
                </span>
                {plan.tag ? <span className="rounded-full bg-white/10 px-3 py-1">{plan.tag}</span> : null}
              </div>
              <p className="mt-4 text-sm font-semibold text-white">Open in My Sessions</p>
            </div>
            <ArrowRight className="mt-1 h-5 w-5 text-slate-400" aria-hidden />
          </div>
        </Link>
      ))}
    </section>
  );
}
