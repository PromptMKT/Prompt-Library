import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const api_key = process.env.CLOUDINARY_API_KEY!;
    const api_secret = process.env.CLOUDINARY_API_SECRET!;
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME!;
    
    if (!api_key || !api_secret || !cloud_name) {
      console.error("Missing Cloudinary credentials");
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
      throw new Error(data.error?.message || "Failed to upload to Cloudinary");
    }

    return NextResponse.json({ 
      url: data.secure_url,
      publicId: data.public_id 
    });
  } catch (err: any) {
    console.error("Cloudinary upload route error:", err.message);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { public_id } = await request.json();
    if (!public_id) {
      return NextResponse.json({ error: "No public_id provided" }, { status: 400 });
    }

    const api_key = process.env.CLOUDINARY_API_KEY!;
    const api_secret = process.env.CLOUDINARY_API_SECRET!;
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME!;

    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const str = `public_id=${public_id}&timestamp=${timestamp}${api_secret}`;
    const signature = crypto.createHash("sha1").update(str).digest("hex");

    const fd = new FormData();
    fd.append("public_id", public_id);
    fd.append("api_key", api_key);
    fd.append("timestamp", timestamp);
    fd.append("signature", signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/destroy`, {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
