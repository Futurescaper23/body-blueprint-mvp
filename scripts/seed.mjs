import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running npm run seed.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const users = [
  ["lisa@bodyblueprint.demo", "Lisa Morgan", "trainer", "lisa1234"],
  ["phil@bodyblueprint.demo", "Phil Hawkins", "client", "phil1234"],
  ["guest@bodyblueprint.demo", "Guest User", "client", "guest1234"],
  ["amelia@example.com", "Amelia Hart", "client", "demo1234"],
  ["ben@example.com", "Ben Carter", "client", "demo1234"],
  ["maya@example.com", "Maya Singh", "client", "demo1234"],
  ["admin@bodyblueprint.demo", "Nora Admin", "admin", "admin1234"],
];

async function upsertUser([email, fullName, role, password]) {
  const { data: list, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) throw listError;

  const existing = list.users.find((user) => user.email === email);
  if (existing) {
    await supabase.auth.admin.updateUserById(existing.id, {
      email_confirm: true,
      password,
      user_metadata: { full_name: fullName, role },
    });
    return existing.id;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  });
  if (error) throw error;
  return data.user.id;
}

const ids = {};
for (const user of users) {
  ids[user[0]] = await upsertUser(user);
}

const lisaId = ids["lisa@bodyblueprint.demo"];
for (const [email, fullName, role] of users) {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: ids[email],
      email,
      full_name: fullName,
      role,
      trainer_id: role === "client" ? lisaId : null,
    },
    { onConflict: "id" },
  );
  if (error) throw error;
}

const videoUrl = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const thumb = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

const exerciseRows = [
  ["Goblet Squat", "Quads, glutes, core", "Dumbbell or kettlebell", "Beginner", "A controlled squat variation that teaches depth, bracing, and knee tracking.", ["Hold the weight close to your chest", "Brace before you descend", "Drive through the whole foot"], ["Letting the knees collapse inward", "Relaxing at the bottom"], thumb("photo-1534258936925-c58bed479fcb")],
  ["Dumbbell Romanian Deadlift", "Hamstrings, glutes, back", "Dumbbells", "Beginner", "A hip hinge pattern for hamstrings and glutes with a neutral spine.", ["Push hips back", "Keep dumbbells close to legs", "Stop when hamstrings are loaded"], ["Squatting instead of hinging", "Rounding the lower back"], thumb("photo-1517836357463-d25dfeac3438")],
  ["Incline Push-Up", "Chest, shoulders, triceps", "Bench", "Beginner", "A scalable push-up using a bench to build pressing strength and body tension.", ["Hands under shoulders", "Ribs down", "Lower chest to the bench"], ["Hips sagging", "Elbows flaring high"], thumb("photo-1571019613454-1cb2f99b2d8b")],
  ["Seated Cable Row", "Lats, mid-back, biceps", "Cable row machine", "Beginner", "A stable horizontal pull for upper-back strength and posture.", ["Sit tall", "Pull elbows to ribs", "Pause before returning"], ["Leaning back to finish reps", "Shrugging shoulders"], thumb("photo-1598971639058-fab3c3109a00")],
  ["Lat Pulldown", "Lats, upper back, biceps", "Lat pulldown machine", "Beginner", "A vertical pull to learn shoulder control and build the lats.", ["Chest proud", "Pull elbows down", "Control the stretch up"], ["Pulling behind the neck", "Rocking the torso"], thumb("photo-1532384748853-8f54a8f476e2")],
  ["Dumbbell Bench Press", "Chest, shoulders, triceps", "Bench and dumbbells", "Beginner", "A pressing movement that builds chest and shoulder strength with independent arms.", ["Set shoulder blades", "Wrists over elbows", "Press up and slightly in"], ["Bouncing at the bottom", "Loose wrists"], thumb("photo-1581009137042-c552e485697a")],
  ["Static Split Squat", "Quads, glutes", "Bodyweight or dumbbells", "Beginner", "A single-leg strength drill with a fixed stance and controlled tempo.", ["Long stance", "Drop straight down", "Front foot stays planted"], ["Stepping too narrow", "Rushing reps"], thumb("photo-1599058917212-d750089bc07e")],
  ["Leg Press", "Quads, glutes", "Leg press machine", "Beginner", "A supported lower-body press for building confidence under load.", ["Feet hip-width", "Lower with control", "Keep lower back on pad"], ["Locking knees hard", "Letting knees cave"], thumb("photo-1596357395217-80de13130e92")],
  ["Seated Hamstring Curl", "Hamstrings", "Hamstring curl machine", "Beginner", "A simple machine movement for direct hamstring work.", ["Pin hips down", "Curl smoothly", "Pause at the squeeze"], ["Using momentum", "Lifting hips"], thumb("photo-1579758629938-03607ccdbaba")],
  ["Forearm Plank", "Core, shoulders", "Mat", "Beginner", "A bracing drill that teaches full-body tension without spinal movement.", ["Elbows under shoulders", "Squeeze glutes", "Breathe behind the brace"], ["Hips too high", "Holding breath"], thumb("photo-1549060279-7e168fcee0c2")],
  ["Cable Face Pull", "Rear delts, upper back", "Cable machine and rope", "Intermediate", "A shoulder-friendly upper-back exercise for posture and control.", ["Rope at eye height", "Pull thumbs behind ears", "Keep ribs stacked"], ["Arching the back", "Pulling too low"], thumb("photo-1518611012118-696072aa579a")],
  ["Standing Calf Raise", "Calves", "Machine or dumbbells", "Beginner", "A lower-leg movement that rewards full range and steady tempo.", ["Rise through big toe", "Pause at the top", "Lower to a full stretch"], ["Bouncing", "Cutting the bottom range"], thumb("photo-1605296867424-35fc25c9212a")],
];

