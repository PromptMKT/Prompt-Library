import { supabase } from "@/lib/supabase";
import { WishlistController } from "@/backend/controllers/WishlistController";

/**
 * Toggles a prompt in the user's wishlist.
 */
export async function toggleWishlistAction(promptId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "You must be signed in to add to wishlist" };
    }

    const { wishlisted } = await WishlistController.toggleWishlist(user.id, promptId);
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    return await WishlistController.isWishlisted(user.id, promptId);
  } catch {
    return false;
  }
}

/**
 * Fetches all prompt IDs in the authenticated user's wishlist.
 */
export async function getWishlistedIds() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    return await WishlistController.getWishlistedIds(user.id);
  } catch {
    return [];
  }
}

