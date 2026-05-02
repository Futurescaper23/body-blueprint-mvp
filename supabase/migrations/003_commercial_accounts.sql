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
