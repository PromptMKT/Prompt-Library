import { UserService } from "../services/UserService";

export class UserController {
  /**
   * Get formatted user profile data.
   */
  static async getUserProfileDetails(id: string, client?: any) {
    try {
      const [profileData, followerCounts, stats] = await Promise.all([
        UserService.getUserProfile(id, client),
        UserService.getFollowerCounts(id, client),
        UserService.getUserStats(id, client)
      ]);

      if (!profileData) return null;

      return {
        id: profileData.id,
        username: profileData.username || profileData.display_name || "creator",
        name: profileData.display_name || profileData.username || "Creator",
        avatar: profileData.avatar_url || profileData.avatar || "",
        bio: profileData.bio || "No bio available.",
        total_sales: stats.total_sales,
        average_rating: stats.average_rating,
        total_prompts: stats.total_prompts,
        role: profileData.role === 'buyer' && stats.total_prompts > 0 ? 'creator' : profileData.role,
        followers: followerCounts.followers,
        following: followerCounts.following,
        memberSince: profileData.created_at ? new Date(profileData.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Unknown",
        location: profileData.location || "Global",
        website: profileData.website || "",
        verified: !!profileData.is_verified,
      };
    } catch (error) {
      console.error("Controller Error (getUserProfileDetails):", error);
      throw error;
    }
  }

  /**
   * Check if a user can access a prompt (already purchased).
   */
  static async checkPromptAccess(userId: string, promptId: string, client?: any) {
    return await UserService.checkPurchase(userId, promptId, client);
  }

  /**
   * Process a prompt purchase action.
   */
  static async processPurchase(userId: string, promptId: string, amount: number, client?: any) {
    return await UserService.recordPurchase(userId, promptId, amount, client);
  }

  /**
   * Toggle follow/unfollow status.
   */
  static async toggleFollow(followerId: string, followingId: string, currentState: boolean, client?: any) {
    if (currentState) {
      return await UserService.unfollowUser(followerId, followingId, client);
    } else {
      return await UserService.followUser(followerId, followingId, client);
    }
  }

  /**
   * Check if one user follows another.
   */
  static async checkFollowStatus(followerId: string, followingId: string, client?: any) {
    return await UserService.isFollowing(followerId, followingId, client);
  }
}
