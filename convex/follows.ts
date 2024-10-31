// Queries and Mutations (in follows.ts)
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Toggle follow status
export const toggleFollow = mutation({
  args: {
    followerId: v.string(),
    followingId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if already following
    const existing = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", args.followerId)
         .eq("followingId", args.followingId)
      )
      .first();

    if (existing) {
      // Unfollow
      await ctx.db.delete(existing._id);
      return false; // Not following
    }

    // Follow
    await ctx.db.insert("follows", {
      followerId: args.followerId,
      followingId: args.followingId,
      createdAt: Date.now(),
    });
    return true; // Following
  },
});

// Check if user is following another user
export const isFollowing = query({
  args: {
    followerId: v.string(),
    followingId: v.string(),
  },
  handler: async (ctx, args) => {
    const follow = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", args.followerId)
         .eq("followingId", args.followingId)
      )
      .first();
    return Boolean(follow);
  },
});

// Get followers of a user
export const getFollowers = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const followers = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) =>
        q.eq("followingId", args.userId)
      )
      .collect();

    // Get user info for each follower
    const followersWithInfo = await Promise.all(
      followers.map(async (follow) => {
        const userInfo = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("userId"), follow.followerId))
          .first();

        return {
          ...follow,
          user: userInfo,
        };
      })
    );

    return followersWithInfo.filter(Boolean);
  },
});

// Get users that a user is following
export const getFollowing = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const following = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) =>
        q.eq("followerId", args.userId)
      )
      .collect();

    // Get user info for each followed user
    const followingWithInfo = await Promise.all(
      following.map(async (follow) => {
        const userInfo = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("userId"), follow.followingId))
          .first();

        return {
          ...follow,
          user: userInfo,
        };
      })
    );

    return followingWithInfo.filter(Boolean);
  },
});

// Get follow counts
export const getFollowCounts = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const [followers, following] = await Promise.all([
      ctx.db
        .query("follows")
        .withIndex("by_following", (q) =>
          q.eq("followingId", args.userId)
        )
        .collect(),
      ctx.db
        .query("follows")
        .withIndex("by_follower", (q) =>
          q.eq("followerId", args.userId)
        )
        .collect(),
    ]);

    return {
      followers: followers.length,
      following: following.length,
    };
  },
});