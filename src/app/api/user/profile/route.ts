import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PUT(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      username,
      display_name,
      bio,
      location,
      website,
      interests,
      technical_skills
    } = body;

    const updates: any = {};
    if (username !== undefined) updates.username = username.trim().toLowerCase();
    if (display_name !== undefined) updates.display_name = display_name.trim();
    if (bio !== undefined) updates.bio = bio;
    if (location !== undefined) updates.location = location;
    if (website !== undefined) updates.website = website;
    if (interests !== undefined) updates.interests = interests;
    if (technical_skills !== undefined) updates.technical_skills = technical_skills;

    const { error: dbError } = await supabase
      .from("users")
      .update(updates)
      .eq("auth_user_id", authUser.id);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, message: "Profile updated successfully" });

  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
