

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getUploadUrl = mutation({
  args: {
    storageId: v.id("_storage")
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  }
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
