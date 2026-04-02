-- Atomic coin-based prompt purchase RPC
-- Uses public schema objects from database.types.ts:
-- purchases(user_id, prompt_id, amount_paid, currency),
-- coin_transactions(user_id, transaction_type, amount, related_entity_id, related_entity_type, description),
-- users(id, auth_user_id, total_coins), prompts(id, creator_id, price)

create or replace function public.execute_coin_prompt_purchase(
  p_prompt_id uuid,
  p_auth_user_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_public_user_id uuid;
  v_creator_id uuid;
  v_price integer;
  v_balance integer;
begin
  if auth.uid() is null or auth.uid() <> p_auth_user_id then
    return jsonb_build_object('success', false, 'message', 'Unauthorized purchase request.');
  end if;

  select u.id, u.total_coins
  into v_public_user_id, v_balance
  from public.users u
  where u.auth_user_id = p_auth_user_id
  for update;

  if v_public_user_id is null then
    return jsonb_build_object('success', false, 'message', 'User profile not found.');
  end if;

  select p.creator_id, coalesce(p.price, 0)::integer
  into v_creator_id, v_price
  from public.prompts p
  where p.id = p_prompt_id;

  if v_creator_id is null then
    return jsonb_build_object('success', false, 'message', 'Prompt not found.');
  end if;

  if v_creator_id = v_public_user_id then
    return jsonb_build_object('success', false, 'message', 'You cannot purchase your own prompt.');
  end if;

  if exists (
    select 1
    from public.purchases pu
    where pu.user_id = v_public_user_id
      and pu.prompt_id = p_prompt_id
  ) then
    return jsonb_build_object('success', false, 'message', 'You already purchased this prompt.');
  end if;

  if coalesce(v_balance, 0) < v_price then
    return jsonb_build_object('success', false, 'message', 'Insufficient coins. Please top up.');
  end if;

  insert into public.purchases (user_id, prompt_id, amount_paid, currency, status)
  values (v_public_user_id, p_prompt_id, v_price, 'coins', 'completed');

  insert into public.coin_transactions (
    user_id,
    transaction_type,
    amount,
    related_entity_id,
    related_entity_type,
    description
  )
  values (
    v_public_user_id,
    'prompt_purchase',
    -v_price,
    p_prompt_id,
    'prompt',
    'Prompt purchase'
  );

  return jsonb_build_object('success', true, 'message', 'Prompt purchased successfully.');
exception
  when unique_violation then
    return jsonb_build_object('success', false, 'message', 'You already purchased this prompt.');
  when others then
    raise;
end;
$$;

revoke all on function public.execute_coin_prompt_purchase(uuid, uuid) from public;
grant execute on function public.execute_coin_prompt_purchase(uuid, uuid) to authenticated;
