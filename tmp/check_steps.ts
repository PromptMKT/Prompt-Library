
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const s = createClient(url, key);

async function run() {
  console.log('--- Checking prompt_steps ---');
  const { data, error } = await s.from('prompt_steps').select('*').limit(1);
  if (error) console.error('Steps Error:', error);
  else console.log('Steps Sample:', data[0]);
}

run();
