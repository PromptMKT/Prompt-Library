import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  const tags = await supabase.from('tags').select('*').limit(1);
  const audiences = await supabase.from('audiences').select('*').limit(1);
  const outputs = await supabase.from('outputs').select('*').limit(1);
  
  console.log("Tags:", Object.keys(tags.data?.[0] || {}));
  console.log("Audiences:", Object.keys(audiences.data?.[0] || {}));
  console.log("Outputs:", Object.keys(outputs.data?.[0] || {}));
}

checkColumns().catch(console.error);
