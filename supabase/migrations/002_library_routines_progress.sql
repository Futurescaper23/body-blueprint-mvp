create table public.exercise_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  requested_name text not null,
  notes text,
  status text not null default 'new' check (status in ('new', 'planned', 'filmed', 'closed')),
  created_at timestamptz not null default now()
);

create table public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

create table public.routine_exercises (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  order_index integer not null check (order_index > 0),
  target_sets integer,
  target_reps text,
  notes text not null default '',
  unique (routine_id, order_index)
);

create table public.exercise_set_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  routine_id uuid references public.routines(id) on delete set null,
  plan_id uuid references public.plans(id) on delete set null,
  weight_kg numeric(6, 2),
  reps integer,
  sets integer,
  notes text,
  logged_at timestamptz not null default now()
);

create index exercise_requests_status_idx on public.exercise_requests(status, created_at);
create index routines_user_idx on public.routines(user_id, created_at);
create index routine_exercises_routine_order_idx on public.routine_exercises(routine_id, order_index);
create index exercise_set_logs_user_exercise_idx on public.exercise_set_logs(user_id, exercise_id, logged_at desc);

alter table public.exercise_requests enable row level security;
alter table public.routines enable row level security;
alter table public.routine_exercises enable row level security;
alter table public.exercise_set_logs enable row level security;

create policy "users create exercise requests"
  on public.exercise_requests for insert
  with check (user_id = auth.uid() or user_id is null);

create policy "users read own requests trainers admin read all"
  on public.exercise_requests for select
  using (user_id = auth.uid() or public.current_role() in ('trainer', 'admin'));

create policy "trainers admin update exercise requests"
  on public.exercise_requests for update
  using (public.current_role() in ('trainer', 'admin'))
  with check (public.current_role() in ('trainer', 'admin'));

create policy "users manage own routines"
  on public.routines for all
  using (user_id = auth.uid() or public.current_role() = 'admin')
  with check (user_id = auth.uid() or public.current_role() = 'admin');

create policy "users manage own routine exercises"
  on public.routine_exercises for all
  using (
    exists (select 1 from public.routines r where r.id = routine_id and r.user_id = auth.uid())
    or public.current_role() = 'admin'
  )
  with check (
    exists (select 1 from public.routines r where r.id = routine_id and r.user_id = auth.uid())
    or public.current_role() = 'admin'
  );

create policy "users manage own exercise set logs"
  on public.exercise_set_logs for all
  using (
    user_id = auth.uid()
    or public.current_role() = 'admin'
    or exists (select 1 from public.profiles p where p.id = exercise_set_logs.user_id and p.trainer_id = auth.uid())
  )
  with check (user_id = auth.uid() or public.current_role() = 'admin');
