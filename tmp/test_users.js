const { createClient } = require('@supabase/supabase-js');
const url = 'https://fecycnhxjsoidshctiua.supabase.co';
const key = 'sb_publishable_9ppofn2qV4R6VvrsiFHzEQ_Af3Brz1p'; // ANON Key from .env.local
const supabase = createClient(url, key);

async function main() {
  const { data, error } = await supabase.from('users').select('*');
  console.log("Users:", JSON.stringify(data, null, 2));
  if (error) console.error("Error:", error);
}
main();
