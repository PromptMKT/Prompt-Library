"use server";

import crypto from "crypto";

export async function uploadToCloudinary(formData: FormData): Promise<string> {
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");

  // Required Cloudinary credentials from environment variables
  const api_key = process.env.CLOUDINARY_API_KEY!;
  const api_secret = process.env.CLOUDINARY_API_SECRET!;
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME!;
  const timestamp = Math.round(new Date().getTime() / 1000).toString();

  // Create SHA-1 signature based on Cloudinary spec: sha1(params_to_sign + api_secret)
  // We only have timestamp as a param
  const str = `timestamp=${timestamp}${api_secret}`;
  const signature = crypto.createHash("sha1").update(str).digest("hex");

  // Prepare form data for Cloudinary API
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

  // Returns the HTTPS URL of the uploaded image/video
  return data.secure_url;
}
