import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    userId: v.string(),
    email: v.string(),
    createdAt: v.number(),
    // Optional fields
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    link: v.optional(v.string()),
    location: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    bannerImage: v.optional(v.string()),
    profileImageId: v.optional(v.id("_storage")),
    bannerImageId: v.optional(v.id("_storage")),
  }),

  // convex/schema.ts
  tweets: defineTable({
    // Required fields
    userId: v.string(), // ID of user who created tweet
    content: v.string(), // The tweet text
    createdAt: v.number(), // Timestamp

    // Optional fields
    images: v.optional(v.array(v.string())), // Array of image URLs
    imageIds: v.optional(v.array(v.id("_storage"))), // Array of Convex storage IDs

    // Engagement metrics
    likeCount: v.optional(v.number()),
    retweetCount: v.optional(v.number()),
    replyCount: v.optional(v.number()),

    // Reply and thread handling
    parentId: v.optional(v.id("tweets")), // ID of tweet this is replying to
    rootId: v.optional(v.id("tweets")), // ID of the first tweet in thread

    // Additional metadata
    isRetweet: v.optional(v.boolean()),
    isReply: v.optional(v.boolean()),
    isQuote: v.optional(v.boolean()),
    quotedTweetId: v.optional(v.id("tweets")), // For quote tweets

    // Optional location data
    location: v.optional(v.string()),

    // For edited tweets (if you want to support editing)
    editedAt: v.optional(v.number()),
    isEdited: v.optional(v.boolean()),

    // For visibility/moderation
    isHidden: v.optional(v.boolean()),
    visibility: v.optional(v.string()), // "public", "followers", etc.
  }),

  // You might also want related tables:
  likes: defineTable({
    userId: v.string(),
    tweetId: v.id("tweets"),
    createdAt: v.number(),
  }).index("by_user_tweet", ["userId", "tweetId"]),

  retweets: defineTable({
    userId: v.string(),
    tweetId: v.id("tweets"),
    createdAt: v.number(),
  }).index("by_user_tweet", ["userId", "tweetId"]),

  bookmarks: defineTable({
    userId: v.string(),
    tweetId: v.id("tweets"),
    createdAt: v.number(),
  }).index("by_user_tweet", ["userId", "tweetId"]),

  followers: defineTable({
    followerId: v.id("users"),
    followedId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_follower", ["followerId"])
    .index("by_followed", ["followedId"])
    .index("by_both", ["followerId", "followedId"]),
});
