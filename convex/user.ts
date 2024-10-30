import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    username: v.string(),
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    createdAt: v.number(),
    profileImage: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("Convex createUser called with args:", args);

    try {
      const newUser = await ctx.db.insert("users", {
        username: args.username,
        userId: args.userId,
        email: args.email,
        name: args.name,
        createdAt: args.createdAt,
      });

      console.log("User created successfully:", newUser);
      return newUser;
    } catch (error) {
      console.error("Error in Convex createUser:", error);
      throw error;
    }
  },
});

export const readUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const userInfo = await ctx.db
        .query("users")
        .filter((user) => user.eq(user.field("userId"), args.userId))
        .first();

      return userInfo;
    } catch (error) {
      console.error("Error in Convex readUser:", error);
      throw error;
    }
  },
});

export const updateUser = mutation({
  args: {
    username: v.optional(v.string()),
    userId: v.optional(v.string()),
    email: v.optional(v.string()),
    description: v.optional(v.string()),
    name: v.optional(v.string()),
    link: v.optional(v.string()),
    location: v.optional(v.string()),
    birthday: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    bannerImage: v.optional(v.string()),
    profileImageId: v.optional(v.id("_storage")),
    bannerImageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    console.log("Convex createUser called with args:", args);

    try {
      const userInfo = await ctx.db
        .query("users")
        .filter((user) => user.eq(user.field("userId"), args.userId))
        .first();

      console.log("userInfo", userInfo);
      if (!userInfo) {
        throw new Error("User doesn't exist");
      }

      // Create an updates object with proper type handling
      const updates: Record<string, any> = {};

      if (args.username) updates.username = args.username;
      if (args.userId) updates.userId = args.userId;
      if (args.email) updates.email = args.email;
      if (args.description) updates.description = args.description;
      if (args.name) updates.name = args.name;
      if (args.link) updates.link = args.link;
      if (args.location) updates.location = args.location;

      // Handle image updates with proper type checking
      if (args.profileImageId) {
        updates.profileImageId = args.profileImageId;
        const profileUrl = await ctx.storage.getUrl(args.profileImageId);
        if (profileUrl) updates.profileImage = profileUrl;
      } else if (args.profileImage) {
        updates.profileImage = args.profileImage;
      }

      if (args.bannerImageId) {
        updates.bannerImageId = args.bannerImageId;
        const bannerUrl = await ctx.storage.getUrl(args.bannerImageId);
        if (bannerUrl) updates.bannerImage = bannerUrl;
      } else if (args.bannerImage) {
        updates.bannerImage = args.bannerImage;
      }

      const updateUser = await ctx.db.patch(userInfo._id, updates);

      console.log("User update successfully:", updateUser);

      return updateUser;
    } catch (error) {
      console.error("Error in Convex createUser:", error);
      throw error;
    }
  },
});