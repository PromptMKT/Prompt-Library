import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTargetAudience() {
  const { data, error } = await supabase
    .from('prompts')
    .select('id, target_audience')
    .limit(10);
  
  if (error) {
    console.error(error);
    return;
  }
  
  data.forEach(row => {
    console.log(`ID: ${row.id}, Type: ${typeof row.target_audience}, Value:`, row.target_audience);
  });
}

inspectTargetAudience().catch(console.error);
