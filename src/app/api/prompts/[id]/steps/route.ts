import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const body = await request.json();
    
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

    const { data: step, error: stepError } = await supabase
      .from('prompt_steps')
      .insert({ ...body, prompt_id: id })
      .select()
      .single();

    if (stepError) throw stepError;

    // Optional: increment step_count in prompts
    // @ts-ignore
    await supabase.rpc('increment_prompt_step_count', { prompt_id: id });

    return NextResponse.json({ success: true, step });
  } catch (error: any) {
    console.error("POST /api/prompts/[id]/steps error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
