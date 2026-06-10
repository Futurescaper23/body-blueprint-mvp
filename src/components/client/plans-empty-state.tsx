"use client";

import { useEffect, useState } from "react";
import { ButtonLink, EmptyState } from "@/components/ui";

export function PlansEmptyState({ hasAssignedPlans }: { hasAssignedPlans: boolean }) {
  const [hasSavedSessionPlans, setHasSavedSessionPlans] = useState(false);

  useEffect(() => {
    const savedPlanIds = JSON.parse(localStorage.getItem("bb_saved_plan_ids") ?? "[]") as string[];
    setHasSavedSessionPlans(savedPlanIds.length > 0);
  }, []);

  if (hasAssignedPlans || hasSavedSessionPlans) return null;

  return (
    <EmptyState
      title="No plans saved yet"
      body="Use the exercise library and sessions area to start training now. If you later work with a trainer, their plans can slot into the same place."
      action={<ButtonLink href="/app/routines">Build a session</ButtonLink>}
    />
  );
}
