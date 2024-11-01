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
    searchable: v.optional(v.string()), // Make it optional
  })
    .index("by_userId", ["userId"])
    .index("by_username", ["username"])
    .index("by_searchable", ["searchable"]), // Add index for search

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
    bookmarkedByUserId: v.string(), // ID of user who bookmarked
    tweetAuthorUserId: v.string(), // ID of user who wrote the tweet
    tweetId: v.id("tweets"), // ID of the bookmarked tweet
    createdAt: v.number(),
  }).index("by_user_tweet", ["bookmarkedByUserId", "tweetId"]),

  notifications: defineTable({
    userId: v.string(), // User who receives the notification
    actorId: v.string(), // User who triggered the notification
    type: v.string(), // notification type: "like", "retweet", "follow", "reply"
    tweetId: v.optional(v.id("tweets")), // Optional: related tweet
    read: v.boolean(), // Whether notification has been read
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_read", ["userId", "read"])
    .index("by_creation", ["createdAt"]),

  conversations: defineTable({
    participantOneId: v.string(), // First user's ID
    participantTwoId: v.string(), // Second user's ID
    lastMessageAt: v.number(), // For sorting conversations
    createdAt: v.number(),
  })
    .index("by_participant_one", ["participantOneId", "lastMessageAt"]) // Find conversations for user one
    .index("by_participant_two", ["participantTwoId", "lastMessageAt"]) // Find conversations for user two
    .index("by_participants", ["participantOneId", "participantTwoId"]), // Find specific conversation between two users

  messages: defineTable({
    conversationId: v.id("conversations"), // Reference to conversations table
    senderId: v.string(), // ID of user who sent the message
    content: v.string(), // Message content
    read: v.boolean(), // Whether message has been read
    createdAt: v.number(), // Timestamp for ordering
  })
    .index("by_conversation", ["conversationId", "createdAt"]) // Get messages for a conversation
    .index("by_unread", ["conversationId", "read"]), // Get unread messages

  follows: defineTable({
    followerId: v.string(), // ID of user who is following
    followingId: v.string(), // ID of user being followed
    createdAt: v.number(),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_both", ["followerId", "followingId"]),
});
