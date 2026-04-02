import { WishlistService } from "../services/WishlistService";

export class WishlistController {
  /**
   * Toggles a prompt in the user's wishlist for the given user ID.
   */
  static async toggleWishlist(userId: string, promptId: string) {
    try {
      if (!userId) {
        throw new Error("User must be signed in to add to wishlist");
      }
      return await WishlistService.toggleWishlist(userId, promptId);
    } catch (error: any) {
      console.error("Wishlist Controller Error (toggleWishlist):", error);
      throw error;
    }
  }

  /**
   * Checks if a specific prompt is in the authenticated user's wishlist.
   */
  static async isWishlisted(userId: string, promptId: string) {
    try {
      if (!userId) return false;
      return await WishlistService.isWishlisted(userId, promptId);
    } catch {
      return false;
    }
  }

  /**
   * Fetches all prompt IDs in the user's wishlist.
   */
  static async getWishlistedIds(userId: string) {
    try {
      if (!userId) return [];
      return await WishlistService.getWishlistedIds(userId);
    } catch {
      return [];
    }
  }
}
