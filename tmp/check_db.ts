
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('--- Checking Prompts ---');
  const { data: prompts, error: pError } = await supabase.from('prompts').select('*').limit(1);
  if (pError) console.error('Prompts Error:', pError);
  else console.log('Prompt Sample:', prompts[0]);

  console.log('\n--- Checking Users (select *) ---');
  const { data: users, error: uError } = await supabase.from('users').select('*').limit(1);
  if (uError) console.error('Users Error:', uError);
  else console.log('User Sample:', users[0]);
}

check();
