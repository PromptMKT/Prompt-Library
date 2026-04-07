import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const categories = await supabase.from('categories').select('*').limit(1);
  const subcategories = await supabase.from('subcategories').select('*').limit(1);
  const platforms = await supabase.from('platforms').select('*').limit(1);
  const model_groups = await supabase.from('model_groups').select('*').limit(1);
  const models = await supabase.from('models').select('*').limit(1);
  
  console.log("Categories:", Object.keys(categories.data?.[0] || {}));
  console.log("Subcategories:", Object.keys(subcategories.data?.[0] || {}));
  console.log("Platforms:", Object.keys(platforms.data?.[0] || {}));
  console.log("Model Groups:", Object.keys(model_groups.data?.[0] || {}));
  console.log("Models:", Object.keys(models.data?.[0] || {}));
}

checkSchema().catch(console.error);
