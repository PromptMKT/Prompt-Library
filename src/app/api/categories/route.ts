import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Equivalent of ALL categories with subcategories
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*, subcategories(*)');

    if (error) throw error;

    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    console.error("Categories fetch error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
