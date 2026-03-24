"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const PRIMARY_PROFILE_TABLE = "user_profiles";
const LEGACY_PROFILE_TABLE = "users";

export type UserProfile = {
  id?: string;
  auth_user_id: string;
  email: string;
  display_name?: string | null;
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
      .select("id, auth_user_id, email, display_name, role, interests, created_at, updated_at")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (!primary.error) {
      setProfile((primary.data as UserProfile | null) ?? null);
      return;
    }

    if (primary.error.code === "42P01") {
      const legacy = await supabase
        .from(LEGACY_PROFILE_TABLE)
        .select("id, auth_user_id, email, display_name, role, interests, created_at, updated_at")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      setProfile((legacy.data as UserProfile | null) ?? null);
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
