-- Atomic coin top-up RPC for wallet packages
-- Package mapping is validated server-side in SQL.

create or replace function public.execute_coin_topup(
  p_package_id text,
  p_auth_user_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_public_user_id uuid;
  v_coins integer;
  v_rupees numeric(10,2);
  v_label text;
begin
  if auth.uid() is null or auth.uid() <> p_auth_user_id then
    return jsonb_build_object('success', false, 'message', 'Unauthorized top-up request.');
  end if;

  select u.id
  into v_public_user_id
  from public.users u
  where u.auth_user_id = p_auth_user_id
  for update;

  if v_public_user_id is null then
    return jsonb_build_object('success', false, 'message', 'User profile not found.');
  end if;

  if p_package_id = 'starter' then
    v_coins := 100;
    v_rupees := 89;
    v_label := 'Starter pack';
  elsif p_package_id = 'popular' then
    v_coins := 500;
    v_rupees := 399;
    v_label := 'Popular pack';
  elsif p_package_id = 'pro' then
    v_coins := 1200;
    v_rupees := 849;
    v_label := 'Pro pack';
  else
    return jsonb_build_object('success', false, 'message', 'Invalid package selected.');
  end if;

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
    v_coins,
    'topup_package',
    'Top-up: ' || v_label
  );

  return jsonb_build_object(
    'success', true,
    'message', v_coins || ' coins added successfully.'
  );
end;
$$;

revoke all on function public.execute_coin_topup(text, uuid) from public;
grant execute on function public.execute_coin_topup(text, uuid) to authenticated;
