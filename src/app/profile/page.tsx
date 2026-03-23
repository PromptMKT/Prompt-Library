"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ChevronRight as ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Components
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileStats } from "./components/ProfileStats";
import { ProfileTabs } from "./components/ProfileTabs";
import { ProfileSidebarContent } from "./components/ProfileSidebarContent";
import { SellerPromptCard } from "./components/SellerPromptCard";

type TabType = "published" | "purchased" | "wishlist" | "activity" | "reviews";

export default function SellerProfilePage({ params: paramsPromise }: { params: Promise<{ username: string }> }) {
  const params = React.use(paramsPromise);
  
  const [user, setUser] = useState<any>(null);
  const [sellerPrompts, setSellerPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("published");
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // DEMO MODE: Hardcoded dummy data
    const dummyUser = {
      username: "priyanair",
      name: "Priya Nair",
      avatar: null,
      bio: "B2B marketer turned AI prompt engineer. I write prompts that actually work for real sales teams — tested across 200+ client campaigns.",
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
      { id: "3", title: "Food Photography Hero", price: 32, sales: 112, platform: "FLUX", category: "Food", reviewsCount: 38, rating: 4.6, status: "live", trending: false, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=150&fit=crop&auto=format" },
      { id: "4", title: "SEO Blog Post Architect", price: 28, sales: 0, platform: "ChatGPT", category: "SEO", reviewsCount: 0, rating: 0, status: "draft", trending: false, promptText: "SEO-optimised blog post framework for [TOPIC]..." },
      { id: "5", title: "Competitor Deep Dive Report", price: 55, sales: 0, platform: "Claude", category: "Research", reviewsCount: 0, rating: 0, status: "review", trending: false, promptText: "You are a market research analyst for [INDUSTRY]..." },
      { id: "6", title: "Viral Twitter Thread Framework", price: 25, sales: 445, platform: "ChatGPT", category: "Twitter", reviewsCount: 201, rating: 4.6, status: "live", trending: true },
    ];

    setUser(dummyUser);
    setSellerPrompts(dummyPrompts);
    setLoading(false);
  }, [params.username]);

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
      />

      {/* ── STATS ROW ── */}
      <ProfileStats onTabChange={setActiveTab} />

      {/* ── MAIN CONTENT (Two Columns) ── */}
      <div className="max-w-[1400px] mx-auto p-7 pb-[60px]">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
          
          {/* LEFT: TABS + CONTENT */}
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

                    {/* Pagination */}
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

          {/* RIGHT: SIDEBAR WIDGETS */}
          <ProfileSidebarContent />
          
        </div>
      </div>
    </div>
  );
}
