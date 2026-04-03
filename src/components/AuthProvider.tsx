"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { ensureUserProfile } from "@/lib/auth";

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
  coins?: number;
  total_coins?: number;
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

    let fetchedProfile = null;

    // Try users table first, querying by the auth user UUID column
    const primary = await supabase
      .from("users")
      .select("*")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (primary.data) {
      fetchedProfile = {
        ...primary.data,
        coins: (primary.data as any).total_coins ?? 0,
        total_coins: (primary.data as any).total_coins ?? 0,
      };
    } 

    // If we can't find a record in the users table, 
    // provide a fallback object from metadata so the UI doesn't break.
    // This allows the user to browse the site even if their profile 
    // is being created in the background by a DB trigger or if a sync is delayed.
    if (!fetchedProfile && user) {
      fetchedProfile = {
        id: user.id, // Auth UUID as fallback id
        auth_user_id: user.id,
        email: user.email || "",
        display_name: (user.user_metadata?.display_name as string) || (user.email?.split("@")[0] || "User"),
        role: "buyer",
        coins: 0,
        total_coins: 0,
        is_temporary: true,
      };
    }

    setProfile(fetchedProfile as UserProfile | null);
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
