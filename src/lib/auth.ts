import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const PRIMARY_PROFILE_TABLE = "users";
const LEGACY_PROFILE_TABLE = "user_profiles";

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase().replace(/\s+/g, "");
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must include at least one lowercase letter.";
  if (!/\d/.test(password)) return "Password must include at least one number.";
  return null;
}

export function toAuthMessage(raw: string, mode: "signup" | "signin"): string {
  const message = (raw || "").toLowerCase();

  if (message.includes("rate limit")) {
    return "Too many attempts right now. Please wait a minute and try again.";
  }
  if (message.includes("invalid login credentials")) return "Wrong email or password.";
  if (message.includes("email address") && message.includes("invalid")) return "Please enter a valid email address.";
  if (message.includes("database error saving new user")) {
    return "Unable to create account right now due to profile sync issue. Please try again in a minute or use a different email.";
  }
  if (message.includes("user already registered") || message.includes("already been registered")) {
    return "This email is already registered. Please sign in instead.";
  }
  if (message.includes("password")) return raw;
  if (message.includes("email not confirmed")) return "Please verify your email before signing in.";

  return mode === "signup"
    ? `Unable to create account right now. (${raw || "Unknown error"})`
    : `Unable to sign in right now. (${raw || "Unknown error"})`;
}

export async function ensureUserProfile(user: User, fallback?: { role?: string; interests?: string[]; displayName?: string }) {
  const metadata = (user.user_metadata || {}) as Record<string, unknown>;
  const role =
    (typeof metadata.role === "string" && metadata.role) ||
    fallback?.role ||
    "buyer";

  const interestsFromMeta = Array.isArray(metadata.interests)
    ? metadata.interests.filter((item): item is string => typeof item === "string")
    : [];

  const interests = interestsFromMeta.length > 0 ? interestsFromMeta : fallback?.interests || [];

  const displayName =
    (typeof metadata.display_name === "string" && metadata.display_name) ||
    fallback?.displayName ||
    ((user.email || "").split("@")[0] || "User");

  const payload = {
    auth_user_id: user.id,
    email: user.email || "",
    display_name: displayName,
    role: "seller", // Matches your table's existing roles
    interests: [],
  };

  const { error } = await supabase.from(PRIMARY_PROFILE_TABLE).upsert(
    payload,
    { onConflict: "auth_user_id" }
  );

  return { error };
}

export async function isRegisteredEmail(email: string): Promise<{ exists: boolean; error: string | null }> {
  const inputEmail = sanitizeEmail(email);
  const { data, error } = await supabase.rpc("is_registered_email", { input_email: inputEmail });

  if (error) {
    return { exists: false, error: error.message || "Unable to verify email." };
  }

  return { exists: Boolean(data), error: null };
}
