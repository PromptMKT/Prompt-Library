import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSubcatTables() {
  const sa = await supabase.from('subcategory_audience').select('audience_id').limit(1);
  const so = await supabase.from('subcategory_output').select('output_id').limit(1);
  
  console.log("subcategory_audience:", !sa.error || sa.error.code !== '42P01');
  console.log("subcategory_output:", !so.error || so.error.code !== '42P01');
}

checkSubcatTables().catch(console.error);
