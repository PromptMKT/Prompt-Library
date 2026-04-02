-- Atomic custom coin top-up RPC
-- Conversion: INR 20 = 50 coins

create or replace function public.execute_coin_topup_custom(
  p_coins integer,
  p_auth_user_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_public_user_id uuid;
  v_rupees numeric(10,2);
begin
  if auth.uid() is null or auth.uid() <> p_auth_user_id then
    return jsonb_build_object('success', false, 'message', 'Unauthorized top-up request.');
  end if;

  if p_coins is null or p_coins <= 0 then
    return jsonb_build_object('success', false, 'message', 'Please enter a valid coin amount.');
  end if;

  select u.id
  into v_public_user_id
  from public.users u
  where u.auth_user_id = p_auth_user_id
  for update;

  if v_public_user_id is null then
    return jsonb_build_object('success', false, 'message', 'User profile not found.');
  end if;

  v_rupees := round(((p_coins::numeric / 50.0) * 20.0)::numeric, 2);

  insert into public.money_transactions (
    user_id,
    transaction_type,
    amount,
    currency,
    payment_gateway_id,
    status
  ) values (
    v_public_user_id,
    'purchase_coins',
    v_rupees,
    'INR',
    null,
    'completed'
  );

  insert into public.coin_transactions (
    user_id,
    transaction_type,
    amount,
    related_entity_type,
    description
  ) values (
    v_public_user_id,
    'conversion_from_money',
    p_coins,
    'topup_custom',
    'Custom top-up: ' || p_coins || ' coins'
  );

  return jsonb_build_object(
    'success', true,
    'message', p_coins || ' coins added successfully.'
  );
end;
$$;

revoke all on function public.execute_coin_topup_custom(integer, uuid) from public;
grant execute on function public.execute_coin_topup_custom(integer, uuid) to authenticated;
