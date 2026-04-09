import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { targetUserId } = await request.json();
    if (!targetUserId) {
      return NextResponse.json({ success: false, error: "Target User ID is required" }, { status: 400 });
    }

    const { data: authProfile } = await supabase
      .from("users")
      .select("id")
      .eq("auth_user_id", authUser.id)
      .single();

    if (!authProfile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    const followerId = authProfile.id;

    if (followerId === targetUserId) {
      return NextResponse.json({ success: false, error: "You cannot follow yourself" }, { status: 400 });
    }

    // Check existing follow
    const { data: existingFollow } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", followerId)
      .eq("following_id", targetUserId)
      .single();

    if (existingFollow) {
      // Unfollow
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("id", existingFollow.id);
      
      if (error) throw error;

      return NextResponse.json({ success: true, action: "unfollowed" });
    } else {
      // Follow
      const { error } = await supabase
        .from("follows")
        .insert({
          follower_id: followerId,
          following_id: targetUserId,
        });

      if (error) throw error;
      
      return NextResponse.json({ success: true, action: "followed" });
    }
  } catch (error: any) {
    console.error("Follow API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
