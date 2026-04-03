import { Suspense } from "react";
import { PromptController } from "@/backend/controllers/PromptController";
import { getWishlistedIds } from "@/app/actions/wishlist";
import { createClient } from "@/lib/supabase/server";
import ExploreClient, { ExploreDataset } from "./components/ExploreClient";

export const metadata = {
  title: "Explore Prompts | Prompt Library",
  description: "Browse the best AI prompts for various models and use cases. Find high-quality, professional prompt systems for your next workflow.",
};

async function ExploreDataFetcher() {
  try {
    const supabase = await createClient();
    // 1. Fetch the main explore dataset on the server
    const data = await PromptController.getExplorePageData(supabase);
    
    // 2. Fetch the current user's wishlist IDs if authenticated
    const wishIds = await getWishlistedIds();
    
    return (
      <ExploreClient 
        initialDataset={data as ExploreDataset} 
        initialWishlistedIds={wishIds || []} 
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
