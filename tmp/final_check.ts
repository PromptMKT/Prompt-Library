
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const s = createClient(url, key);

async function run() {
  console.log('--- Testing bare INSERT ---');
  // Use a random email to avoid collision
  const testEmail = `test_${Math.floor(Math.random() * 10000)}@example.com`;
  const { data, error } = await s.from('users').insert({
    email: testEmail,
    display_name: 'Test Bot',
    username: 'testbot_' + Math.floor(Math.random() * 1000),
    auth_user_id: '4fa3e683-6d5d-4d90-8559-6bee504035ae' // Existing auth UUID from sample
  }).select();

  if (error) {
    console.error('INSERT ERROR:', error);
  } else {
    console.log('INSERT SUCCESS:', data);
  }
}

run();
