-- Creates a public.users entry for a new user in auth.users.

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger to create a user profile on new user signup.
drop trigger if exists on_auth_user_created_create_profile on auth.users;
create trigger on_auth_user_created_create_profile
  after insert on auth.users
  for each row execute procedure public.handle_new_user_profile();
