import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { promptId } = await request.json();

    if (!promptId) {
      return NextResponse.json({ success: false, error: "Prompt ID is required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "You must be signed in to add to wishlist" }, { status: 401 });
    }

    // Check if it's already wishlisted
    const { data: existing, error: checkError } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('prompt_id', promptId)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    if (existing) {
      // Remove it
      const { error: deleteError } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', existing.id);

      if (deleteError) throw deleteError;
      return NextResponse.json({ success: true, wishlisted: false });
    } else {
      // Add it
      const { error: insertError } = await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          prompt_id: promptId
        });

      if (insertError) throw insertError;
      return NextResponse.json({ success: true, wishlisted: true });
    }
  } catch (error: any) {
    console.error("Wishlist toggle error:", error);
    return NextResponse.json({ success: false, error: error.message || "An unexpected error occurred" }, { status: 500 });
  }
}
