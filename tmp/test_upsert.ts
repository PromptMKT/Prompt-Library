
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function test() {
  const { data, error } = await s.from('users').upsert({
    auth_user_id: '4fa3e683-6d5d-4d90-8559-6bee504035ae', // THE USER1 UUID from sample
    email: 'user1@gmail.com',
    display_name: 'Test Upsert'
  }, { onConflict: 'auth_user_id' });

  if (error) console.error('Upsert Error:', error);
  else console.log('Upsert Success:', data);
}

test();
