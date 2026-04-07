import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const promptId = request.nextUrl.searchParams.get("promptId");
    if (!promptId) {
      return NextResponse.json({ success: false, message: "promptId is required." }, { status: 400 });
    }

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
      .select("id")
      .eq("user_id", profile.id)
      .eq("prompt_id", promptId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: { purchased: !!data } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to check purchase status." },
      { status: 500 }
    );
  }
}
