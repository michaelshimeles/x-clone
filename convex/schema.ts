import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    userId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    createdAt: v.number(),
  }),

  tweets: defineTable({
    userId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_creation", ["createdAt"]),

  likes: defineTable({
    userId: v.id("users"),
    tweetId: v.id("tweets"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_tweet", ["tweetId"])
    .index("by_user_and_tweet", ["userId", "tweetId"]),

  retweets: defineTable({
    userId: v.id("users"),
    tweetId: v.id("tweets"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_tweet", ["tweetId"])
    .index("by_user_and_tweet", ["userId", "tweetId"]),

  followers: defineTable({
    followerId: v.id("users"),
    followedId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_follower", ["followerId"])
    .index("by_followed", ["followedId"])
    .index("by_both", ["followerId", "followedId"]),
});
