import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const body = await request.json();
    const updates = body.updates; // array of {id, step_number}
    
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
       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    for (let i = 0; i < updates.length; i++) {
        const item = updates[i];
        const { error } = await supabase
            .from('prompt_steps')
            .update({ step_number: item.step_number })
            .eq('id', item.id)
            .eq('prompt_id', id);
        
        if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PUT /api/prompts/[id]/steps/reorder error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
