import { Suspense } from "react";


import { createServerSupabaseClient } from "@/lib/supabase/server";
import ExploreClient, { ExploreDataset } from "./components/ExploreClient";

export const metadata = {
  title: "Explore Prompts | Prompt Library",
  description: "Browse the best AI prompts for various models and use cases. Find high-quality, professional prompt systems for your next workflow.",
};

async function ExploreDataFetcher() {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: rows, error } = await supabase.from('prompts')
      .select(`*, users!prompts_creator_id_fkey(username), platforms(name), categories(name), subcategories(name)`)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(400);

    if (error) throw error;

    const mappedPrompts = (rows || []).map((row: any) => {
      const userData = row.users || {};
      const sellerName = userData.username || userData.display_name || "Creator";

      const ensureArray = (val: any) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
          try { return JSON.parse(val); } catch(e) { return [val]; }
        }
        return [];
      };

      return {
        id: String(row.id),
        title: row.title || "Untitled Prompt",
        short_description: row.description || "Prompt system that ships outcomes.",
        images: row.cover_image_url ? [row.cover_image_url] : [],
        rating: Number(row.average_rating || 4.8),
        sales: Number(row.purchases_count || 0),
        tags: ensureArray(row.tags),
        seller: sellerName,
        creator_id: row.creator_id || null,
        price: Number(row.price || 0),
        platform: row.platforms?.name || "AI",
        category: row.categories?.name || "Prompt",
        subcategory: row.subcategories?.name,
        output_type: row.output_format,
        difficulty: row.complexity,
        prompt_text: undefined,
        targetAudience: ensureArray(row.target_audience),
        viewsCount: Number(row.views_count || 0),
        createdAt: row.created_at,
      };
    });

    const sellerStats = new Map<string, { prompts: number; sales: number; name: string; score: number }>();
    for (const prompt of mappedPrompts) {
      const cid = prompt.creator_id || "anonymous";
      const current = sellerStats.get(cid) || { prompts: 0, sales: 0, name: prompt.seller || "Creator", score: 0 };
      current.prompts += 1;
      current.sales += Number(prompt.sales || 0);
      if (current.name === "Creator" && prompt.seller !== "Creator") {
        current.name = prompt.seller;
      }
      sellerStats.set(cid, current);
    }

    const topCreators = Array.from(sellerStats.values())
      .map(c => ({ ...c, score: (c.sales * 2) + c.prompts }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    const tagCounts: Record<string, number> = {};
    for (const p of mappedPrompts) {
      for (const t of p.tags || []) {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      }
    }
    const trendingTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(t => t[0]);

    const [allAudiences, allCategories, allPlatforms, allOutputs] = await Promise.all([
      supabase.from('audiences').select('id, name'),
      supabase.from('categories').select('id, name, slug'),
      supabase.from('platforms').select('id, name'),
      supabase.from('outputs').select('id, name, description')
    ]);

    const exploreData = {
      topCreators,
      trendingTags: ["All", ...trendingTags],
      prompts: mappedPrompts,
      audiences: allAudiences.data || [],
      categories: allCategories.data || [],
      platforms: allPlatforms.data || [],
      outputs: allOutputs.data || []
    };

    // 2. Fetch the current user's wishlist IDs if authenticated
    const { data: { user } } = await supabase.auth.getUser();
    let wishIds: string[] = [];
    if (user) {
      const { data: wishData } = await supabase.from('wishlist').select('prompt_id').eq('user_id', user.id);
      wishIds = (wishData || []).map((w: any) => w.prompt_id);
    }
    
    return (
      <ExploreClient 
        initialDataset={exploreData as ExploreDataset} 
        initialWishlistedIds={wishIds} 
      />
    );
  } catch (err) {
    console.error("Error fetching explore data on server:", err);
    // Fallback if data fetching fails
    const emptyDataset: ExploreDataset = {
      topCreators: [],
      trendingTags: ["All"],
      prompts: [],
    };
    return (
      <ExploreClient 
        initialDataset={emptyDataset} 
        initialWishlistedIds={[]} 
      />
    );
  }
}

/**
 * Explore Page (Server Component)
 * This page performs the initial data fetching on the server side (ID 26 alignment).
 */
export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ExploreDataFetcher />
    </Suspense>
  );
}
