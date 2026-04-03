-- ========= RLS POLICIES =========

-- 1. Enable RLS on required tables
alter table public.coin_transactions enable row level security;
alter table public.purchases enable row level security;

-- 2. Policies for 'purchases' table
drop policy if exists "Allow users to read their own purchases" on public.purchases;
drop policy if exists "Allow users to insert their own purchases" on public.purchases;
drop policy if exists "purchases_self_read" on public.purchases;
drop policy if exists "purchases_self_insert" on public.purchases;

create policy "Users can view own purchases" on public.purchases
  for select to authenticated
  using (
    exists (
      select 1
      from public.users u
      where u.id = purchases.user_id
        and u.auth_user_id = auth.uid()
    )
  );

create policy "Users can insert own purchases" on public.purchases
  for insert to authenticated
  with check (
    exists (
      select 1
      from public.users u
      where u.id = purchases.user_id
        and u.auth_user_id = auth.uid()
    )
  );

-- 3. Policies for 'coin_transactions' table
drop policy if exists "Allow users to read their own coin transactions" on public.coin_transactions;
drop policy if exists "Users can read own coin transactions" on public.coin_transactions;

create policy "Users can view own coin transactions" on public.coin_transactions
  for select to authenticated
  using (
    exists (
      select 1
      from public.users u
      where u.id = coin_transactions.user_id
        and u.auth_user_id = auth.uid()
    )
  );
