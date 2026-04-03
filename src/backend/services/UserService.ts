import { supabase } from "@/lib/supabase";

export class UserService {
  /**
   * Fetch a user's profile by their ID.
   */
  static async getUserProfile(id: string, client?: any) {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Check if a specific user has purchased a specific prompt.
   */
  static async checkPurchase(userId: string, promptId: string, client?: any) {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from('purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('prompt_id', promptId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  }

  /**
   * Record a new purchase in the database.
   */
  static async recordPurchase(userId: string, promptId: string, amount: number, client?: any) {
    const supabaseClient = client || supabase;
    const { error } = await supabaseClient
      .from('purchases')
      .insert([{
        user_id: userId,
        prompt_id: promptId,
        amount_paid: amount,
        currency: 'USD',
        status: 'completed'
      }]);

    if (error) {
      if (error.code === '23505') { // Already purchased
        return { success: true, message: "Already purchased" };
      }
      throw error;
    }
    return { success: true };
  }

  /**
   * Follow a user.
   */
  static async followUser(followerId: string, followingId: string, client?: any) {
    const supabaseClient = client || supabase;
    const { error } = await supabaseClient
      .from('follows')
      .insert([{ follower_id: followerId, following_id: followingId }]);
    
    if (error && error.code !== '23505') throw error;
    return { success: true };
  }

  /**
   * Unfollow a user.
   */
  static async unfollowUser(followerId: string, followingId: string, client?: any) {
    const supabaseClient = client || supabase;
    const { error } = await supabaseClient
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);
    
    if (error) throw error;
    return { success: true };
  }

  /**
   * Check if a user is following another user.
   */
  static async isFollowing(followerId: string, followingId: string, client?: any) {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();
    
    if (error) throw error;
    return !!data;
  }

  /**
   * Get follower and following counts for a user.
   */
  static async getFollowerCounts(userId: string, client?: any) {
    const supabaseClient = client || supabase;
    const [followers, following] = await Promise.all([
      supabaseClient.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
      supabaseClient.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId)
    ]);

    if (followers.error) throw followers.error;
    if (following.error) throw following.error;

    return {
      followers: followers.count || 0,
      following: following.count || 0
    };
  }

  /**
   * Get real-time aggregated statistics for a user.
   */
  static async getUserStats(userId: string, client?: any) {
    const supabaseClient = client || supabase;
    const { data: prompts, error } = await supabaseClient
      .from('prompts')
      .select('purchases_count, average_rating')
      .eq('creator_id', userId)
      .eq('is_published', true);

    if (error) throw error;

    const totalPrompts = prompts.length;
    const totalSales = prompts.reduce((acc, p) => acc + (p.purchases_count || 0), 0);
    const validRatings = prompts.filter(p => (p.average_rating || 0) > 0);
    const avgRating = validRatings.length > 0
      ? Number((validRatings.reduce((acc, p) => acc + (p.average_rating || 0), 0) / validRatings.length).toFixed(1))
      : 0;

    return {
      total_prompts: totalPrompts,
      total_sales: totalSales,
      average_rating: avgRating
    };
  }
}
