create extension if not exists "pgcrypto";

create type public.user_role as enum ('client', 'trainer', 'admin');
create type public.exercise_difficulty as enum ('Beginner', 'Intermediate', 'Advanced');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'client',
  email text not null,
  trainer_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  muscle_group text not null,
  equipment text not null,
  difficulty public.exercise_difficulty not null default 'Beginner',
  cues text[] not null default '{}',
  common_mistakes text[] not null default '{}',
  video_url text not null,
  thumbnail_url text not null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  goal text not null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.plan_exercises (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete restrict,
  order_index integer not null check (order_index > 0),
  sets integer not null check (sets > 0),
  reps text not null,
  rest_seconds integer not null default 60 check (rest_seconds >= 0),
  notes text not null default '',
  unique (plan_id, order_index)
);

create table public.client_plans (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  is_active boolean not null default true
);

create table public.favourites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, exercise_id)
);

create table public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  completed_at timestamptz not null default now(),
  notes text
);

create index profiles_role_idx on public.profiles(role);
create index exercises_created_by_idx on public.exercises(created_by);
create unique index exercises_created_by_name_key on public.exercises(created_by, name);
create index plans_created_by_idx on public.plans(created_by);
create unique index plans_created_by_title_key on public.plans(created_by, title);
create index plan_exercises_plan_order_idx on public.plan_exercises(plan_id, order_index);
create index client_plans_client_active_idx on public.client_plans(client_id, is_active);
create unique index client_plans_client_plan_key on public.client_plans(client_id, plan_id);
create index workout_logs_user_plan_idx on public.workout_logs(user_id, plan_id);

create or replace function public.current_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'client'),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.exercises enable row level security;
alter table public.plans enable row level security;
alter table public.plan_exercises enable row level security;
alter table public.client_plans enable row level security;
alter table public.favourites enable row level security;
alter table public.workout_logs enable row level security;

create policy "profiles self trainer admin read"
  on public.profiles for select
  using (
    id = auth.uid()
    or public.current_role() = 'admin'
    or trainer_id = auth.uid()
    or (public.current_role() = 'trainer' and role = 'client')
  );

create policy "profiles self update"
  on public.profiles for update
  using (id = auth.uid() or public.current_role() = 'admin')
  with check (id = auth.uid() or public.current_role() = 'admin');

create policy "trainers manage own exercises"
  on public.exercises for all
  using (created_by = auth.uid() or public.current_role() = 'admin')
  with check (created_by = auth.uid() or public.current_role() = 'admin');

create policy "clients read assigned exercises"
  on public.exercises for select
  using (
    public.current_role() in ('trainer', 'admin')
    or exists (
      select 1
      from public.client_plans cp
      join public.plan_exercises pe on pe.plan_id = cp.plan_id
      where cp.client_id = auth.uid()
        and cp.is_active = true
        and pe.exercise_id = exercises.id
    )
  );

create policy "trainers manage own plans"
  on public.plans for all
  using (created_by = auth.uid() or public.current_role() = 'admin')
  with check (created_by = auth.uid() or public.current_role() = 'admin');

create policy "clients read assigned plans"
  on public.plans for select
  using (
    exists (
      select 1 from public.client_plans cp
      where cp.plan_id = plans.id and cp.client_id = auth.uid() and cp.is_active = true
    )
    or public.current_role() in ('trainer', 'admin')
  );

create policy "plan exercises readable through visible plans"
  on public.plan_exercises for select
  using (
    public.current_role() in ('trainer', 'admin')
    or exists (
      select 1 from public.client_plans cp
      where cp.plan_id = plan_exercises.plan_id
        and cp.client_id = auth.uid()
        and cp.is_active = true
    )
  );

create policy "trainers manage plan exercises"
  on public.plan_exercises for all
  using (
    exists (select 1 from public.plans p where p.id = plan_id and p.created_by = auth.uid())
    or public.current_role() = 'admin'
  )
  with check (
    exists (select 1 from public.plans p where p.id = plan_id and p.created_by = auth.uid())
    or public.current_role() = 'admin'
  );

create policy "clients read own assignments"
  on public.client_plans for select
  using (
    client_id = auth.uid()
    or public.current_role() = 'admin'
    or exists (select 1 from public.plans p where p.id = plan_id and p.created_by = auth.uid())
  );

create policy "trainers assign own plans"
  on public.client_plans for insert
  with check (
    exists (select 1 from public.plans p where p.id = plan_id and p.created_by = auth.uid())
    or public.current_role() = 'admin'
  );

create policy "users manage own favourites"
  on public.favourites for all
  using (user_id = auth.uid() or public.current_role() = 'admin')
  with check (user_id = auth.uid() or public.current_role() = 'admin');

create policy "users manage own workout logs"
  on public.workout_logs for all
  using (
    user_id = auth.uid()
    or public.current_role() = 'admin'
    or exists (select 1 from public.plans p where p.id = plan_id and p.created_by = auth.uid())
  )
  with check (user_id = auth.uid() or public.current_role() = 'admin');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('exercise-videos', 'exercise-videos', true, 52428800, array['video/mp4', 'video/webm', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

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

create type public.organization_type as enum ('individual_trainer', 'gym', 'business');
create type public.membership_role as enum ('owner', 'admin', 'trainer', 'client');
create type public.subscription_status as enum ('trialing', 'active', 'past_due', 'cancelled');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.organization_type not null default 'individual_trainer',
  owner_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.membership_role not null,
  created_at timestamptz not null default now(),
  unique (organization_id, profile_id)
);

create table public.billing_customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status public.subscription_status not null default 'trialing',
  plan_name text not null default 'starter',
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create index organization_memberships_profile_idx on public.organization_memberships(profile_id);
create index billing_customers_status_idx on public.billing_customers(status);

alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.billing_customers enable row level security;

create policy "members read own organizations"
  on public.organizations for select
  using (
    owner_id = auth.uid()
    or public.current_role() = 'admin'
    or exists (
      select 1 from public.organization_memberships om
      where om.organization_id = organizations.id and om.profile_id = auth.uid()
    )
  );

create policy "owners manage organizations"
  on public.organizations for all
  using (owner_id = auth.uid() or public.current_role() = 'admin')
  with check (owner_id = auth.uid() or public.current_role() = 'admin');

create policy "members read memberships"
  on public.organization_memberships for select
  using (
    profile_id = auth.uid()
    or public.current_role() = 'admin'
    or exists (
      select 1 from public.organizations o
      where o.id = organization_id and o.owner_id = auth.uid()
    )
  );

create policy "owners manage memberships"
  on public.organization_memberships for all
  using (
    public.current_role() = 'admin'
    or exists (
      select 1 from public.organizations o
      where o.id = organization_id and o.owner_id = auth.uid()
    )
  )
  with check (
    public.current_role() = 'admin'
    or exists (
      select 1 from public.organizations o
      where o.id = organization_id and o.owner_id = auth.uid()
    )
  );

create policy "owners read billing"
  on public.billing_customers for select
  using (
    public.current_role() = 'admin'
    or exists (
      select 1 from public.organizations o
      where o.id = organization_id and o.owner_id = auth.uid()
    )
  );
