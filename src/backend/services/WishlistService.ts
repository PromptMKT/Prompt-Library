import { supabase } from "@/lib/supabase";

export class WishlistService {
  /**
   * Toggles a prompt in the user's wishlist.
   */
  static async toggleWishlist(userId: string, promptId: string) {
    const { data: existing, error: checkError } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', userId)
      .eq('prompt_id', promptId)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existing) {
      const { error: deleteError } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', existing.id);

      if (deleteError) throw deleteError;
      return { wishlisted: false };
    } else {
      const { error: insertError } = await supabase
        .from('wishlist')
        .insert({
          user_id: userId,
          prompt_id: promptId
        });

      if (insertError) throw insertError;
      return { wishlisted: true };
    }
  }

  /**
   * Checks if a prompt is in the user's wishlist.
   */
  static async isWishlisted(userId: string, promptId: string) {
    const { data, error } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', userId)
      .eq('prompt_id', promptId)
      .maybeSingle();

    if (error) return false;
    return !!data;
  }

  /**
   * Fetches all wishlisted prompt IDs for a user.
   */
  static async getWishlistedIds(userId: string) {
    const { data, error } = await supabase
      .from('wishlist')
      .select('prompt_id')
      .eq('user_id', userId);

    if (error) return [];
    return data.map(item => item.prompt_id);
  }
}
