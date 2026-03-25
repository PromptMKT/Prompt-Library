import type { SupabaseClient, User } from "@supabase/supabase-js";
import { supabase as defaultSupabase } from "@/lib/supabase";

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

export async function ensureUserProfile(
  user: User, 
  fallback?: { role?: string; interests?: string[]; displayName?: string },
  client?: SupabaseClient
) {
  const supabaseClient = client || defaultSupabase;
  const metadata = (user.user_metadata || {}) as Record<string, unknown>;
  const rawRole =
    (typeof metadata.role === "string" && metadata.role) ||
    fallback?.role ||
    "buyer";

  // Map roles to current enum values in public.users table (buyer, seller, admin)
  const allowedRoles = ['buyer', 'seller', 'admin'];
  let role = rawRole;
  if (!allowedRoles.includes(rawRole)) {
    role = (rawRole === 'buyer' || rawRole === 'other') ? 'buyer' : 'seller';
  }

  const interestsFromMeta = Array.isArray(metadata.interests)
    ? metadata.interests.filter((item): item is string => typeof item === "string")
    : [];

  const interests = interestsFromMeta.length > 0 ? interestsFromMeta : fallback?.interests || [];

  const displayName =
    (typeof metadata.display_name === "string" && metadata.display_name) ||
    (typeof metadata.full_name === "string" && metadata.full_name) ||
    (typeof metadata.name === "string" && metadata.name) ||
    fallback?.displayName ||
    ((user.email || "").split("@")[0] || "User");

  // Query primary table to see if user exists
  const { data: existingUser, error: findError } = await supabaseClient
    .from(PRIMARY_PROFILE_TABLE)
    .select('id, username')
    .eq('auth_user_id', user.id)
    .maybeSingle();

  if (findError) {
    console.error(`Error finding profile in ${PRIMARY_PROFILE_TABLE}:`, findError);
    return { error: findError };
  }

  // Handle Username Generation
  let username = existingUser?.username;
  if (!username) {
    // Generate base username
    const baseUsername = ((typeof metadata.username === "string" && metadata.username) || 
      displayName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')) || "user";
    
    username = baseUsername;

    // Check availability and append random if needed (max 5 attempts)
    let isAvailable = false;
    let attempts = 0;
    while (!isAvailable && attempts < 5) {
      const { data: conflict } = await supabaseClient
        .from(PRIMARY_PROFILE_TABLE)
        .select('id')
        .eq('username', username)
        .maybeSingle();
      
      if (!conflict) {
        isAvailable = true;
      } else {
        username = `${baseUsername}${Math.floor(Math.random() * 10000)}`;
        attempts++;
      }
    }
  }

  const payload = {
    auth_user_id: user.id,
    email: user.email || "",
    username,
    display_name: displayName,
    role,
    interests,
    avatar_url: metadata.avatar_url || metadata.picture || null,
  };

  let finalError;
  if (existingUser) {
    // Update
    const { error: updateError } = await supabaseClient
      .from(PRIMARY_PROFILE_TABLE)
      .update({
        ...payload,
        updated_at: new Date().toISOString()
      })
      .eq('auth_user_id', user.id);
    finalError = updateError;
  } else {
    // Insert
    const { error: insertError } = await supabaseClient
      .from(PRIMARY_PROFILE_TABLE)
      .insert({
        id: user.id, // Ensure id matches auth_user_id for RLS/FK consistency
        ...payload,
      });
    finalError = insertError;
  }

  if (finalError) {
    console.error(`Error syncing to ${PRIMARY_PROFILE_TABLE}:`, finalError);
  }

  return { error: finalError };
}

export async function isRegisteredEmail(email: string, client?: SupabaseClient): Promise<{ exists: boolean; error: string | null }> {
  const supabaseClient = client || defaultSupabase;
  const inputEmail = sanitizeEmail(email);
  const { data, error } = await supabaseClient.from(PRIMARY_PROFILE_TABLE).select('id').eq('email', inputEmail).maybeSingle();

  if (error) {
    return { exists: false, error: error.message || "Unable to verify email." };
  }

  return { exists: Boolean(data), error: null };
}

export async function isRegisteredUsername(username: string, client?: SupabaseClient): Promise<{ exists: boolean; error: string | null }> {
  const supabaseClient = client || defaultSupabase;
  const inputUsername = username.trim().toLowerCase();
  const { data, error } = await supabaseClient.from(PRIMARY_PROFILE_TABLE).select('id').eq('username', inputUsername).maybeSingle();

  if (error) {
    return { exists: false, error: error.message || "Unable to verify username." };
  }

  return { exists: Boolean(data), error: null };
}

export async function signInWithGoogle() {
  const { data, error } = await defaultSupabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
}

export async function signInWithGithub() {
  const { data, error } = await defaultSupabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
}
