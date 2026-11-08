-- CalmIq schema: profiles, subscriptions, physio_sessions (+ optional chat_usage)
-- Apply in Supabase SQL editor or via CLI. Enable RLS.

create extension if not exists "pgcrypto";

-- Profiles ---------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  locale text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, locale)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'locale', 'en')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Subscriptions (Stripe webhook is source of truth) --------------------
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan_id text not null default 'free',
  status text not null default 'none',
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_stripe_customer_idx
  on public.subscriptions (stripe_customer_id);

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Writes only via service role (webhooks). No insert/update policies for authenticated.

-- Physio sessions (paid entitlement enforced in app + RLS) -------------
create table if not exists public.physio_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'requested'
    check (status in ('requested', 'scheduled', 'completed', 'canceled')),
  scheduled_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists physio_sessions_user_idx
  on public.physio_sessions (user_id, created_at desc);

alter table public.physio_sessions enable row level security;

create or replace function public.user_has_physio_access(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.subscriptions s
    where s.user_id = uid
      and s.plan_id = 'calm_plus'
      and s.status in ('active', 'trialing')
  );
$$;

create policy "physio_select_own"
  on public.physio_sessions for select
  using (auth.uid() = user_id);

create policy "physio_insert_paid"
  on public.physio_sessions for insert
  with check (
    auth.uid() = user_id
    and public.user_has_physio_access(auth.uid())
  );

create policy "physio_update_own"
  on public.physio_sessions for update
  using (auth.uid() = user_id);

-- Optional free-tier chat usage ----------------------------------------
create table if not exists public.chat_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null default (timezone('utc', now()))::date,
  message_count int not null default 0,
  primary key (user_id, day)
);

alter table public.chat_usage enable row level security;

create policy "chat_usage_select_own"
  on public.chat_usage for select
  using (auth.uid() = user_id);
