import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  props: { params: Promise<{ username: string }> }
) {
  try {
    const { username: targetUsername } = await props.params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "followers" | "following"

    if (type !== "followers" && type !== "following") {
      return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // 1. Get Target User ID
    const { data: targetUser, error: userError } = await supabase
      .from("users")
      .select("id, username")
      .eq("username", targetUsername)
      .maybeSingle();

    if (userError || !targetUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // 2. Fetch network based on type
    const filterCol = type === "followers" ? "following_id" : "follower_id";
    const fkName = type === "followers" ? "follows_follower_id_fkey" : "follows_following_id_fkey";

    const { data: followRows, error } = await supabase
      .from("follows")
      .select(`users!${fkName}(id, username, bio, avatar_url)`)
      .eq(filterCol, targetUser.id);

    if (error) throw error;

    // Supabase inner join returns an array or single object inside users depending,
    // but with 1:1 fk it's an object. 
    const users = (followRows || [])
      .map((row: any) => row.users)
      .filter((u: any) => Boolean(u));

    return NextResponse.json({
      success: true,
      data: {
        profileUser: targetUser,
        users
      }
    });
  } catch (error: any) {
    console.error("Network API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
