// File: convex/sampleData.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Sample users data
const sampleUsers = [
  {
    username: "johndoe",
    userId: "user_01",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
  },
  {
    username: "janedoe",
    userId: "user_02",
    email: "jane@example.com",
    firstName: "Jane",
    lastName: "Doe",
  },
  {
    username: "bobsmith",
    userId: "user_03",
    email: "bob@example.com",
    firstName: "Bob",
    lastName: "Smith",
  },
  {
    username: "alicejones",
    userId: "user_04",
    email: "alice@example.com",
    firstName: "Alice",
    lastName: "Jones",
  },
  {
    username: "mikebrown",
    userId: "user_05",
    email: "mike@example.com",
    firstName: "Mike",
    lastName: "Brown",
  }
];

// Sample tweets content
const sampleTweetContents = [
  "Just had an amazing breakthrough with my latest project! 🚀 #coding",
  "Beautiful day for a walk in the park 🌳 #nature",
  "Can't believe how fast this year is going by! Time flies ⏰",
  "New recipe turned out perfect 👨‍🍳 #cooking",
  "Working on something exciting, can't wait to share! 💡",
  "Just finished reading an incredible book 📚 #reading",
  "Morning coffee hits different today ☕️",
  "Big announcement coming soon! Stay tuned! 📢",
  "Learning something new everyday 🎯 #growth",
  "Grateful for this amazing community 🙏 #thankful"
];

export const populateSampleData = mutation({
  args: {},
  handler: async (ctx) => {
    const userIds = [];
    const tweetIds = [];

    // Create users
    for (const userData of sampleUsers) {
      const userId = await ctx.db.insert("users", {
        ...userData,
        createdAt: Date.now(),
      });
      userIds.push(userId);
    }

    // Create tweets
    for (const userId of userIds) {
      // Each user creates 2 random tweets
      for (let i = 0; i < 2; i++) {
        const content = sampleTweetContents[Math.floor(Math.random() * sampleTweetContents.length)];
        const tweetId = await ctx.db.insert("tweets", {
          userId,
          content,
          createdAt: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time within last week
        });
        tweetIds.push(tweetId);
      }
    }

    // Create likes
    for (const userId of userIds) {
      // Each user likes 3 random tweets
      const randomTweets = shuffleArray(tweetIds).slice(0, 3);
      for (const tweetId of randomTweets) {
        await ctx.db.insert("likes", {
          userId,
          tweetId,
          createdAt: Date.now(),
        });
      }
    }

    // Create retweets
    for (const userId of userIds) {
      // Each user retweets 2 random tweets
      const randomTweets = shuffleArray(tweetIds).slice(0, 2);
      for (const tweetId of randomTweets) {
        await ctx.db.insert("retweets", {
          userId,
          tweetId,
          createdAt: Date.now(),
        });
      }
    }

    // Create followers
    for (const userId of userIds) {
      // Each user follows 2-3 random users
      const otherUsers = userIds.filter(id => id !== userId);
      const randomUsers = shuffleArray(otherUsers).slice(0, 2 + Math.floor(Math.random() * 2));
      for (const followedId of randomUsers) {
        await ctx.db.insert("followers", {
          followerId: userId,
          followedId,
          createdAt: Date.now(),
        });
      }
    }

    return {
      usersCreated: userIds.length,
      tweetsCreated: tweetIds.length,
    };
  },
});

// Utility function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// File: convex/testQueries.ts
import { query } from "./_generated/server";

export const getUserWithActivity = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("username"), args.username))
      .first();

    if (!user) return null;

    const tweets = await ctx.db
      .query("tweets")
      .filter(q => q.eq(q.field("userId"), user._id))
      .collect();

    const likes = await ctx.db
      .query("likes")
      .filter(q => q.eq(q.field("userId"), user._id))
      .collect();

    const following = await ctx.db
      .query("followers")
      .filter(q => q.eq(q.field("followerId"), user._id))
      .collect();

    const followers = await ctx.db
      .query("followers")
      .filter(q => q.eq(q.field("followedId"), user._id))
      .collect();

    return {
      user,
      stats: {
        tweets: tweets.length,
        likes: likes.length,
        following: following.length,
        followers: followers.length,
      }
    };
  },
});