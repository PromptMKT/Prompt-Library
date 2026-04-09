import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await props.params;
    const supabase = await createServerSupabaseClient();
    
    // Mimics getCategoryDetail
    const { data: category, error } = await supabase
      .from('categories')
      .select(`
        *,
        subcategories(*),
        prompts(
          id, title, price, cover_image_url, created_at, purchases_count, average_rating,
          users!prompts_creator_id_fkey(username)
        )
      `)
      .eq('slug', slug)
      .eq('prompts.is_published', true)
      .limit(20, { foreignTable: 'prompts' })
      .maybeSingle();

    if (error) throw error;
    if (!category) {
       return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    console.error("Category detail fetch error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
