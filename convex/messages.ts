import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getUploadUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  },
});

export const sendImage = mutation({
  args: {
    storageId: v.id("_storage"),
    userId: v.string(),
    bannerImage: v.boolean(),
    profileImage: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Find the user
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Update the appropriate image field
    if (args.profileImage) {
      await ctx.db.patch(user._id, { profileImageId: args.storageId });
    } else if (args.bannerImage) {
      await ctx.db.patch(user._id, { bannerImageId: args.storageId });
    }

    return user;
  },
});

// Start or get a conversation
// Get or create a conversation between two users
export const getOrCreateConversation = mutation({
  args: {
    participantOneId: v.string(),
    participantTwoId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if conversation already exists (in either direction)
    const existingForward = await ctx.db
      .query("conversations")
      .withIndex("by_participants", (q) =>
        q
          .eq("participantOneId", args.participantOneId)
          .eq("participantTwoId", args.participantTwoId)
      )
      .first();

    if (existingForward) return existingForward;

    const existingReverse = await ctx.db
      .query("conversations")
      .withIndex("by_participants", (q) =>
        q
          .eq("participantOneId", args.participantTwoId)
          .eq("participantTwoId", args.participantOneId)
      )
      .first();

    if (existingReverse) return existingReverse;

    // Create new conversation if none exists
    const conversation = await ctx.db.insert("conversations", {
      participantOneId: args.participantOneId,
      participantTwoId: args.participantTwoId,
      lastMessageAt: Date.now(),
      createdAt: Date.now(),
    });

    return conversation;
  },
});

// Get all conversations for a user
export const getConversations = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get conversations where user is either participant
    const asParticipantOne = await ctx.db
      .query("conversations")
      .withIndex("by_participant_one", (q) =>
        q.eq("participantOneId", args.userId)
      )
      .collect();

    const asParticipantTwo = await ctx.db
      .query("conversations")
      .withIndex("by_participant_two", (q) =>
        q.eq("participantTwoId", args.userId)
      )
      .collect();

    const conversations = [...asParticipantOne, ...asParticipantTwo].sort(
      (a, b) => b.lastMessageAt - a.lastMessageAt
    );

    // Get participant info and last message for each conversation
    return await Promise.all(
      conversations.map(async (conversation) => {
        // Get the other participant's ID
        const otherUserId =
          conversation.participantOneId === args.userId
            ? conversation.participantTwoId
            : conversation.participantOneId;

        // Get the other participant's info and last message
        const [participant, lastMessage] = await Promise.all([
          ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("userId"), otherUserId))
            .first(),
          ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) =>
              q.eq("conversationId", conversation._id)
            )
            .order("desc")
            .first(),
        ]);

        return {
          ...conversation,
          participant,
          lastMessage,
        };
      })
    );
  },
});

// Get messages for a specific conversation
export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("desc")
      .collect();

    return messages;
  },
});

// Send a new message
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify the conversation exists
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Verify sender is part of the conversation
    if (
      conversation.participantOneId !== args.senderId &&
      conversation.participantTwoId !== args.senderId
    ) {
      throw new Error("User is not part of this conversation");
    }

    // Create the message
    const message = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: args.senderId,
      content: args.content,
      read: false,
      createdAt: Date.now(),
    });

    // Update conversation's lastMessageAt
    await ctx.db.patch(args.conversationId, {
      lastMessageAt: Date.now(),
    });

    return message;
  },
});

// Mark messages as read
export const markMessagesAsRead = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_unread", (q) =>
        q.eq("conversationId", args.conversationId).eq("read", false)
      )
      .filter((q) => q.neq(q.field("senderId"), args.userId))
      .collect();

    await Promise.all(
      unreadMessages.map((message) => ctx.db.patch(message._id, { read: true }))
    );

    return true;
  },
});

// Get unread message count
export const getUnreadCount = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all conversations for the user
    const conversations = [
      ...(await ctx.db
        .query("conversations")
        .withIndex("by_participant_one", (q) =>
          q.eq("participantOneId", args.userId)
        )
        .collect()),
      ...(await ctx.db
        .query("conversations")
        .withIndex("by_participant_two", (q) =>
          q.eq("participantTwoId", args.userId)
        )
        .collect()),
    ];

    // Count unread messages in all conversations
    const unreadCounts = await Promise.all(
      conversations.map(async (conversation) => {
        const unread = await ctx.db
          .query("messages")
          .withIndex("by_unread", (q) =>
            q.eq("conversationId", conversation._id).eq("read", false)
          )
          .filter((q) => q.neq(q.field("senderId"), args.userId))
          .collect();

        return unread.length;
      })
    );

    return unreadCounts.reduce((a, b) => a + b, 0);
  },
});
