import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { promptId } = await req.json();

    if (!promptId) {
      return NextResponse.json({ error: "No promptId provided" }, { status: 400 });
    }

    // Try RPC call first; fall back to manual update
    const { error } = await supabase.rpc('increment_view_count', { prompt_id: promptId });

    if (error) {
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
