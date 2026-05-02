import {
  clientPlans,
  demoClient,
  exercises,
  favourites,
  getActivePlanForClient,
  getExercise,
  getPlanWithExercises,
  planExercises,
  plans,
  profiles,
  workoutLogs,
} from "@/lib/sample-data";
import type { Exercise, PlanWithExercises, Profile } from "@/lib/types";
import { hasSupabaseEnv } from "@/lib/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function getViewer(): Promise<Profile> {
  if (!hasSupabaseEnv()) {
    const demoPersona = (await cookies()).get("bb_demo_persona")?.value;
    return profiles.find((profile) => profile.id === demoPersona) ?? demoClient;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return demoClient;

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role, email, trainer_id, created_at")
    .eq("id", user.id)
    .single();

  return (data as Profile | null) ?? {
    id: user.id,
    full_name: user.user_metadata?.full_name ?? user.email ?? "Member",
    role: (user.user_metadata?.role as Profile["role"]) ?? "client",
    email: user.email ?? "",
    created_at: user.created_at,
  };
}

export async function getClientDashboard() {
  const viewer = await getViewer();
  const activePlan = getActivePlanForClient(viewer.role === "client" ? viewer.id : demoClient.id);
  const completedIds = new Set(workoutLogs.map((log) => log.exercise_id));
  const favouriteIds = new Set(favourites.map((fav) => fav.exercise_id));

  return { viewer, activePlan, completedIds, favouriteIds };
}

export async function getClientPlan(planId?: string): Promise<PlanWithExercises | undefined> {
  if (planId) return getPlanWithExercises(planId);
  return getActivePlanForClient();
}

export async function getExerciseDetail(id: string): Promise<Exercise | undefined> {
  return getExercise(id);
}

export async function getFavouriteExercises() {
  const favouriteIds = new Set(favourites.map((fav) => fav.exercise_id));
  return exercises.filter((exercise) => favouriteIds.has(exercise.id));
}

export async function getExerciseLibrary() {
  return exercises;
}

export async function getTrainerDashboard() {
  const clients = profiles.filter((profile) => profile.role === "client");
  return {
    trainer: profiles.find((profile) => profile.role === "trainer")!,
    clients,
    exercises,
    plans,
    assignments: clientPlans,
    orderedPlanExercises: planExercises,
  };
}

export async function getAdminDashboard() {
  return { profiles, plans, exercises, workoutLogs };
}
