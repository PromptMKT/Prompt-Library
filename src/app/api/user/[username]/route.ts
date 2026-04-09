import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  props: { params: Promise<{ username: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    // 1. Fetch Target User
    const { username } = await props.params;
    let targetUsername = username;
    let isMeRoute = targetUsername === "me" || targetUsername === "profile";
    let userData: any = null;

    if (isMeRoute) {
      if (!authUser) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("auth_user_id", authUser.id)
        .single();
      userData = data;
    } else {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", targetUsername)
        .maybeSingle();

      if (error) throw error;
      userData = data;
    }

    if (!userData) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const userId = userData.id;

    // 2. Fetch Network Counts
    const [{ count: followersCount }, { count: followingCount }] = await Promise.all([
      supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", userId),
      supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", userId),
    ]);

    // 3. Format user profile base
    const rawDisplayName = (userData as any).display_name;
    const fallbackName = rawDisplayName || userData.username || userData.email?.split("@")[0] || "User";

    const profileData = {
      id: userId,
      auth_user_id: userData.auth_user_id,
      username: userData.username || targetUsername,
      displayName: rawDisplayName || "",
      name: fallbackName,
      email: userData.email,
      avatar: userData.avatar_url,
      cover_url: userData.cover_url || "",
      bio: userData.bio || "",
      location: userData.location || "",
      website: userData.website || "",
      github: userData.github || "",
      x: userData.x || "",
      linkedin: userData.linkedin || "",
      youtube: userData.youtube || "",
      instagram: userData.instagram || "",
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
    };

    // 4. Check if authenticated user is following this profile
    let isFollowing = false;
    let authProfileId = null;

    if (authUser) {
      const { data: authProfile } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", authUser.id)
        .single();
      
      authProfileId = authProfile?.id;

      if (authProfileId && authProfileId !== userId) {
        const { data: followData } = await supabase
          .from("follows")
          .select("id")
          .eq("follower_id", authProfileId)
          .eq("following_id", userId)
          .single();
        if (followData) {
          isFollowing = true;
        }
      }
    }

    // 5. Fetch Prompts created by target user
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

    const sellerPrompts = (promptsData || []).map((p: any) => ({
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

    // 6. Fetch Reviews on user's prompts
    const promptIds = sellerPrompts.map((p: any) => p.id);
    let reviews: any[] = [];
    if (promptIds.length > 0) {
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select(`
          id, rating, title, body, created_at, is_visible,
          prompt_id, user_id,
          prompts(title, categories(name)),
          users!reviews_user_id_fkey(username, avatar_url)
        `)
        .in("prompt_id", promptIds)
        .eq("is_visible", true)
        .order("created_at", { ascending: false })
        .limit(50);

      reviews = (reviewsData || []).map((r: any) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        body: r.body,
        createdAt: r.created_at,
        promptTitle: r.prompts?.title || "Unknown",
        promptCategory: r.prompts?.categories?.name || "Prompt",
        reviewerName: r.users?.display_name || r.users?.username || "Anonymous",
        reviewerAvatar: r.users?.avatar_url || null,
      }));
    }

    // 7. Secure Ownership checks: Only fetch purchases and wishlist if isOwner
    const isOwner = authProfileId === userId;
    let purchasedPrompts: any[] = [];
    let wishlistPrompts: any[] = [];

    if (isOwner) {
      const { data: purchasesData } = await supabase
        .from("purchases")
        .select(`
          id, purchased_at, amount_paid,
          prompts(id, title, description, price, cover_image_url, platforms(name), categories(name), average_rating, purchases_count)
        `)
        .eq("user_id", userId)
        .order("purchased_at", { ascending: false });

      purchasedPrompts = (purchasesData || []).map((pur: any) => ({
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
      }));

      const { data: wishlistData } = await supabase
        .from("wishlist")
        .select(`
          id, added_at,
          prompts(id, title, description, price, cover_image_url, platforms(name), categories(name), average_rating, purchases_count)
        `)
        .eq("user_id", userId)
        .order("added_at", { ascending: false });

      wishlistPrompts = (wishlistData || []).map((w: any) => ({
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
      }));
    }

    return NextResponse.json({
      success: true,
      data: {
        user: profileData,
        isFollowing,
        isOwner,
        sellerPrompts,
        reviews,
        purchasedPrompts,
        wishlistPrompts,
      }
    });

  } catch (error: any) {
    console.error("Profile API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
