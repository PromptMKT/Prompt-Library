"use client";

import { supabase } from "@/lib/supabase";

/**
 * Toggles a prompt in the user's wishlist.
 * If the prompt is already in the wishlist, it removes it.
 * If it's not, it adds it.
 * Returns the new wishlisted state.
 */
export async function toggleWishlistAction(promptId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "You must be signed in to add to wishlist" };
    }

    // Check if it's already wishlisted
    const { data: existing, error: checkError } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('prompt_id', promptId)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existing) {
      // Remove it
      const { error: deleteError } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', existing.id);

      if (deleteError) throw deleteError;
      return { success: true, wishlisted: false };
    } else {
      // Add it
      const { error: insertError } = await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          prompt_id: promptId
        });

      if (insertError) throw insertError;
      return { success: true, wishlisted: true };
    }
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

    const { data, error } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('prompt_id', promptId)
      .maybeSingle();

    if (error) return false;
    return !!data;
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

    const { data, error } = await supabase
      .from('wishlist')
      .select('prompt_id')
      .eq('user_id', user.id);

    if (error) return [];
    return data.map(item => item.prompt_id);
  } catch {
    return [];
  }
}
