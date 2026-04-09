import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type");

    if (!file || !type) {
      return NextResponse.json({ success: false, error: "File and type are required" }, { status: 400 });
    }

    if (type !== "avatar" && type !== "cover") {
      return NextResponse.json({ success: false, error: "Type must be avatar or cover" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const fileExt = file.name.split(".").pop() || "png";
    const fileName = `${authUser.id}-${type}-${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("profiles")
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from("profiles")
      .getPublicUrl(fileName);

    // Update uses table
    const updatePayload = type === "avatar" ? { avatar_url: publicUrl } : { cover_url: publicUrl };
    
    // Attempt to update directly using the auth_user_id
    const { error: dbError } = await supabase
      .from("users")
      .update(updatePayload)
      .eq("auth_user_id", authUser.id);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error: any) {
    console.error("Photo Upload Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
