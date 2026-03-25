"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const PRIMARY_PROFILE_TABLE = "users";
const LEGACY_PROFILE_TABLE = "user_profiles";

export type UserProfile = {
  id?: string;
  auth_user_id: string;
  email: string;
  username?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  role?: string | null;
  interests?: string[] | null;
  created_at?: string;
  updated_at?: string;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    const primary = await supabase
      .from(PRIMARY_PROFILE_TABLE)
      .select("id, auth_user_id, email, username, display_name, avatar_url, bio, role, interests, created_at, updated_at")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (primary.data) {
      setProfile(primary.data as UserProfile);
      return;
    }

    // SILENT MIGRATION: If not found in primary, try legacy and sync
    console.log("Profile not found in 'users', checking 'user_profiles' for migration...");
    const legacy = await supabase
      .from(LEGACY_PROFILE_TABLE)
      .select("display_name, role, interests")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (legacy.data) {
      console.log("Legacy profile found! Migrating to 'users' table...");
      // Import dynamically or use standard ensureUserProfile
      // For simplicity in this provider, we call the same payload logic
      const { ensureUserProfile } = await import("@/lib/auth");
      await ensureUserProfile(user, {
        displayName: legacy.data.display_name,
        role: legacy.data.role,
        interests: legacy.data.interests
      });
      
      // Re-fetch from primary now that it's synced
      const retry = await supabase
        .from(PRIMARY_PROFILE_TABLE)
        .select("id, auth_user_id, email, username, display_name, avatar_url, bio, role, interests, created_at, updated_at")
        .eq("auth_user_id", user.id)
        .maybeSingle();
      
      setProfile((retry.data as UserProfile | null) ?? null);
      return;
    }

    setProfile(null);
  };

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    bootstrap();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [user?.id]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      loading,
      isAuthenticated: Boolean(user),
      refreshProfile,
      signOut,
    }),
    [session, user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
