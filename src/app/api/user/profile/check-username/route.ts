import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ success: false, error: "Username is required" }, { status: 400 });
    }

    const trimmed = username.trim().toLowerCase();

    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("users")
      .select("id")
      .eq("username", trimmed)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      available: !data,
    });
  } catch (error: any) {
    console.error("Check Username Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
