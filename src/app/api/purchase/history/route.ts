import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (profileError || !profile?.id) {
      return NextResponse.json({ success: false, message: "User profile not found." }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("purchases")
      .select(`
        id,
        purchased_at,
        amount_paid,
        prompts (
          id,
          title,
          cover_image_url,
          platforms (name),
          users!prompts_creator_id_fkey (username)
        )
      `)
      .eq("user_id", profile.id)
      .eq("status", "completed")
      .order("purchased_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch purchase history." },
      { status: 500 }
    );
  }
}