const { data: savedExercises, error: exerciseError } = await supabase
  .from("exercises")
  .upsert(
    exerciseRows.map(([name, muscle_group, equipment, difficulty, description, cues, common_mistakes, thumbnail_url]) => ({
      name,
      muscle_group,
      equipment,
      difficulty,
      description,
      cues,
      common_mistakes,
      thumbnail_url,
      video_url: videoUrl,
      created_by: lisaId,
    })),
    { onConflict: "created_by,name" },
  )
  .select("id,name");
if (exerciseError) throw exerciseError;

const exerciseId = Object.fromEntries(savedExercises.map((exercise) => [exercise.name, exercise.id]));

const planRows = [
  ["Beginner Full Body", "A friendly first programme for learning the big patterns with steady progress.", "Confidence, technique, full-body strength"],
  ["Upper Body Basics", "Push, pull, and posture work for a balanced upper-body session.", "Upper-body strength and control"],
  ["Leg Day Starter", "A simple lower-body day built around safe machines and stable free-weight work.", "Lower-body strength and gym confidence"],
];

const { data: savedPlans, error: planError } = await supabase
  .from("plans")
  .upsert(
    planRows.map(([title, description, goal]) => ({
      title,
      description,
      goal,
      created_by: lisaId,
    })),
    { onConflict: "created_by,title" },
  )
  .select("id,title");
if (planError) throw planError;

const planId = Object.fromEntries(savedPlans.map((plan) => [plan.title, plan.id]));

const planExerciseRows = [
  ["Beginner Full Body", "Goblet Squat", 1, 3, "8-10", 75, "Use a weight you can keep close to your chest."],
  ["Beginner Full Body", "Incline Push-Up", 2, 3, "8-12", 60, "Raise the bench if reps feel messy."],
  ["Beginner Full Body", "Seated Cable Row", 3, 3, "10-12", 60, "Pause every rep with shoulders relaxed."],
  ["Beginner Full Body", "Dumbbell Romanian Deadlift", 4, 3, "8-10", 75, "Move slowly until the hinge feels natural."],
  ["Beginner Full Body", "Forearm Plank", 5, 3, "25-35s", 45, "Stop before your lower back sags."],
  ["Upper Body Basics", "Dumbbell Bench Press", 1, 3, "8-10", 75, "Keep the first set lighter as a feeler."],
  ["Upper Body Basics", "Lat Pulldown", 2, 3, "10-12", 60, "Think elbows down, not hands down."],
  ["Upper Body Basics", "Seated Cable Row", 3, 3, "10-12", 60, "No swinging to finish the rep."],
  ["Upper Body Basics", "Cable Face Pull", 4, 2, "12-15", 45, "Keep this light and precise."],
  ["Leg Day Starter", "Leg Press", 1, 3, "10-12", 90, "Pick a depth your back can keep."],
  ["Leg Day Starter", "Static Split Squat", 2, 3, "8 each side", 75, "Hold the rail lightly if needed."],
  ["Leg Day Starter", "Seated Hamstring Curl", 3, 3, "10-12", 60, "Pause at the bottom squeeze."],
  ["Leg Day Starter", "Standing Calf Raise", 4, 3, "12-15", 45, "Use full range, even if lighter."],
];

const { error: planExerciseError } = await supabase.from("plan_exercises").upsert(
  planExerciseRows.map(([planTitle, exerciseName, order_index, sets, reps, rest_seconds, notes]) => ({
    plan_id: planId[planTitle],
    exercise_id: exerciseId[exerciseName],
    order_index,
    sets,
    reps,
    rest_seconds,
    notes,
  })),
  { onConflict: "plan_id,order_index" },
);
if (planExerciseError) throw planExerciseError;

const assignments = [
  ["phil@bodyblueprint.demo", "Beginner Full Body"],
  ["guest@bodyblueprint.demo", "Upper Body Basics"],
  ["amelia@example.com", "Beginner Full Body"],
  ["ben@example.com", "Upper Body Basics"],
  ["maya@example.com", "Leg Day Starter"],
];

const { error: assignmentError } = await supabase.from("client_plans").upsert(
  assignments.map(([email, title]) => ({
    client_id: ids[email],
    plan_id: planId[title],
    is_active: true,
  })),
  { onConflict: "client_id,plan_id" },
);
if (assignmentError) throw assignmentError;

await supabase.from("favourites").upsert(
  [
    { user_id: ids["amelia@example.com"], exercise_id: exerciseId["Goblet Squat"] },
    { user_id: ids["amelia@example.com"], exercise_id: exerciseId["Forearm Plank"] },
  ],
  { onConflict: "user_id,exercise_id" },
);

console.log("Seed complete.");
console.log("Lisa login: lisa@bodyblueprint.demo / lisa1234");
console.log("Phil login: phil@bodyblueprint.demo / phil1234");
console.log("Guest login: guest@bodyblueprint.demo / guest1234");
