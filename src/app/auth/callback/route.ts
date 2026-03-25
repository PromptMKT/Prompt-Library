import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log("Auth callback URL:", request.url);
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/home";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch (err) {
              console.error("Cookie setting failed (ignoring if middleware handles it):", err);
            }
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      try {
        // Sync user profile to public.users table on every sign-in/callback
        const { ensureUserProfile } = await import("@/lib/auth");
        const { error: syncError } = await ensureUserProfile(data.user, {}, supabase);
        
        if (syncError) {
          console.error("Profile sync failed in callback (non-fatal):", syncError);
        }
      } catch (err) {
        console.error("Unexpected error during profile sync in callback:", err);
      }

      console.log("Auth exchange successful, redirecting to:", `${origin}${next}`);
      return NextResponse.redirect(`${origin}${next}`);
    }
    
    if (error) {
      console.error("Auth callback error during session exchange:", error);
      // Construct a more descriptive error redirect if possible
      const errorMessage = error.message || "auth_callback_error";
      return NextResponse.redirect(`${origin}/sign-in?error=${encodeURIComponent(errorMessage)}`);
    }
  } else {
    console.error("Auth callback failed: No code parameter found in URL searchParams.");
    const errorDescription = searchParams.get("error_description");
    if (errorDescription) {
      console.error("Error from Supabase:", errorDescription);
      return NextResponse.redirect(`${origin}/sign-in?error=${encodeURIComponent(errorDescription)}`);
    }
  }

  // If there's no code or there was an error, return to the login page
  return NextResponse.redirect(`${origin}/sign-in?error=auth_callback_error`);
}
