import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { promptId } = await req.json();

    if (!promptId) {
      return NextResponse.json({ error: "No promptId provided" }, { status: 400 });
    }

    // Increment view count using rpc (if created) or simple update
    // We'll use a direct update for now for simplicity, assuming the column exists
    const { error } = await supabase.rpc('increment_view_count', { prompt_id: promptId });

    if (error) {
      // Fallback to manual increment if RPC doesn't exist
      const { data: current } = await supabase
        .from('prompts')
        .select('views_count')
        .eq('id', promptId)
        .single();
      
      await supabase
        .from('prompts')
        .update({ views_count: (current?.views_count || 0) + 1 })
        .eq('id', promptId);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API Error (analytics):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
