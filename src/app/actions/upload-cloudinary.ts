"use server";

import crypto from "crypto";

export async function uploadToCloudinary(formData: FormData): Promise<string> {
  console.log("Starting Cloudinary upload...");
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");
  console.log("File received:", file.name, "size:", file.size);

  // Required Cloudinary credentials from environment variables
  const api_key = process.env.CLOUDINARY_API_KEY!;
  const api_secret = process.env.CLOUDINARY_API_SECRET!;
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME!;
  
  if (!api_key || !api_secret || !cloud_name) {
    console.error("Missing Cloudinary credentials");
    throw new Error("Cloudinary credentials not configured");
  }

  const timestamp = Math.round(new Date().getTime() / 1000).toString();

  // Create SHA-1 signature based on Cloudinary spec: sha1(params_to_sign + api_secret)
  const str = `timestamp=${timestamp}${api_secret}`;
  console.log("Creating signature with timestamp:", timestamp);
  const signature = crypto.createHash("sha1").update(str).digest("hex");

  // Prepare form data for Cloudinary API
  const cloudFormData = new FormData();
  cloudFormData.append("file", file);
  cloudFormData.append("api_key", api_key);
  cloudFormData.append("timestamp", timestamp);
  cloudFormData.append("signature", signature);

  try {
    console.log(`Fetching Cloudinary URL for cloud: ${cloud_name}`);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`, {
      method: "POST",
      body: cloudFormData,
    });
    
    const data = await res.json();
    if (!res.ok) {
      console.error("Cloudinary upload failed:", data.error?.message);
      throw new Error(data.error?.message || "Failed to upload to Cloudinary");
    }

    console.log("Cloudinary upload successful:", data.secure_url);
    // Returns the HTTPS URL of the uploaded image/video
    return data.secure_url;
  } catch (err: any) {
    console.error("Cloudinary fetch error:", err.message);
    throw err;
  }
}
