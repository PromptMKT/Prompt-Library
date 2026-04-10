"use server";

import { WishlistService } from "@/lib/services/WishlistService";
import { createClient } from "@/lib/supabase/server";

/**
 * Toggles a prompt in the user's wishlist.
 */
export async function toggleWishlistAction(promptId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "You must be signed in to add to wishlist" };
    }

    const { wishlisted } = await WishlistService.toggleWishlist(user.id, promptId);
    return { success: true, wishlisted };
  } catch (error: any) {
    console.error("Wishlist action error:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
}

/**
 * Checks if a specific prompt is in the authenticated user's wishlist.
 */
export async function isWishlisted(promptId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    return await WishlistService.isWishlisted(user.id, promptId);
  } catch {
    return false;
  }
}

/**
 * Fetches all prompt IDs in the authenticated user's wishlist.
 */
export async function getWishlistedIds() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    return await WishlistService.getWishlistedIds(user.id);
  } catch {
    return [];
  }
}
