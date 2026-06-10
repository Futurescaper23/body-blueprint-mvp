import {
  clientPlans,
  demoClient,
  exercises,
  favourites,
  getAssignedPlansForClient,
  getActivePlanForClient,
  getExercise,
  getPlanWithExercises,
  planExercises,
  plans,
  profiles,
  workoutLogs,
} from "@/lib/sample-data";
import type { ClientPlan, Exercise, Plan, PlanExercise, PlanWithExercises, Profile } from "@/lib/types";
import { hasSupabaseEnv } from "@/lib/utils";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
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

async function getAssignedPlansFromSupabase(userId: string): Promise<PlanWithExercises[]> {
  const supabase = await createSupabaseServerClient();
  const { data: assignments } = await supabase
    .from("client_plans")
    .select("plan_id, assigned_at")
    .eq("client_id", userId)
    .eq("is_active", true)
    .order("assigned_at", { ascending: false });

  const planIds = assignments?.map((assignment) => assignment.plan_id) ?? [];
  if (!planIds.length) return [];

  const { data: planRows } = await supabase
    .from("plans")
    .select("id, title, description, goal, created_by, created_at")
    .in("id", planIds);

  const { data: exerciseRows } = await supabase
    .from("plan_exercises")
    .select(`
      id,
      plan_id,
      exercise_id,
      order_index,
      sets,
      reps,
      rest_seconds,
      notes,
      exercise:exercises (
        id,
        name,
        description,
        muscle_group,
        equipment,
        difficulty,
        cues,
        common_mistakes,
        video_url,
        thumbnail_url,
        created_by,
        created_at
      )
    `)
    .in("plan_id", planIds)
    .order("order_index", { ascending: true });

  const plansById = new Map((planRows ?? []).map((plan) => [plan.id, plan]));
  const exercisesByPlan = new Map<string, NonNullable<typeof exerciseRows>>();

  for (const item of exerciseRows ?? []) {
    const planExerciseList = exercisesByPlan.get(item.plan_id) ?? [];
    planExerciseList.push(item);
    exercisesByPlan.set(item.plan_id, planExerciseList);
  }

  const assignedPlans: PlanWithExercises[] = [];

  for (const planId of planIds) {
    const plan = plansById.get(planId);
    if (!plan) continue;

    assignedPlans.push({
      ...plan,
      exercises: (exercisesByPlan.get(planId) ?? []).map((item) => ({
        id: item.id,
        plan_id: item.plan_id,
        exercise_id: item.exercise_id,
        order_index: item.order_index,
        sets: item.sets,
        reps: item.reps,
        rest_seconds: item.rest_seconds,
        notes: item.notes,
        exercise: Array.isArray(item.exercise) ? item.exercise[0] : item.exercise,
      })),
    });
  }

  return assignedPlans;
}

async function getVisiblePlanFromSupabase(planId: string): Promise<PlanWithExercises | undefined> {
  const supabase = await createSupabaseServerClient();
  const { data: plan } = await supabase
    .from("plans")
    .select("id, title, description, goal, created_by, created_at")
    .eq("id", planId)
    .maybeSingle();

  if (!plan) return undefined;

  const { data: exerciseRows } = await supabase
    .from("plan_exercises")
    .select(`
      id,
      plan_id,
      exercise_id,
      order_index,
      sets,
      reps,
      rest_seconds,
      notes,
      exercise:exercises (
        id,
        name,
        description,
        muscle_group,
        equipment,
        difficulty,
        cues,
        common_mistakes,
        video_url,
        thumbnail_url,
        created_by,
        created_at
      )
    `)
    .eq("plan_id", planId)
    .order("order_index", { ascending: true });

  return {
    ...plan,
    exercises: (exerciseRows ?? []).map((item) => ({
      id: item.id,
      plan_id: item.plan_id,
      exercise_id: item.exercise_id,
      order_index: item.order_index,
      sets: item.sets,
      reps: item.reps,
      rest_seconds: item.rest_seconds,
      notes: item.notes,
      exercise: Array.isArray(item.exercise) ? item.exercise[0] : item.exercise,
    })),
  };
}

export async function getClientDashboard() {
  const viewer = await getViewer();
  if (!hasSupabaseEnv() || viewer.role !== "client") {
    const assignedPlans = getAssignedPlansForClient(viewer.role === "client" ? viewer.id : demoClient.id);
    const activePlan = assignedPlans[0] ?? getActivePlanForClient(viewer.role === "client" ? viewer.id : demoClient.id);
    const completedIds = new Set(workoutLogs.map((log) => log.exercise_id));
    const favouriteIds = new Set(favourites.map((fav) => fav.exercise_id));

    return { viewer, assignedPlans, activePlan, completedIds, favouriteIds };
  }

  const supabase = await createSupabaseServerClient();
  const [assignedPlans, favouritesResult, logsResult] = await Promise.all([
    getAssignedPlansFromSupabase(viewer.id),
    supabase.from("favourites").select("exercise_id").eq("user_id", viewer.id),
    supabase.from("workout_logs").select("exercise_id").eq("user_id", viewer.id),
  ]);

  const completedIds = new Set((logsResult.data ?? []).map((log) => log.exercise_id));
  const favouriteIds = new Set((favouritesResult.data ?? []).map((fav) => fav.exercise_id));

  return {
    viewer,
    assignedPlans,
    activePlan: assignedPlans[0],
    completedIds,
    favouriteIds,
  };
}

