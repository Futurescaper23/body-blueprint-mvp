import type {
  ClientPlan,
  Exercise,
  Favourite,
  Plan,
  PlanExercise,
  PlanWithExercises,
  Profile,
  WorkoutLog,
} from "@/lib/types";

export const lisa: Profile = {
  id: "trainer-lisa",
  full_name: "Lisa Morgan",
  role: "trainer",
  email: "lisa@bodyblueprint.demo",
  created_at: "2026-04-01T09:00:00.000Z",
};

export const profiles: Profile[] = [
  lisa,
  {
    id: "client-phil",
    full_name: "Phil Hawkins",
    role: "client",
    email: "phil@bodyblueprint.demo",
    trainer_id: lisa.id,
    created_at: "2026-04-03T08:30:00.000Z",
  },
  {
    id: "client-amelia",
    full_name: "Amelia Hart",
    role: "client",
    email: "amelia@example.com",
    trainer_id: lisa.id,
    created_at: "2026-04-03T09:00:00.000Z",
  },
  {
    id: "client-ben",
    full_name: "Ben Carter",
    role: "client",
    email: "ben@example.com",
    trainer_id: lisa.id,
    created_at: "2026-04-04T09:00:00.000Z",
  },
  {
    id: "client-maya",
    full_name: "Maya Singh",
    role: "client",
    email: "maya@example.com",
    trainer_id: lisa.id,
    created_at: "2026-04-05T09:00:00.000Z",
  },
  {
    id: "client-guest",
    full_name: "Guest User",
    role: "client",
    email: "guest@bodyblueprint.demo",
    trainer_id: lisa.id,
    created_at: "2026-04-05T10:30:00.000Z",
  },
  {
    id: "admin-nora",
    full_name: "Nora Admin",
    role: "admin",
    email: "admin@bodyblueprint.demo",
    created_at: "2026-04-02T09:00:00.000Z",
  },
];

