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
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const tweets = await ctx.db
      .query("tweets")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();

    // Get unique userIds using reduce
    const userIds = tweets
      .map((tweet) => tweet.userId)
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

export const toggleBookmark = mutation({
  args: {
    userId: v.string(),
    tweetId: v.id("tweets"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_tweet", (q) =>
        q.eq("userId", args.userId).eq("tweetId", args.tweetId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false; // Not bookmarked
    }

    await ctx.db.insert("bookmarks", {
      userId: args.userId,
      tweetId: args.tweetId,
      createdAt: Date.now(),
    });
    return true; // Bookmarked
  },
});

export const isBookmarked = query({
  args: {
    userId: v.string(),
    tweetId: v.id("tweets"),
  },
  handler: async (ctx, args) => {
    const bookmark = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_tweet", (q) =>
        q.eq("userId", args.userId).eq("tweetId", args.tweetId)
      )
      .first();
    return Boolean(bookmark);
  },
});

// Mutation
export const toggleLike = mutation({
  args: {
    userId: v.string(),
    tweetId: v.id("tweets"),
  },
  handler: async (ctx, args) => {
    // Find all retweets of this tweet
    const relatedTweets = await ctx.db
      .query("tweets")
      .filter((q) =>
        q.or(
          q.eq(q.field("_id"), args.tweetId),
          q.eq(q.field("quotedTweetId"), args.tweetId)
        )
      )
      .collect();

    const tweetIds = relatedTweets.map((t) => t._id);

    const existing = await ctx.db
      .query("likes")
      .withIndex("by_user_tweet", (q) =>
        q.eq("userId", args.userId).eq("tweetId", args.tweetId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      // Update like count for all related tweets
      for (const tweetId of tweetIds) {
        const tweet = await ctx.db.get(tweetId);
        await ctx.db.patch(tweetId, {
          likeCount: (tweet?.likeCount || 1) - 1,
        });
      }
      return false;
    }

    await ctx.db.insert("likes", {
      userId: args.userId,
      tweetId: args.tweetId,
      createdAt: Date.now(),
    });

    // Update like count for all related tweets
    for (const tweetId of tweetIds) {
      const tweet = await ctx.db.get(tweetId);
      await ctx.db.patch(tweetId, {
        likeCount: (tweet?.likeCount || 0) + 1,
      });
    }

    return true;
  },
});
// Query
export const isLiked = query({
  args: {
    userId: v.string(),
    tweetId: v.id("tweets"),
  },
  handler: async (ctx, args) => {
    const like = await ctx.db
      .query("likes")
      .withIndex("by_user_tweet", (q) =>
        q.eq("userId", args.userId).eq("tweetId", args.tweetId)
      )
      .first();
    return Boolean(like);
  },
});

export const getLikes = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_user_tweet", (q) => q.eq("userId", args.userId))
      .collect();
    return likes;
  },
});

// Mutation
export const toggleRetweet = mutation({
  args: {
    userId: v.string(),
    tweetId: v.id("tweets"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("retweets")
      .withIndex("by_user_tweet", (q) =>
        q.eq("userId", args.userId).eq("tweetId", args.tweetId)
      )
      .first();

    if (existing) {
      // Remove retweet
      await ctx.db.delete(existing._id);
      // Delete the retweet tweet
      const retweet = await ctx.db
        .query("tweets")
        .filter((q) =>
          q.and(
            q.eq(q.field("userId"), args.userId),
            q.eq(q.field("isRetweet"), true),
            q.eq(q.field("quotedTweetId"), args.tweetId)
          )
        )
        .first();
      if (retweet) {
        await ctx.db.delete(retweet._id);
      }
      // Update count
      const tweet = await ctx.db.get(args.tweetId);
      await ctx.db.patch(args.tweetId, {
        retweetCount: (tweet?.retweetCount || 1) - 1,
      });
      return false;
    }

    // Create retweet record
    await ctx.db.insert("retweets", {
      userId: args.userId,
      tweetId: args.tweetId,
      createdAt: Date.now(),
    });

    // Get original tweet
    const originalTweet = await ctx.db.get(args.tweetId);

    // Create new tweet as retweet
    await ctx.db.insert("tweets", {
      userId: args.userId,
      content: originalTweet?.content || "",
      createdAt: Date.now(),
      isRetweet: true,
      images: originalTweet?.images,
      imageIds: originalTweet?.imageIds,
      quotedTweetId: args.tweetId,
      visibility: originalTweet?.visibility,
    });

    // Update count
    await ctx.db.patch(args.tweetId, {
      retweetCount: (originalTweet?.retweetCount || 0) + 1,
    });

    return true;
  },
});

// Query
export const isRetweeted = query({
  args: {
    userId: v.string(),
    tweetId: v.id("tweets"),
  },
  handler: async (ctx, args) => {
    const retweet = await ctx.db
      .query("retweets")
      .withIndex("by_user_tweet", (q) =>
        q.eq("userId", args.userId).eq("tweetId", args.tweetId)
      )
      .first();
    return Boolean(retweet);
  },
});

export const getQuotedTweet = query({
  args: { tweetId: v.id("tweets") },
  handler: async (ctx, args) => {
    const tweet = await ctx.db.get(args.tweetId);
    if (!tweet) return null;

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), tweet.userId))
      .first();

    return {
      ...tweet,
      user,
    };
  },
});

export const getBookmarks = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const tweetIds = await ctx.db
      .query("bookmarks")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();

    console.log("tweetIds", tweetIds);

    // Use Promise.all to resolve all promises and .flat() to flatten the array
    const tweets = (
      await Promise.all(
        tweetIds.map(async (id) => {
          const tweetData = await ctx.db
            .query("tweets")
            .filter((q) => q.eq(q.field("_id"), id.tweetId))
            .order("desc")
            .collect();

          const userInfo = await ctx.db
            .query("users")
            .filter((user) => user.eq(user.field("userId"), id.userId))
            .first();

          return {
            tweetData,
            userInfo,
          };
        })
      )
    ).flat();

    return tweets;
  },
});