export async function getClientPlan(planId?: string): Promise<PlanWithExercises | undefined> {
  if (!hasSupabaseEnv()) {
    if (planId) return getPlanWithExercises(planId);
    return getActivePlanForClient();
  }

  const viewer = await getViewer();
  if (viewer.role !== "client") {
    return planId ? getVisiblePlanFromSupabase(planId) : undefined;
  }

  const assignedPlans = await getAssignedPlansFromSupabase(viewer.id);
  if (planId) {
    return assignedPlans.find((plan) => plan.id === planId);
  }
  return assignedPlans[0];
}

export async function getExerciseDetail(id: string): Promise<Exercise | undefined> {
  if (hasSupabaseEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from("exercises")
      .select("id, name, description, muscle_group, equipment, difficulty, cues, common_mistakes, video_url, thumbnail_url, created_by, created_at")
      .eq("id", id)
      .maybeSingle();

    return data as Exercise | undefined;
  }

  return getExercise(id);
}

export async function getFavouriteExercises() {
  if (hasSupabaseEnv()) {
    const viewer = await getViewer();
    if (viewer.role !== "client") return [];

    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("favourites")
      .select(`
        exercise:exercises (
          id,
          name,
          description,
          muscle_group,
          equipment,
          difficulty,
          cues,
          common_mistakes,
          video_url,
          thumbnail_url,
          created_by,
          created_at
        )
      `)
      .eq("user_id", viewer.id);

    return (data ?? [])
      .map((item) => (Array.isArray(item.exercise) ? item.exercise[0] : item.exercise))
      .filter((exercise): exercise is Exercise => Boolean(exercise));
  }

  const favouriteIds = new Set(favourites.map((fav) => fav.exercise_id));
  return exercises.filter((exercise) => favouriteIds.has(exercise.id));
}

export async function getExerciseLibrary() {
  if (hasSupabaseEnv()) {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from("exercises")
      .select("id, name, description, muscle_group, equipment, difficulty, cues, common_mistakes, video_url, thumbnail_url, created_by, created_at")
      .order("created_at", { ascending: false });

    return (data as Exercise[] | null) ?? [];
  }

  return exercises;
}

export async function getTrainerDashboard() {
  if (hasSupabaseEnv()) {
    const viewer = await getViewer();
    const supabase = await createSupabaseServerClient();

    const [clientsResult, exercisesResult, plansResult] = await Promise.all([
      viewer.role === "admin"
        ? supabase
            .from("profiles")
            .select("id, full_name, role, email, trainer_id, created_at")
            .eq("role", "client")
        : supabase
            .from("profiles")
            .select("id, full_name, role, email, trainer_id, created_at")
            .eq("trainer_id", viewer.id)
            .eq("role", "client"),
      supabase
        .from("exercises")
        .select("id, name, description, muscle_group, equipment, difficulty, cues, common_mistakes, video_url, thumbnail_url, created_by, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("plans")
        .select("id, title, description, goal, created_by, created_at")
        .order("created_at", { ascending: false }),
    ]);

    const plansData = (plansResult.data as Plan[] | null) ?? [];
    const planIds = plansData.map((plan) => plan.id);

    const [assignmentsResult, planExercisesResult] = await Promise.all([
      planIds.length
        ? supabase
            .from("client_plans")
            .select("id, client_id, plan_id, assigned_at, is_active")
            .in("plan_id", planIds)
            .order("assigned_at", { ascending: false })
        : Promise.resolve({ data: [] as ClientPlan[] }),
      planIds.length
        ? supabase
            .from("plan_exercises")
            .select("id, plan_id, exercise_id, order_index, sets, reps, rest_seconds, notes")
            .in("plan_id", planIds)
            .order("order_index", { ascending: true })
        : Promise.resolve({ data: [] as PlanExercise[] }),
    ]);

    return {
      trainer: viewer,
      clients: (clientsResult.data as Profile[] | null) ?? [],
      exercises: (exercisesResult.data as Exercise[] | null) ?? [],
      plans: plansData,
      assignments: (assignmentsResult.data as ClientPlan[] | null) ?? [],
      orderedPlanExercises: (planExercisesResult.data as PlanExercise[] | null) ?? [],
    };
  }

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