const video =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const imageFor = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=900&q=80`;

export const exercises: Exercise[] = [
  {
    id: "ex-goblet-squat",
    name: "Goblet Squat",
    description: "A controlled squat variation that teaches depth, bracing, and knee tracking.",
    muscle_group: "Quads, glutes, core",
    equipment: "Dumbbell or kettlebell",
    difficulty: "Beginner",
    cues: ["Hold the weight close to your chest", "Brace before you descend", "Drive through the whole foot"],
    common_mistakes: ["Letting the knees collapse inward", "Relaxing at the bottom", "Rushing the lowering phase"],
    video_url: video,
    thumbnail_url: imageFor("photo-1534258936925-c58bed479fcb"),
    created_by: lisa.id,
    created_at: "2026-04-10T09:00:00.000Z",
  },
  {
    id: "ex-dumbbell-rdl",
    name: "Dumbbell Romanian Deadlift",
    description: "A hip hinge pattern for hamstrings and glutes with a neutral spine.",
    muscle_group: "Hamstrings, glutes, back",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    cues: ["Push hips back", "Keep dumbbells close to legs", "Stop when hamstrings are loaded"],
    common_mistakes: ["Squatting instead of hinging", "Rounding the lower back", "Looking up at the mirror"],
    video_url: video,
    thumbnail_url: imageFor("photo-1517836357463-d25dfeac3438"),
    created_by: lisa.id,
    created_at: "2026-04-10T09:05:00.000Z",
  },
  {
    id: "ex-incline-push-up",
    name: "Incline Push-Up",
    description: "A scalable push-up using a bench to build pressing strength and body tension.",
    muscle_group: "Chest, shoulders, triceps",
    equipment: "Bench",
    difficulty: "Beginner",
    cues: ["Hands under shoulders", "Ribs down", "Lower chest to the bench"],
    common_mistakes: ["Hips sagging", "Elbows flaring high", "Only moving the head forward"],
    video_url: video,
    thumbnail_url: imageFor("photo-1571019613454-1cb2f99b2d8b"),
    created_by: lisa.id,
    created_at: "2026-04-10T09:10:00.000Z",
  },
  {
    id: "ex-seated-row",
    name: "Seated Cable Row",
    description: "A stable horizontal pull for upper-back strength and posture.",
    muscle_group: "Lats, mid-back, biceps",
    equipment: "Cable row machine",
    difficulty: "Beginner",
    cues: ["Sit tall", "Pull elbows to ribs", "Pause before returning"],
    common_mistakes: ["Leaning back to finish reps", "Shrugging shoulders", "Letting the stack slam"],
    video_url: video,
    thumbnail_url: imageFor("photo-1598971639058-fab3c3109a00"),
    created_by: lisa.id,
    created_at: "2026-04-10T09:15:00.000Z",
  },
  {
    id: "ex-lat-pulldown",
    name: "Lat Pulldown",
    description: "A vertical pull to learn shoulder control and build the lats.",
    muscle_group: "Lats, upper back, biceps",
    equipment: "Lat pulldown machine",
    difficulty: "Beginner",
    cues: ["Chest proud", "Pull elbows down", "Control the stretch up"],
    common_mistakes: ["Pulling behind the neck", "Rocking the torso", "Half reps at the top"],
    video_url: video,
    thumbnail_url: imageFor("photo-1532384748853-8f54a8f476e2"),
    created_by: lisa.id,
    created_at: "2026-04-10T09:20:00.000Z",
  },
  {
    id: "ex-db-press",
    name: "Dumbbell Bench Press",
    description: "A pressing movement that builds chest and shoulder strength with independent arms.",
    muscle_group: "Chest, shoulders, triceps",
    equipment: "Bench and dumbbells",
    difficulty: "Beginner",
    cues: ["Set shoulder blades", "Wrists over elbows", "Press up and slightly in"],
    common_mistakes: ["Bouncing at the bottom", "Loose wrists", "Feet lifting from floor"],
    video_url: video,
    thumbnail_url: imageFor("photo-1581009137042-c552e485697a"),
    created_by: lisa.id,
    created_at: "2026-04-10T09:25:00.000Z",
  },
  {
    id: "ex-split-squat",
    name: "Static Split Squat",
    description: "A single-leg strength drill with a fixed stance and controlled tempo.",
    muscle_group: "Quads, glutes",
    equipment: "Bodyweight or dumbbells",
    difficulty: "Beginner",
    cues: ["Long stance", "Drop straight down", "Front foot stays planted"],
    common_mistakes: ["Stepping too narrow", "Pushing off the back foot", "Losing balance by rushing"],
    video_url: video,
    thumbnail_url: imageFor("photo-1599058917212-d750089bc07e"),
    created_by: lisa.id,
    created_at: "2026-04-10T09:30:00.000Z",
  },
  {
    id: "ex-leg-press",
    name: "Leg Press",
    description: "A supported lower-body press for building confidence under load.",
    muscle_group: "Quads, glutes",
    equipment: "Leg press machine",
    difficulty: "Beginner",
    cues: ["Feet hip-width", "Lower with control", "Keep lower back on pad"],
    common_mistakes: ["Locking knees hard", "Going too deep for current mobility", "Letting knees cave"],
    video_url: video,
    thumbnail_url: imageFor("photo-1596357395217-80de13130e92"),
    created_by: lisa.id,
    created_at: "2026-04-10T09:35:00.000Z",
  },
  {
    id: "ex-hamstring-curl",
    name: "Seated Hamstring Curl",
    description: "A simple machine movement for direct hamstring work.",
    muscle_group: "Hamstrings",
    equipment: "Hamstring curl machine",
    difficulty: "Beginner",
    cues: ["Pin hips down", "Curl smoothly", "Pause at the squeeze"],
    common_mistakes: ["Using momentum", "Lifting hips", "Skipping the final range"],
    video_url: video,
    thumbnail_url: imageFor("photo-1579758629938-03607ccdbaba"),
    created_by: lisa.id,
    created_at: "2026-04-10T09:40:00.000Z",
  },
  {
    id: "ex-plank",
    name: "Forearm Plank",
    description: "A bracing drill that teaches full-body tension without spinal movement.",
    muscle_group: "Core, shoulders",
    equipment: "Mat",
    difficulty: "Beginner",
    cues: ["Elbows under shoulders", "Squeeze glutes", "Breathe behind the brace"],
    common_mistakes: ["Hips too high", "Lower back sagging", "Holding breath"],
    video_url: video,
    thumbnail_url: imageFor("photo-1549060279-7e168fcee0c2"),
    created_by: lisa.id,
    created_at: "2026-04-10T09:45:00.000Z",
  },
  {
    id: "ex-face-pull",
    name: "Cable Face Pull",
    description: "A shoulder-friendly upper-back exercise for posture and control.",
    muscle_group: "Rear delts, upper back",
    equipment: "Cable machine and rope",
    difficulty: "Intermediate",
    cues: ["Rope at eye height", "Pull thumbs behind ears", "Keep ribs stacked"],
    common_mistakes: ["Arching the back", "Pulling too low", "Turning it into a row"],
    video_url: video,
    thumbnail_url: imageFor("photo-1518611012118-696072aa579a"),
    created_by: lisa.id,
    created_at: "2026-04-10T09:50:00.000Z",
  },
  {
    id: "ex-calf-raise",
    name: "Standing Calf Raise",
    description: "A lower-leg movement that rewards full range and steady tempo.",
    muscle_group: "Calves",
    equipment: "Machine or dumbbells",
    difficulty: "Beginner",
    cues: ["Rise through big toe", "Pause at the top", "Lower to a full stretch"],
    common_mistakes: ["Bouncing", "Rolling ankles outward", "Cutting the bottom range"],
    video_url: video,
    thumbnail_url: imageFor("photo-1605296867424-35fc25c9212a"),
    created_by: lisa.id,
    created_at: "2026-04-10T09:55:00.000Z",
  },
];

export const plans: Plan[] = [
  {
    id: "plan-full-body",
    title: "Beginner Full Body",
    description: "A friendly first programme for learning the big patterns with steady progress.",
    goal: "Confidence, technique, full-body strength",
    created_by: lisa.id,
    created_at: "2026-04-12T09:00:00.000Z",
  },
  {
    id: "plan-upper-basics",
    title: "Upper Body Basics",
    description: "Push, pull, and posture work for a balanced upper-body session.",
    goal: "Upper-body strength and control",
    created_by: lisa.id,
    created_at: "2026-04-12T10:00:00.000Z",
  },
  {
    id: "plan-leg-day",
    title: "Leg Day Starter",
    description: "A simple lower-body day built around safe machines and stable free-weight work.",
    goal: "Lower-body strength and gym confidence",
    created_by: lisa.id,
    created_at: "2026-04-12T11:00:00.000Z",
  },
];

export const planExercises: PlanExercise[] = [
  { id: "pe-1", plan_id: "plan-full-body", exercise_id: "ex-goblet-squat", order_index: 1, sets: 3, reps: "8-10", rest_seconds: 75, notes: "Use a weight you can keep close to your chest." },
  { id: "pe-2", plan_id: "plan-full-body", exercise_id: "ex-incline-push-up", order_index: 2, sets: 3, reps: "8-12", rest_seconds: 60, notes: "Raise the bench if reps feel messy." },
  { id: "pe-3", plan_id: "plan-full-body", exercise_id: "ex-seated-row", order_index: 3, sets: 3, reps: "10-12", rest_seconds: 60, notes: "Pause every rep with shoulders relaxed." },
  { id: "pe-4", plan_id: "plan-full-body", exercise_id: "ex-dumbbell-rdl", order_index: 4, sets: 3, reps: "8-10", rest_seconds: 75, notes: "Move slowly until the hinge feels natural." },
  { id: "pe-5", plan_id: "plan-full-body", exercise_id: "ex-plank", order_index: 5, sets: 3, reps: "25-35s", rest_seconds: 45, notes: "Stop before your lower back sags." },
  { id: "pe-6", plan_id: "plan-upper-basics", exercise_id: "ex-db-press", order_index: 1, sets: 3, reps: "8-10", rest_seconds: 75, notes: "Keep the first set lighter as a feeler." },
  { id: "pe-7", plan_id: "plan-upper-basics", exercise_id: "ex-lat-pulldown", order_index: 2, sets: 3, reps: "10-12", rest_seconds: 60, notes: "Think elbows down, not hands down." },
  { id: "pe-8", plan_id: "plan-upper-basics", exercise_id: "ex-seated-row", order_index: 3, sets: 3, reps: "10-12", rest_seconds: 60, notes: "No swinging to finish the rep." },
  { id: "pe-9", plan_id: "plan-upper-basics", exercise_id: "ex-face-pull", order_index: 4, sets: 2, reps: "12-15", rest_seconds: 45, notes: "Keep this light and precise." },
  { id: "pe-10", plan_id: "plan-leg-day", exercise_id: "ex-leg-press", order_index: 1, sets: 3, reps: "10-12", rest_seconds: 90, notes: "Pick a depth your back can keep." },
  { id: "pe-11", plan_id: "plan-leg-day", exercise_id: "ex-split-squat", order_index: 2, sets: 3, reps: "8 each side", rest_seconds: 75, notes: "Hold the rail lightly if needed." },
  { id: "pe-12", plan_id: "plan-leg-day", exercise_id: "ex-hamstring-curl", order_index: 3, sets: 3, reps: "10-12", rest_seconds: 60, notes: "Pause at the bottom squeeze." },
  { id: "pe-13", plan_id: "plan-leg-day", exercise_id: "ex-calf-raise", order_index: 4, sets: 3, reps: "12-15", rest_seconds: 45, notes: "Use full range, even if lighter." },
];

export const clientPlans: ClientPlan[] = [
  { id: "cp-0", client_id: "client-phil", plan_id: "plan-full-body", assigned_at: "2026-04-15T08:30:00.000Z", is_active: true },
  { id: "cp-1", client_id: "client-amelia", plan_id: "plan-full-body", assigned_at: "2026-04-15T09:00:00.000Z", is_active: true },
  { id: "cp-2", client_id: "client-ben", plan_id: "plan-upper-basics", assigned_at: "2026-04-15T09:30:00.000Z", is_active: true },
  { id: "cp-3", client_id: "client-maya", plan_id: "plan-leg-day", assigned_at: "2026-04-15T10:00:00.000Z", is_active: true },
  { id: "cp-4", client_id: "client-guest", plan_id: "plan-upper-basics", assigned_at: "2026-04-15T10:30:00.000Z", is_active: true },
];

export const favourites: Favourite[] = [
  { id: "fav-1", user_id: "client-amelia", exercise_id: "ex-goblet-squat", created_at: "2026-04-20T09:00:00.000Z" },
  { id: "fav-2", user_id: "client-amelia", exercise_id: "ex-plank", created_at: "2026-04-21T09:00:00.000Z" },
];

export const workoutLogs: WorkoutLog[] = [
  { id: "log-1", user_id: "client-amelia", plan_id: "plan-full-body", exercise_id: "ex-goblet-squat", completed_at: "2026-04-25T09:00:00.000Z" },
  { id: "log-2", user_id: "client-amelia", plan_id: "plan-full-body", exercise_id: "ex-incline-push-up", completed_at: "2026-04-25T09:10:00.000Z" },
];

export const demoClient = profiles.find((profile) => profile.id === "client-phil")!;

export function getExercise(id: string) {
  return exercises.find((exercise) => exercise.id === id);
}

export function getPlanWithExercises(planId: string): PlanWithExercises | undefined {
  const plan = plans.find((item) => item.id === planId);
  if (!plan) return undefined;

  return {
    ...plan,
    exercises: planExercises
      .filter((item) => item.plan_id === planId)
      .sort((a, b) => a.order_index - b.order_index)
      .map((item) => ({
        ...item,
        exercise: exercises.find((exercise) => exercise.id === item.exercise_id)!,
      })),
  };
}

export function getActivePlanForClient(clientId = demoClient.id) {
  const assignment = clientPlans.find(
    (item) => item.client_id === clientId && item.is_active,
  );
  return assignment ? getPlanWithExercises(assignment.plan_id) : undefined;
}

export function getAssignedPlansForClient(clientId = demoClient.id) {
  return clientPlans
    .filter((item) => item.client_id === clientId && item.is_active)
    .sort((a, b) => b.assigned_at.localeCompare(a.assigned_at))
    .map((item) => getPlanWithExercises(item.plan_id))
    .filter((plan): plan is PlanWithExercises => Boolean(plan));
}
