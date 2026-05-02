export type UserRole = "client" | "trainer" | "admin";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type Profile = {
  id: string;
  full_name: string;
  role: UserRole;
  email: string;
  trainer_id?: string | null;
  created_at: string;
};

export type Exercise = {
  id: string;
  name: string;
  description: string;
  muscle_group: string;
  equipment: string;
  difficulty: Difficulty;
  cues: string[];
  common_mistakes: string[];
  video_url: string;
  thumbnail_url: string;
  created_by: string;
  created_at: string;
};

export type Plan = {
  id: string;
  title: string;
  description: string;
  goal: string;
  created_by: string;
  created_at: string;
};

export type PlanExercise = {
  id: string;
  plan_id: string;
  exercise_id: string;
  order_index: number;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes: string;
};

export type ClientPlan = {
  id: string;
  client_id: string;
  plan_id: string;
  assigned_at: string;
  is_active: boolean;
};

export type Favourite = {
  id: string;
  user_id: string;
  exercise_id: string;
  created_at: string;
};

export type WorkoutLog = {
  id: string;
  user_id: string;
  plan_id: string;
  exercise_id: string;
  completed_at: string;
  notes?: string | null;
};

export type PlanExerciseDetail = PlanExercise & {
  exercise: Exercise;
};

export type PlanWithExercises = Plan & {
  exercises: PlanExerciseDetail[];
};
