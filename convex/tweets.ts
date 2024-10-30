// convex/tweets.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// convex/tweets.ts
export const createTweet = mutation({
  args: {
    content: v.string(),
    userId: v.string(),
    visibility: v.string(),
    images: v.optional(
      v.object({
        imageUrls: v.array(v.string()),
        imageIds: v.array(v.string()), // or v.array(v.id("_storage")) if using Convex IDs
      })
    ),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    const tweet = await ctx.db.insert("tweets", {
      content: args.content,
      userId: args.userId,
      visibility: args.visibility,
      images: args.images?.imageUrls ?? [],
      createdAt: args.createdAt,
      likeCount: 0,
      retweetCount: 0,
      replyCount: 0,
      isEdited: false,
      isHidden: false,
    });

    return tweet;
  },
});


// Mutation for liking a tweet
export const likeTweet = mutation({
  args: {
    tweetId: v.id("tweets"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if already liked
    const existingLike = await ctx.db
      .query("likes")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("tweetId"), args.tweetId)
        )
      )
      .first();

    if (existingLike) {
      return;
    }

    // Create like record
    await ctx.db.insert("likes", {
      userId: args.userId,
      tweetId: args.tweetId,
      createdAt: Date.now(),
    });

    // Increment like count
    const tweet = await ctx.db.get(args.tweetId);
    await ctx.db.patch(args.tweetId, {
      likeCount: (tweet?.likeCount ?? 0) + 1,
    });
  },
});

// convex/tweets.ts
export const getTweets = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tweets = await ctx.db
      .query("tweets")
      .filter((q) =>
        args.userId ? q.eq(q.field("userId"), args.userId) : true
      )
      .order("desc")
      .collect();

    // Get unique userIds using reduce
    const userIds = tweets
      .map(tweet => tweet.userId)
      .reduce((unique: string[], userId) => {
        return unique.includes(userId) ? unique : [...unique, userId];
      }, []);

    // Fetch user info for all tweets
    const users = await Promise.all(
      userIds.map((userId) =>
        ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("userId"), userId))
          .first()
      )
    );

    // Combine tweet data with user data
    return tweets.map((tweet) => ({
      ...tweet,
      user: users.find((user) => user?.userId === tweet.userId),
    }));
  },
});

// convex/tweets.ts
export const deleteTweet = mutation({
  args: {
    tweetId: v.id("tweets"),
    userId: v.string(), // To verify ownership
  },
  handler: async (ctx, args) => {
    // Find the tweet
    const tweet = await ctx.db.get(args.tweetId);

    // Check if tweet exists
    if (!tweet) {
      throw new Error("Tweet not found");
    }

    // Verify ownership
    if (tweet.userId !== args.userId) {
      throw new Error("Not authorized to delete this tweet");
    }

    // Delete the tweet
    await ctx.db.delete(args.tweetId);

    return { success: true };
  },
});

// convex/tweets.ts
export const getTweet = query({
  args: {
    username: v.string(),
    tweetId: v.string(),
  },
  handler: async (ctx, args) => {
    const tweet = await ctx.db
      .query("tweets")
      .filter((q) => q.eq(q.field("_id"), args.tweetId))
      .order("desc")
      .first();

    if (!tweet) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), args.username))
      .first();

    return {
      ...tweet,
      user,
    };
  },
});