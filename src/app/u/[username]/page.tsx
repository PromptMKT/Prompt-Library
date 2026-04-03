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
import { supabase } from "@/lib/supabase";

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

        // ── 1. Fetch target user ──
        const { data: targetUser, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("username", params.username)
          .maybeSingle();

        if (userError) throw userError;

        let userData = targetUser;

        if (!userData && (params.username === "profile" || params.username === "me")) {
          if (profile) {
            userData = profile as any;
          } else if (authUser) {
            userData = {
              id: authUser.id,
              auth_user_id: authUser.id,
              email: authUser.email,
              display_name: authUser.email?.split("@")[0] || "User",
            } as any;
          }
        }

        if (!userData) {
          setLoading(false);
          return;
        }

        const userId = userData.id || userData.auth_user_id;

        // Fetch actual follower and following counts directly
        const [{ count: followersCount }, { count: followingCount }] = await Promise.all([
          supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", userId),
          supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", userId),
        ]);

        // Build a clean display name with fallback chain:
        // display_name → username → email prefix
        const rawDisplayName = userData.display_name;
        const fallbackName = rawDisplayName || userData.username || userData.email?.split("@")[0] || "User";

        setUser({
          id: userId,
          auth_user_id: userData.auth_user_id,
          username: userData.username || params.username,
          displayName: rawDisplayName || "",  // the actual DB display_name (may be null)
          name: fallbackName,                   // always has a value for rendering
          email: userData.email,
          avatar: userData.avatar_url,
          cover_url: userData.cover_url || "",
          bio: userData.bio || "",
          location: userData.location || "",
          website: userData.website || "",
          coins: userData.total_coins || 0,
          followers: followersCount || 0,
          following: followingCount || 0,
          verified: userData.is_verified || false,
          avgRating: userData.average_rating || 0,
          interests: userData.interests || [],
          technicalSkills: userData.technical_skills || [],
          totalSales: userData.total_sales || 0,
          totalPurchases: userData.total_purchases || 0,
          memberSince: userData.created_at
            ? new Date(userData.created_at).toLocaleDateString(undefined, { month: "short", year: "numeric" })
            : "Just joined",
        });

        // ── 1.5. Check if current user is following ──
        // use profile?.id instead of authUser.id because follower_id references public.users(id)
        if (profile && profile.id !== userId) {
          const { data: followData } = await supabase
            .from("follows")
            .select("id")
            .eq("follower_id", profile.id)
            .eq("following_id", userId)
            .single();

          if (followData) {
            setIsFollowing(true);
          }
        }


        // ── 2. Fetch user's prompts ──
        const { data: promptsData } = await supabase
          .from("prompts")
          .select(`
            id, title, description, price, cover_image_url, is_published,
            created_at, purchases_count, average_rating, review_count,
            tags, platform_id, category_id, tagline,
            platforms(name), categories(name)
          `)
          .eq("creator_id", userId)
          .order("created_at", { ascending: false });

        const mapped = (promptsData || []).map((p: any) => ({
          id: String(p.id),
          title: p.title || "Untitled Prompt",
          description: p.description || p.tagline || "",
          price: Number(p.price || 0),
          platform: p.platforms?.name || "AI",
          category: p.categories?.name || "Prompt",
          sales: Number(p.purchases_count || 0),
          reviewsCount: Number(p.review_count || 0),
          rating: Number(p.average_rating || 0),
          status: p.is_published ? "live" : "draft",
          image: p.cover_image_url || null,
          promptText: p.description || p.tagline || "",
          tags: p.tags || [],
          createdAt: p.created_at,
        }));
        setSellerPrompts(mapped);

        // ── 3. Fetch reviews on this user's prompts ──
        const promptIds = mapped.map((p: any) => p.id);
        if (promptIds.length > 0) {
          const { data: reviewsData } = await supabase
            .from("reviews")
            .select(`
              id, rating, title, body, created_at, is_visible,
              prompt_id, user_id,
              prompts(title, categories(name)),
              users!reviews_user_id_fkey(display_name, username, avatar_url)
            `)
            .in("prompt_id", promptIds)
            .eq("is_visible", true)
            .order("created_at", { ascending: false })
            .limit(50);

          setReviews(
            (reviewsData || []).map((r: any) => ({
              id: r.id,
              rating: r.rating,
              title: r.title,
              body: r.body,
              createdAt: r.created_at,
              promptTitle: r.prompts?.title || "Unknown",
              promptCategory: r.prompts?.categories?.name || "Prompt",
              reviewerName: r.users?.display_name || r.users?.username || "Anonymous",
              reviewerAvatar: r.users?.avatar_url || null,
            }))
          );
        }

        // ── 4. Fetch purchased prompts (owner only) ──
        const isOwner =
          profile?.username === (userData.username || params.username) ||
          authUser?.id === userData.auth_user_id;

        if (isOwner && authUser) {
          const { data: purchasesData } = await supabase
            .from("purchases")
            .select(`
              id, purchased_at, amount_paid,
              prompts(id, title, description, price, cover_image_url, platforms(name), categories(name), average_rating, purchases_count)
            `)
            .eq("user_id", userId)
            .order("purchased_at", { ascending: false });

          setPurchasedPrompts(
            (purchasesData || []).map((pur: any) => ({
              id: String(pur.prompts?.id || pur.id),
              title: pur.prompts?.title || "Untitled",
              price: Number(pur.amount_paid || pur.prompts?.price || 0),
              platform: pur.prompts?.platforms?.name || "AI",
              category: pur.prompts?.categories?.name || "Prompt",
              rating: Number(pur.prompts?.average_rating || 0),
              sales: Number(pur.prompts?.purchases_count || 0),
              image: pur.prompts?.cover_image_url || null,
              purchasedAt: pur.purchased_at,
              status: "owned",
            }))
          );

          // ── 5. Fetch wishlist (owner only) ──
          const { data: wishlistData } = await supabase
            .from("wishlist")
            .select(`
              id, added_at,
              prompts(id, title, description, price, cover_image_url, platforms(name), categories(name), average_rating, purchases_count)
            `)
            .eq("user_id", userId)
            .order("added_at", { ascending: false });

          setWishlistPrompts(
            (wishlistData || []).map((w: any) => ({
              id: String(w.prompts?.id || w.id),
              title: w.prompts?.title || "Untitled",
              price: Number(w.prompts?.price || 0),
              platform: w.prompts?.platforms?.name || "AI",
              category: w.prompts?.categories?.name || "Prompt",
              rating: Number(w.prompts?.average_rating || 0),
              sales: Number(w.prompts?.purchases_count || 0),
              image: w.prompts?.cover_image_url || null,
              addedAt: w.added_at,
              status: "wishlist",
            }))
          );
        }
      } catch (err) {
        console.error("Error loading profile data:", err);
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
          <p className="text-muted-foreground text-sm">The profile you're looking for doesn't exist.</p>
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
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", profile.id)
          .eq("following_id", user.id);

        if (error) throw error;
        setIsFollowing(false);
        setUser({ ...user, followers: Math.max(0, user.followers - 1) });
        toast("Unfollowed");
      } else {
        // Follow
        const { error } = await supabase
          .from("follows")
          .insert({
            follower_id: profile.id,
            following_id: user.id
          });

        if (error) throw error;
        setIsFollowing(true);
        setUser({ ...user, followers: user.followers + 1 });
        toast.success(`✓ Following ${user.name}`);
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
                          <SellerPromptCard key={p.id} prompt={p} />
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
