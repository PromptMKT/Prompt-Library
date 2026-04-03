-- Wallet + RLS + Bonus migration
-- Safe to run multiple times.

-- Ensure RLS is active
alter table public.purchases enable row level security;
alter table public.coin_transactions enable row level security;

-- Purchases policies (auth user can only insert/select rows for their own public user profile)
drop policy if exists "Users can view own purchases" on public.purchases;
drop policy if exists "Users can insert own purchases" on public.purchases;

drop policy if exists "purchases_self_read" on public.purchases;
drop policy if exists "purchases_self_insert" on public.purchases;

create policy "Users can view own purchases"
on public.purchases
for select
to authenticated
using (
  exists (
    select 1
    from public.users u
    where u.id = purchases.user_id
      and u.auth_user_id = auth.uid()
  )
);

create policy "Users can insert own purchases"
on public.purchases
for insert
to authenticated
with check (
  exists (
    select 1
    from public.users u
    where u.id = purchases.user_id
      and u.auth_user_id = auth.uid()
  )
);

-- Coin transaction read policy
drop policy if exists "Users can view own coin transactions" on public.coin_transactions;
drop policy if exists "Users can read own coin transactions" on public.coin_transactions;

create policy "Users can view own coin transactions"
on public.coin_transactions
for select
to authenticated
using (
  exists (
    select 1
    from public.users u
    where u.id = coin_transactions.user_id
      and u.auth_user_id = auth.uid()
  )
);

-- Ensure each user has a 100000 signup bonus transaction
update public.coin_transactions
set amount = 100000
where transaction_type = 'bonus'
  and description = 'Initial bonus coins';

insert into public.coin_transactions (user_id, transaction_type, amount, description)
select u.id, 'bonus', 100000, 'Initial bonus coins'
from public.users u
where not exists (
  select 1
  from public.coin_transactions ct
  where ct.user_id = u.id
    and ct.transaction_type = 'bonus'
    and ct.description = 'Initial bonus coins'
);

-- Sync cached users.total_coins from coin ledger
update public.users u
set total_coins = coalesce(t.total_amount, 0)
from (
  select user_id, sum(amount)::integer as total_amount
  from public.coin_transactions
  group by user_id
) t
where u.id = t.user_id;

update public.users
set total_coins = 0
where id not in (select distinct user_id from public.coin_transactions);
