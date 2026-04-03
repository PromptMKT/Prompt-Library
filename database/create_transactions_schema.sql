-- Schema for coin and money transactions

-- Add total_coins to users
alter table public.users add column if not exists total_coins integer not null default 0;

-- Create coin_transactions table
create table if not exists public.coin_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  transaction_type text not null check (transaction_type in ('purchase', 'bonus', 'conversion_from_money', 'refund', 'prompt_purchase')),
  amount integer not null,
  description text,
  related_entity_id uuid,
  related_entity_type text,
  created_at timestamptz not null default now()
);

-- Create money_transactions table
create table if not exists public.money_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  transaction_type text not null check (transaction_type in ('purchase_prompt', 'purchase_coins')),
  amount numeric(10, 2) not null,
  currency text not null default 'USD',
  payment_gateway_id text,
  status text not null check (status in ('pending', 'completed', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists coin_transactions_user_id_idx on public.coin_transactions(user_id);
create index if not exists money_transactions_user_id_idx on public.money_transactions(user_id);

-- Function to update total_coins on new coin transaction
create or replace function public.update_total_coins()
returns trigger
language plpgsql
as $$
begin
  update public.users
  set total_coins = total_coins + new.amount
  where id = new.user_id;
  return new;
end;
$$;

-- Trigger to update total_coins
drop trigger if exists on_new_coin_transaction on public.coin_transactions;
create trigger on_new_coin_transaction
after insert on public.coin_transactions
for each row execute function public.update_total_coins();

-- RLS policies for coin_transactions
alter table public.coin_transactions enable row level security;

drop policy if exists "Users can read own coin transactions" on public.coin_transactions;
create policy "Users can read own coin transactions"
on public.coin_transactions
for select
using (
  exists (
    select 1 from public.users u
    where u.id = coin_transactions.user_id
      and u.auth_user_id = auth.uid()
  )
);

-- RLS policies for money_transactions
alter table public.money_transactions enable row level security;

drop policy if exists "Users can read own money transactions" on public.money_transactions;
create policy "Users can read own money transactions"
on public.money_transactions
for select
using (
  exists (
    select 1 from public.users u
    where u.id = money_transactions.user_id
      and u.auth_user_id = auth.uid()
  )
);

-- Function to give initial 200 coins to existing users
create or replace function public.backfill_existing_users_coins()
returns void
language plpgsql
as $$
declare
  user_record record;
begin
  for user_record in select id from public.users loop
    if not exists (select 1 from public.coin_transactions where user_id = user_record.id and transaction_type = 'bonus' and description = 'Initial bonus coins') then
      insert into public.coin_transactions (user_id, transaction_type, amount, description)
      values (user_record.id, 'bonus', 100000, 'Initial bonus coins');
    end if;
  end loop;
end;
$$;

-- Run the backfill function
select public.backfill_existing_users_coins();
