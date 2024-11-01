import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const createNotification = mutation({
  args: {
    userId: v.string(),
    actorId: v.string(),
    type: v.string(),
    tweetId: v.optional(v.id("tweets")),
  },
  handler: async (ctx, args) => {
    // Don't create notification if user is acting on their own content
    if (args.userId === args.actorId) return null;

    const notification = await ctx.db.insert("notifications", {
      userId: args.userId,
      actorId: args.actorId,
      type: args.type,
      tweetId: args.tweetId,
      read: false,
      createdAt: Date.now(),
    });

    return notification;
  },
});

export const getNotifications = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit ?? 50);

    // Get all unique actor IDs using Array.from instead of spread
    const actorIds = Array.from(
      new Set(notifications.map((n) => n.actorId))
    );

    // Get all users in one query
    const users = await Promise.all(
      actorIds.map((actorId) =>
        ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("userId"), actorId))
          .first()
      )
    );

    // Get all tweet IDs
    const tweetIds = notifications
      .map((n) => n.tweetId)
      .filter((id): id is Id<"tweets"> => id !== undefined);

    // Get all tweets in one query
    const tweets = await Promise.all(
      tweetIds.map((tweetId) =>
        ctx.db
          .query("tweets")
          .filter((q) => q.eq(q.field("_id"), tweetId))
          .first()
      )
    );

    // Map users and tweets to notifications
    return notifications.map((notification) => ({
      ...notification,
      actor: users.find((user) => user?.userId === notification.actorId),
      tweet: notification.tweetId
        ? tweets.find((tweet) => tweet?._id === notification.tweetId)
        : null,
    }));
  },
});

export const markNotificationsAsRead = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_read", (q) =>
        q.eq("userId", args.userId).eq("read", false)
      )
      .collect();

    await Promise.all(
      notifications.map((notification) =>
        ctx.db.patch(notification._id, { read: true })
      )
    );

    return true;
  },
});

export const getUnreadCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_read", (q) =>
        q.eq("userId", args.userId).eq("read", false)
      )
      .collect();

    return unreadNotifications.length;
  },
});

export const subscribeToNotifications = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(50);

    // Use Array.from for Set conversion
    const actorIds = Array.from(
      new Set(notifications.map((n) => n.actorId))
    );

    const users = await Promise.all(
      actorIds.map((actorId) =>
        ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("userId"), actorId))
          .first()
      )
    );

    const tweetIds = notifications
      .map((n) => n.tweetId)
      .filter((id): id is Id<"tweets"> => id !== undefined);

    const tweets = await Promise.all(
      tweetIds.map((tweetId) =>
        ctx.db
          .query("tweets")
          .filter((q) => q.eq(q.field("_id"), tweetId))
          .first()
      )
    );

    return notifications.map((notification) => ({
      ...notification,
      actor: users.find((user) => user?.userId === notification.actorId),
      tweet: notification.tweetId
        ? tweets.find((tweet) => tweet?._id === notification.tweetId)
        : null,
    }));
  },
});