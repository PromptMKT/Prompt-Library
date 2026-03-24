-- Auth profile backend for PromptVault (manual email/password flow).
-- Run this in Supabase SQL editor.

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  role text not null check (role in ('buyer', 'creator', 'designer', 'developer', 'marketer', 'business-owner', 'other')),
  interests text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Safe for reruns and older schema states.
alter table public.user_profiles add column if not exists auth_user_id uuid;
alter table public.user_profiles add column if not exists email text;
alter table public.user_profiles add column if not exists display_name text;
alter table public.user_profiles add column if not exists role text;
alter table public.user_profiles add column if not exists interests text[] default '{}';
alter table public.user_profiles add column if not exists created_at timestamptz default now();
alter table public.user_profiles add column if not exists updated_at timestamptz default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_profiles_auth_user_id_fkey'
      and conrelid = 'public.user_profiles'::regclass
  ) then
    alter table public.user_profiles
    add constraint user_profiles_auth_user_id_fkey
    foreign key (auth_user_id) references auth.users(id) on delete cascade;
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_profiles_role_check'
      and conrelid = 'public.user_profiles'::regclass
  ) then
    alter table public.user_profiles
    add constraint user_profiles_role_check
    check (role in ('buyer', 'creator', 'designer', 'developer', 'marketer', 'business-owner', 'other'));
  end if;
end;
$$;

create unique index if not exists user_profiles_auth_user_id_idx on public.user_profiles(auth_user_id);
create unique index if not exists user_profiles_email_idx on public.user_profiles(email);
create index if not exists user_profiles_role_idx on public.user_profiles(role);

create or replace function public.set_user_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_profiles_set_updated_at on public.user_profiles;
create trigger user_profiles_set_updated_at
before update on public.user_profiles
for each row execute function public.set_user_profiles_updated_at();

alter table public.user_profiles enable row level security;

drop policy if exists "Users can read own profile" on public.user_profiles;
create policy "Users can read own profile"
on public.user_profiles
for select
using ((select auth.uid()) = auth_user_id);

drop policy if exists "Users can insert own profile" on public.user_profiles;
create policy "Users can insert own profile"
on public.user_profiles
for insert
with check ((select auth.uid()) = auth_user_id);

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile"
on public.user_profiles
for update
using ((select auth.uid()) = auth_user_id)
with check ((select auth.uid()) = auth_user_id);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_role text;
  resolved_display_name text;
  resolved_interests text[];
begin
  resolved_role := coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), 'buyer');
  resolved_display_name := coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1));
  resolved_interests := coalesce(
    (
      select array_agg(value)
      from jsonb_array_elements_text(coalesce(new.raw_user_meta_data -> 'interests', '[]'::jsonb)) as value
    ),
    '{}'::text[]
  );

  begin
    insert into public.user_profiles (auth_user_id, email, display_name, role, interests)
    values (new.id, new.email, resolved_display_name, resolved_role, resolved_interests)
    on conflict (auth_user_id)
    do update set
      email = excluded.email,
      display_name = coalesce(excluded.display_name, public.user_profiles.display_name),
      role = coalesce(excluded.role, public.user_profiles.role),
      interests = case
        when array_length(excluded.interests, 1) is null then public.user_profiles.interests
        else excluded.interests
      end,
      updated_at = now();
  exception
    when unique_violation then
      update public.user_profiles
      set
        auth_user_id = new.id,
        display_name = coalesce(resolved_display_name, public.user_profiles.display_name),
        role = coalesce(resolved_role, public.user_profiles.role),
        interests = case
          when array_length(resolved_interests, 1) is null then public.user_profiles.interests
          else resolved_interests
        end,
        updated_at = now()
      where email = new.email;
  end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();
