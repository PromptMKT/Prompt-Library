-- Function to award initial bonus coins to a new user.
create or replace function public.award_initial_bonus_coins()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Insert the bonus coin transaction for the new user.
  insert into public.coin_transactions (user_id, transaction_type, amount, description)
  values (new.id, 'bonus', 100000, 'Initial bonus coins');
  return new;
end;
$$;

-- Trigger to award bonus coins after a new user profile is created.
drop trigger if exists on_new_user_award_bonus on public.users;
create trigger on_new_user_award_bonus
  after insert on public.users
  for each row execute procedure public.award_initial_bonus_coins();

-- Function to backfill bonus coins for existing users who don't have them.
create or replace function public.backfill_existing_users_coins()
returns void
language plpgsql
as $$
declare
  user_record record;
begin
  -- Normalize existing initial bonus rows to the new 100000 amount.
  update public.coin_transactions
  set amount = 100000
  where transaction_type = 'bonus'
    and description = 'Initial bonus coins';

  for user_record in select id from public.users loop
    if not exists (select 1 from public.coin_transactions where user_id = user_record.id and transaction_type = 'bonus' and description = 'Initial bonus coins') then
      insert into public.coin_transactions (user_id, transaction_type, amount, description)
      values (user_record.id, 'bonus', 100000, 'Initial bonus coins');
    end if;
  end loop;

  -- Keep cached balance synchronized with ledger-derived sum.
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
end;
$$;

-- Run the backfill function to ensure all existing users have their bonus coins.
select public.backfill_existing_users_coins();
