import { UserService } from "../services/UserService";

export class UserController {
  /**
   * Get formatted user profile data.
   */
  static async getUserProfileDetails(id: string) {
    try {
      const [profileData, followerCounts, stats] = await Promise.all([
        UserService.getUserProfile(id),
        UserService.getFollowerCounts(id),
        UserService.getUserStats(id)
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
  static async checkPromptAccess(userId: string, promptId: string) {
    return await UserService.checkPurchase(userId, promptId);
  }

  /**
   * Process a prompt purchase action.
   */
  static async processPurchase(userId: string, promptId: string, amount: number) {
    return await UserService.recordPurchase(userId, promptId, amount);
  }

  /**
   * Toggle follow/unfollow status.
   */
  static async toggleFollow(followerId: string, followingId: string, currentState: boolean) {
    if (currentState) {
      return await UserService.unfollowUser(followerId, followingId);
    } else {
      return await UserService.followUser(followerId, followingId);
    }
  }

  /**
   * Check if one user follows another.
   */
  static async checkFollowStatus(followerId: string, followingId: string) {
    return await UserService.isFollowing(followerId, followingId);
  }
}
