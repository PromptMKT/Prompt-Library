import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Cloudinary Credentials
    const api_key = process.env.CLOUDINARY_API_KEY!;
    const api_secret = process.env.CLOUDINARY_API_SECRET!;
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME!;

    if (!api_key || !api_secret || !cloud_name) {
      return NextResponse.json({ error: "Cloudinary credentials not configured" }, { status: 500 });
    }

    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const str = `timestamp=${timestamp}${api_secret}`;
    const signature = crypto.createHash("sha1").update(str).digest("hex");

    const cloudFormData = new FormData();
    cloudFormData.append("file", file);
    cloudFormData.append("api_key", api_key);
    cloudFormData.append("timestamp", timestamp);
    cloudFormData.append("signature", signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`, {
      method: "POST",
      body: cloudFormData,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message || "Failed to upload to Cloudinary" }, { status: res.status });
    }

    return NextResponse.json({ secure_url: data.secure_url });
  } catch (error: any) {
    console.error("API Error (upload):", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
