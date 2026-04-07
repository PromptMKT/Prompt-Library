import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase.rpc('get_tables_dummy'); 
  // We can just query pg_class if we have db credentials, but with REST API we just try to fetch 1 row
  const tags = await supabase.from('tags').select('id').limit(1);
  const audiences = await supabase.from('audiences').select('id').limit(1);
  const outputs = await supabase.from('outputs').select('id').limit(1);
  
  console.log("Tags table exists:", !tags.error || tags.error.code !== '42P01');
  console.log("Tags err:", tags.error);
  
  console.log("Audiences table exists:", !audiences.error || audiences.error.code !== '42P01');
  console.log("Outputs table exists:", !outputs.error || outputs.error.code !== '42P01');
}

checkSchema().catch(console.error);
