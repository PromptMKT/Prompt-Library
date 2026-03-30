"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ChevronRight as ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileStats } from "./components/ProfileStats";
import { ProfileTabs } from "./components/ProfileTabs";
import { ProfileSidebarContent } from "./components/ProfileSidebarContent";
import { SellerPromptCard } from "./components/SellerPromptCard";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

type TabType = "published" | "purchased" | "wishlist" | "activity" | "reviews";

export default function SellerProfilePage({ params: paramsPromise }: { params: Promise<{ username: string }> }) {
  const { profile, user: authUser, loading: authLoading } = useAuth();
  const params = React.use(paramsPromise);
  
  const [user, setUser] = useState<any>(null);
  const [sellerPrompts, setSellerPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("published");
  const [isFollowing, setIsFollowing] = useState(false);
  
  useEffect(() => {
    if (authLoading) return;

    const fetchUserAndPrompts = async () => {
      try {
        setLoading(true);
        const { data: targetUser, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("username", params.username)
          .maybeSingle();

        if (userError) throw userError;

        let userData = targetUser;
        
        // Use profile if available, or fallback to authUser for "me"/"profile"
        if (!userData && (params.username === "profile" || params.username === "me")) {
          if (profile) {
            userData = profile as any;
          } else if (authUser) {
            userData = {
              id: authUser.id,
              auth_user_id: authUser.id,
              email: authUser.email,
              display_name: authUser.email?.split('@')[0] || "User",
            } as any;
          }
        }

        if (!userData) {
          setDummyData();
          return;
        }

        setUser({
          id: userData.id || userData.auth_user_id,
          auth_user_id: userData.auth_user_id,
          username: userData.username || params.username,
          name: userData.display_name || userData.name || userData.email || "User",
          email: userData.email,
          avatar: userData.avatar_url,
          bio: userData.bio || "I love exploring and purchasing elite AI prompts.",
          location: userData.location || "Global",
          website: userData.website || "vault.io",
          coins: userData.coins || 0,
          followers: userData.followers || 0,
          following: userData.following || 0,
          verified: userData.is_verified || false,
          avgRating: userData.average_rating || 5.0,
          memberSince: userData.created_at ? new Date(userData.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : "Just now"
        });

        const { data: promptsData, error: promptsError } = await supabase
          .from("prompts")
          .select(`
            id, 
            title, 
            description, 
            price, 
            cover_image_url, 
            is_published,
            created_at,
            purchases_count,
            average_rating,
            platforms(name),
            categories(name)
          `)
          .eq("creator_id", userData.id || (userData as any).auth_user_id)
          .order("created_at", { ascending: false });

        if (promptsError) throw promptsError;

        if (promptsData) {
          const mapped = promptsData.map((p: any) => ({
            id: String(p.id),
            title: p.title || "Untitled Prompt",
            price: Number(p.price || 0),
            platform: p.platforms?.name || "AI",
            category: p.categories?.name || "Prompt",
            reviewsCount: p.purchases_count || 0, // Using purchases as a proxy or just count
            rating: p.average_rating || 4.8,
            status: p.is_published ? "live" : "draft",
            image: p.cover_image_url || null,
            promptText: p.description
          }));
          setSellerPrompts(mapped);
        }
      } catch (err) {
        console.error("Error loading profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    const setDummyData = () => {
      const dummyUser = {
        username: "priyanair",
        name: "Priya Nair",
        avatar: null,
        bio: "B2B marketer turned AI prompt engineer. I write prompts that actually work for real sales teams.",
        coins: 240,
        followers: 1204,
        following: 89,
        verified: true,
        location: "Mumbai, India",
        website: "priyanair.in",
        avgRating: 4.9,
        memberSince: "Jan 2026"
      };

      const dummyPrompts = [
        { id: "1", title: "Cold Email that Converts — B2B Framework", price: 30, sales: 489, platform: "ChatGPT", category: "Email", reviewsCount: 127, rating: 4.9, status: "live", trending: true, promptText: "Act as a B2B sales expert and write a sequence..." },
        { id: "2", title: "LinkedIn Post Engine", price: 22, sales: 334, platform: "ChatGPT", category: "LinkedIn", reviewsCount: 112, rating: 4.7, status: "live", trending: false, promptText: "Generate 10 LinkedIn post ideas for SaaS founders..." },
      ];

      setUser(dummyUser);
      setSellerPrompts(dummyPrompts);
      setLoading(false);
    };

    fetchUserAndPrompts();
  }, [params.username, authLoading, profile, authUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    toast(isFollowing ? "Unfollowed" : `✓ Following ${user.name}`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("✓ Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <ProfileHeader 
        user={user} 
        isFollowing={isFollowing} 
        onFollow={toggleFollow} 
        onCopyLink={copyLink} 
        isOwner={profile?.username === user.username || authUser?.id === user.auth_user_id}
      />

      <ProfileStats onTabChange={setActiveTab} />

      <div className="max-w-[1400px] mx-auto p-7 pb-[60px]">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
          
          <div className="space-y-6 min-w-0">
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === "published" && (
                  <motion.div key="published" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="space-y-6">
                    <div className="filter-bar flex flex-wrap items-center gap-2">
                      {["All", "Live", "Draft", "Under review"].map((filter, i) => (
                        <span key={i} className={cn("py-[6px] px-4 rounded-full text-[10px] font-black uppercase tracking-widest border border-border/50 cursor-pointer transition-all", i === 0 ? "bg-primary text-white border-primary" : "text-muted-foreground hover:text-foreground hover:border-primary/40")}>{filter}</span>
                      ))}
                      <select className="ml-auto p-2 px-4 rounded-xl border border-border/50 bg-transparent text-foreground text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer">
                        <option>Sort: Top selling</option>
                        <option>Sort: Newest</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-primary/5 border border-primary/10 rounded-2xl shadow-sm hover:border-primary transition-all">
                      <div className="space-y-1">
                        <div className="text-sm font-black uppercase tracking-tight text-foreground">Ready to list a new prompt?</div>
                        <div className="text-[11px] text-muted-foreground font-semibold">Your last prompt made <span className="text-primary font-black">₹ 489</span> in its first week</div>
                      </div>
                      <button className="py-3 px-8 rounded-full bg-primary text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all" onClick={() => toast("Opening prompt editor...")}>
                        + New prompt
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="text-sm font-black uppercase tracking-[0.14em] text-foreground/80">Published Prompts</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                      {sellerPrompts.map(p => (
                        <SellerPromptCard key={p.id} prompt={p} />
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-10">
                      <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-[11px] font-black uppercase tracking-[0.12em] shadow-lg shadow-primary/20">1</div>
                      {[2, 3, "...", 7].map((num, i) => (
                        <div key={i} className="w-10 h-10 rounded-xl border border-border/50 hover:bg-secondary flex items-center justify-center text-[11px] text-muted-foreground font-black cursor-pointer transition-all">{num}</div>
                      ))}
                      <div className="w-10 h-10 rounded-xl border border-border/50 hover:bg-secondary flex items-center justify-center text-muted-foreground cursor-pointer transition-all"><ChevronRightIcon className="w-4 h-4" /></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <ProfileSidebarContent />
          
        </div>
      </div>
    </div>
  );
}
