"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { appUrl, hasSupabaseEnv } from "@/lib/utils";

function requireSupabase() {
  if (!hasSupabaseEnv()) {
    return "Connect Supabase environment variables to enable live data writes.";
  }
  return null;
}

export async function signIn(formData: FormData) {
  const missingEnv = requireSupabase();
  if (missingEnv) redirect(`/auth/sign-in?message=${encodeURIComponent(missingEnv)}`);

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) redirect(`/auth/sign-in?message=${encodeURIComponent(error.message)}`);
  redirect("/app");
}

export async function signUp(formData: FormData) {
  const missingEnv = requireSupabase();
  if (missingEnv) redirect(`/auth/sign-up?message=${encodeURIComponent(missingEnv)}`);

  const fullName = String(formData.get("full_name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "client");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/app`,
      data: { full_name: fullName, role },
    },
  });

  if (error) redirect(`/auth/sign-up?message=${encodeURIComponent(error.message)}`);
  redirect("/app");
}

export async function signOut() {
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  (await cookies()).delete("bb_demo_persona");
  redirect("/");
}

export async function chooseDemoPersona(formData: FormData) {
  const persona = String(formData.get("persona") ?? "client-amelia");
  (await cookies()).set("bb_demo_persona", persona, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  if (persona === "trainer-lisa") redirect("/trainer");
  if (persona === "admin-nora") redirect("/admin");
  redirect("/app");
}

export async function saveExercise(formData: FormData) {
  const missingEnv = requireSupabase();
  if (missingEnv) redirect(`/trainer/exercises?message=${encodeURIComponent(missingEnv)}`);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  const id = String(formData.get("id") ?? "");
  const payload = {
    ...(id ? { id } : {}),
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    muscle_group: String(formData.get("muscle_group") ?? ""),
    equipment: String(formData.get("equipment") ?? ""),
    difficulty: String(formData.get("difficulty") ?? "Beginner"),
    cues: String(formData.get("cues") ?? "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    common_mistakes: String(formData.get("common_mistakes") ?? "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    video_url: String(formData.get("video_url") ?? ""),
    thumbnail_url: String(formData.get("thumbnail_url") ?? ""),
    created_by: user.id,
  };

  const { error } = await supabase.from("exercises").upsert(payload);
  if (error) redirect(`/trainer/exercises?message=${encodeURIComponent(error.message)}`);

  revalidatePath("/trainer/exercises");
  redirect("/trainer/exercises?message=Exercise saved");
}

export async function savePlan(formData: FormData) {
  const missingEnv = requireSupabase();
  if (missingEnv) redirect(`/trainer/plans?message=${encodeURIComponent(missingEnv)}`);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  const id = String(formData.get("id") ?? "");
  const { error } = await supabase.from("plans").upsert({
    ...(id ? { id } : {}),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    goal: String(formData.get("goal") ?? ""),
    created_by: user.id,
  });

  if (error) redirect(`/trainer/plans?message=${encodeURIComponent(error.message)}`);
  revalidatePath("/trainer/plans");
  redirect("/trainer/plans?message=Plan saved");
}

export async function addPlanExercise(formData: FormData) {
  const missingEnv = requireSupabase();
  const planId = String(formData.get("plan_id") ?? "");
  if (missingEnv) redirect(`/trainer/plans/${planId}/edit?message=${encodeURIComponent(missingEnv)}`);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("plan_exercises").insert({
    plan_id: planId,
    exercise_id: String(formData.get("exercise_id") ?? ""),
    order_index: Number(formData.get("order_index") ?? 1),
    sets: Number(formData.get("sets") ?? 3),
    reps: String(formData.get("reps") ?? ""),
    rest_seconds: Number(formData.get("rest_seconds") ?? 60),
    notes: String(formData.get("notes") ?? ""),
  });

  if (error) redirect(`/trainer/plans/${planId}/edit?message=${encodeURIComponent(error.message)}`);
  revalidatePath(`/trainer/plans/${planId}/edit`);
  redirect(`/trainer/plans/${planId}/edit?message=Exercise added`);
}

export async function deleteExercise(formData: FormData) {
  const missingEnv = requireSupabase();
  if (missingEnv) redirect(`/trainer/exercises?message=${encodeURIComponent(missingEnv)}`);

  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("exercises").delete().eq("id", id);

  if (error) redirect(`/trainer/exercises?message=${encodeURIComponent(error.message)}`);
  revalidatePath("/trainer/exercises");
  redirect("/trainer/exercises?message=Exercise deleted");
}

export async function deletePlan(formData: FormData) {
  const missingEnv = requireSupabase();
  if (missingEnv) redirect(`/trainer/plans?message=${encodeURIComponent(missingEnv)}`);

  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("plans").delete().eq("id", id);

  if (error) redirect(`/trainer/plans?message=${encodeURIComponent(error.message)}`);
  revalidatePath("/trainer/plans");
  redirect("/trainer/plans?message=Plan deleted");
}

export async function assignPlan(formData: FormData) {
  const missingEnv = requireSupabase();
  if (missingEnv) redirect(`/trainer/assignments?message=${encodeURIComponent(missingEnv)}`);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("client_plans").insert({
    client_id: String(formData.get("client_id") ?? ""),
    plan_id: String(formData.get("plan_id") ?? ""),
    is_active: true,
  });

  if (error) redirect(`/trainer/assignments?message=${encodeURIComponent(error.message)}`);
  revalidatePath("/trainer/assignments");
  redirect("/trainer/assignments?message=Plan assigned");
}
