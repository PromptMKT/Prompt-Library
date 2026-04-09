import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ promptIds: [] });
    }

    const { data, error } = await supabase
      .from('wishlist')
      .select('prompt_id')
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ promptIds: [] });
    }

    return NextResponse.json({ promptIds: data.map((item: any) => item.prompt_id) });
  } catch {
    return NextResponse.json({ promptIds: [] });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Must be signed in" }, { status: 401 });
    }

    const body = await request.json();
    const promptId = body.promptId;

    if (!promptId) {
      return NextResponse.json({ success: false, error: "Prompt ID missing" }, { status: 400 });
    }

    // Check if it exists
    const { data: existing } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', user.id)
      .eq('prompt_id', promptId)
      .single();

    if (existing) {
      // Remove
      await supabase.from('wishlist').delete().eq('user_id', user.id).eq('prompt_id', promptId);
      return NextResponse.json({ success: true, wishlisted: false });
    } else {
      // Add
      await supabase.from('wishlist').insert({ user_id: user.id, prompt_id: promptId });
      return NextResponse.json({ success: true, wishlisted: true });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
