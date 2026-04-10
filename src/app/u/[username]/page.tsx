"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileStats } from "./components/ProfileStats";
import { ProfileTabs } from "./components/ProfileTabs";
import { ProfileSidebarContent } from "./components/ProfileSidebarContent";
import { SellerPromptCard } from "./components/SellerPromptCard";
import { VisitorSidebarContent } from "./components/VisitorSidebarContent";
import { ProfileReviews } from "./components/ProfileReviews";
import { ProfileAbout } from "./components/ProfileAbout";
import { useAuth } from "@/components/AuthProvider";

type TabType = "prompts" | "published" | "purchased" | "wishlist" | "activity" | "reviews" | "about";

export default function SellerProfilePage({ params: paramsPromise }: { params: Promise<{ username: string }> }) {
  const router = useRouter();
  const { profile, user: authUser, loading: authLoading } = useAuth();
  const params = React.use(paramsPromise);

  const [user, setUser] = useState<any>(null);
  const [sellerPrompts, setSellerPrompts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [purchasedPrompts, setPurchasedPrompts] = useState<any[]>([]);
  const [wishlistPrompts, setWishlistPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("prompts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [promptFilter, setPromptFilter] = useState("All");



  useEffect(() => {
    if (authLoading) return;

    const fetchAll = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/${params.username}`);
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        const json = await res.json();
        if (json.success && json.data) {
          setUser(json.data.user);
          setSellerPrompts(json.data.sellerPrompts);
          setReviews(json.data.reviews);
          setPurchasedPrompts(json.data.purchasedPrompts);
          setWishlistPrompts(json.data.wishlistPrompts);
          setIsFollowing(json.data.isFollowing);
          // Set an overarching isOwner if the API returned it.
          // The API returns isOwner relative to the authenticated session context.
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error loading profile data:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [params.username, authLoading, profile, authUser]);

  // ── Computed Stats ──
  const stats = useMemo(() => {
    const totalSales = sellerPrompts.reduce((acc, p) => acc + (p.sales || 0), 0);
    const totalReviews = reviews.length;
    const avgRating =
      reviews.length > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
        : user?.avgRating || 0;
    return {
      promptsCount: sellerPrompts.filter((p) => p.status === "live").length,
      totalPrompts: sellerPrompts.length,
      totalSales,
      avgRating,
      totalReviews,
      purchasedCount: purchasedPrompts.length,
      wishlistCount: wishlistPrompts.length,
    };
  }, [sellerPrompts, reviews, purchasedPrompts, wishlistPrompts, user]);

  // ── Platform breakdown ──
  const platformBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of sellerPrompts) {
      const plat = p.platform || "Other";
      map.set(plat, (map.get(plat) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [sellerPrompts]);

  // ── Filtered prompts for the grid ──
  const filteredPrompts = useMemo(() => {
    if (promptFilter === "All") return sellerPrompts;
    if (promptFilter === "Live") return sellerPrompts.filter((p) => p.status === "live");
    if (promptFilter === "Draft") return sellerPrompts.filter((p) => p.status === "draft");
    return sellerPrompts;
  }, [sellerPrompts, promptFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-2xl font-black">User not found</p>
          <p className="text-muted-foreground text-sm">The profile you\'re looking for doesn\'t exist.</p>
        </div>
      </div>
    );
  }

  const toggleFollow = async () => {
    if (!profile || !profile.id) {
      toast.error("Please sign in to follow creators");
      return;
    }

    try {
      const res = await fetch("/api/user/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: user.id }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to toggle follow");

      if (json.action === "followed") {
        setIsFollowing(true);
        setUser({ ...user, followers: user.followers + 1 });
        toast.success(`✓ Following ${user.name}`);
      } else {
        setIsFollowing(false);
        setUser({ ...user, followers: Math.max(0, user.followers - 1) });
        toast("Unfollowed");
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("✓ Link copied to clipboard!");
  };
    const handleProfileSave = ({ username, bio }: { username: string; bio: string }) => {
    const usernameChanged = username !== user.username;
    if (usernameChanged) {
      // Redirect to new username URL since the route param is based on username
      window.location.href = `/u/${username}`;
    } else {
      setUser((prev: any) => ({ ...prev, bio }));
    }
  };

  const isOwner = profile?.username === user.username || authUser?.id === user.auth_user_id;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <ProfileHeader
        user={user}
        isFollowing={isFollowing}
        onFollow={toggleFollow}
        onCopyLink={copyLink}
        isOwner={isOwner}
        onSave={handleProfileSave}
      />

      <ProfileStats
        onTabChange={setActiveTab}
        isOwner={isOwner}
        promptsCount={stats.promptsCount}
        totalSales={stats.totalSales}
        avgRating={stats.avgRating}
        reviewsCount={stats.totalReviews}
        coins={user.coins}
        purchasedCount={stats.purchasedCount}
      />

      <div className="max-w-[1400px] mx-auto px-7 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8 items-start">
          <div className="space-y-6 min-w-0">
            <ProfileTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isOwner={isOwner}
              promptsCount={stats.promptsCount}
              reviewsCount={stats.totalReviews}
              purchasedCount={stats.purchasedCount}
              wishlistCount={stats.wishlistCount}
            />

            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">

                {/* ═══ PROMPTS TAB ═══ */}
                {(activeTab === "published" || activeTab === "prompts") && (
                  <motion.div key="published" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="space-y-6">
                    <div className="filter-bar flex flex-wrap items-center gap-2">
                      {(isOwner ? ["All", "Live", "Draft", "Under review"] : ["All"]).map((filter, i) => (
                        <span
                          key={i}
                          onClick={() => setPromptFilter(filter)}
                          className={cn(
                            "py-[6px] px-4 rounded-full text-[10px] font-black uppercase tracking-widest border border-border/50 cursor-pointer transition-all",
                            promptFilter === filter
                              ? "bg-primary text-white border-primary"
                              : "text-muted-foreground hover:text-foreground hover:border-primary/40"
                          )}
                        >
                          {filter}
                        </span>
                      ))}
                      <select className="ml-auto p-2 px-4 rounded-xl border border-border/50 bg-transparent text-foreground text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer">
                        <option>Sort: Top selling</option>
                        <option>Sort: Newest</option>
                      </select>
                    </div>

                    {isOwner && (
                      <div className="flex items-center justify-between p-6 bg-primary/5 border border-primary/10 rounded-2xl shadow-sm hover:border-primary transition-all">
                        <div className="space-y-1">
                          <div className="text-sm font-black uppercase tracking-tight text-foreground">Ready to list a new prompt?</div>
                          <div className="text-[11px] text-muted-foreground font-semibold">
                            You have <span className="text-primary font-black">{stats.totalPrompts}</span> prompts listed
                          </div>
                        </div>
                        <button
                          className="py-3 px-8 rounded-full bg-primary text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                          onClick={() => router.push("/upload")}
                        >
                          + New prompt
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4">
                      <div className="text-sm font-black uppercase tracking-[0.14em] text-foreground/80">
                        {isOwner ? "Your Prompts" : "Published Prompts"}
                      </div>
                      <span className="text-[11px] text-muted-foreground font-semibold">
                        {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {filteredPrompts.length === 0 ? (
                      <div className="text-center py-20 text-muted-foreground text-sm">No prompts found</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                        {filteredPrompts.map((p) => (
                          <SellerPromptCard key={p.id} prompt={p} isOwner={isOwner} />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ═══ REVIEWS TAB ═══ */}
                {activeTab === "reviews" && (
                  <motion.div key="reviews" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                    <ProfileReviews reviews={reviews} avgRating={stats.avgRating} />
                  </motion.div>
                )}

                {/* ═══ ABOUT TAB ═══ */}
                {activeTab === "about" && (
                  <motion.div key="about" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                    <ProfileAbout
                      user={user}
                      promptsCount={stats.promptsCount}
                      totalSales={stats.totalSales}
                      avgRating={stats.avgRating}
                      reviewsCount={stats.totalReviews}
                      platformBreakdown={platformBreakdown}
                    />
                  </motion.div>
                )}

                {/* ═══ PURCHASED TAB (owner only) ═══ */}
                {activeTab === "purchased" && isOwner && (
                  <motion.div key="purchased" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-black uppercase tracking-[0.14em] text-foreground/80">Purchased Prompts</div>
                      <span className="text-[11px] text-muted-foreground font-semibold">{purchasedPrompts.length} total</span>
                    </div>
                    {purchasedPrompts.length === 0 ? (
                      <div className="text-center py-20">
                        <p className="text-muted-foreground text-sm">You haven't purchased any prompts yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                        {purchasedPrompts.map((p) => (
                          <SellerPromptCard key={p.id} prompt={p} />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ═══ WISHLIST TAB (owner only) ═══ */}
                {activeTab === "wishlist" && isOwner && (
                  <motion.div key="wishlist" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-black uppercase tracking-[0.14em] text-foreground/80">Your Wishlist</div>
                      <span className="text-[11px] text-muted-foreground font-semibold">{wishlistPrompts.length} saved</span>
                    </div>
                    {wishlistPrompts.length === 0 ? (
                      <div className="text-center py-20">
                        <p className="text-muted-foreground text-sm">Your wishlist is empty. Browse the explore page to save prompts!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                        {wishlistPrompts.map((p) => (
                          <SellerPromptCard key={p.id} prompt={p} />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ═══ ACTIVITY TAB (owner only) ═══ */}
                {activeTab === "activity" && isOwner && (
                  <motion.div key="activity" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="space-y-6">
                    <div className="text-sm font-black uppercase tracking-[0.14em] text-foreground/80 mb-4">Recent Activity</div>
                    <div className="space-y-3">
                      {sellerPrompts.slice(0, 3).map((p) => (
                        <div key={`upload-${p.id}`} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">📤</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-foreground truncate">Published "{p.title}"</div>
                            <div className="text-[10px] text-muted-foreground">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Recently"}</div>
                          </div>
                          <span className="text-[10px] font-black px-2 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-widest">Upload</span>
                        </div>
                      ))}
                      {purchasedPrompts.slice(0, 3).map((p) => (
                        <div key={`buy-${p.id}`} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                          <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 text-sm">🛒</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-foreground truncate">Purchased "{p.title}"</div>
                            <div className="text-[10px] text-muted-foreground">{p.purchasedAt ? new Date(p.purchasedAt).toLocaleDateString() : "Recently"}</div>
                          </div>
                          <span className="text-[10px] font-black px-2 py-1 rounded-full bg-amber-500/10 text-amber-500 uppercase tracking-widest">Purchase</span>
                        </div>
                      ))}
                      {sellerPrompts.length === 0 && purchasedPrompts.length === 0 && (
                        <div className="text-center py-20">
                          <p className="text-muted-foreground text-sm">No recent activity.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

          <div className="hidden xl:block">
            {isOwner ? (
              <ProfileSidebarContent
                coins={user.coins}
                totalSales={stats.totalSales}
                platformBreakdown={platformBreakdown}
                prompts={sellerPrompts}
              />
            ) : (
              <VisitorSidebarContent
                user={user}
                prompts={sellerPrompts}
                totalSales={stats.totalSales}
                avgRating={stats.avgRating}
                reviewsCount={stats.totalReviews}
                platformBreakdown={platformBreakdown}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
