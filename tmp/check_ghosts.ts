
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const s = createClient(url, key);

async function run() {
  console.log('--- Checking for ghost tables ---');
  
  const { data: up, error: upError } = await s.from('user_profiles').select('*').limit(1);
  if (upError) console.log('user_profiles: NOT FOUND or ERROR', upError.code);
  else console.log('user_profiles: EXISTS', up[0]);

  const { data: u, error: uError } = await s.from('users').select('*').limit(1);
  if (uError) console.log('users: NOT FOUND or ERROR', uError.code);
  else console.log('users: EXISTS', u[0]);

  const { data: cp, error: cpError } = await s.from('consumer_profiles').select('*').limit(1);
  if (cpError) console.log('consumer_profiles: NOT FOUND or ERROR', cpError.code);
  else console.log('consumer_profiles: EXISTS', cp[0]);
}

run();
