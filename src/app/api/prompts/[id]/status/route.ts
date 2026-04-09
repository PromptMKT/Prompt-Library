import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const body = await request.json();
    const isPublished = body.isPublished;
    
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data: existing } = await supabase
      .from('prompts')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (!existing || existing.creator_id !== user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized: You do not own this prompt" }, { status: 403 });
    }

    const { error: updateError } = await supabase
      .from('prompts')
      .update({ is_published: isPublished })
      .eq('id', id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PATCH /api/prompts/[id]/status error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
