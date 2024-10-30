// app/components/tweet-list.tsx
'use client'

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Tweet from "./tweet";

export default function TweetList({ preloadedTweets, userId, userInfo }: any) {
  console.log('userId', userId)
  console.log('preloadedTweets?._valueJSON', preloadedTweets?._valueJSON)
  const tweets = useQuery(api.tweets.getTweets, { userId })

  console.log('tweets', tweets)
  if (!tweets?.length) {
    return (
      <div className="p-4 text-center text-gray-500 mt-[2rem]">
        No tweets yet
      </div>
    );
  }

  console.log('tweets', tweets)
  return (
    <>
      {tweets.map((tweet: any) => (
        <div
          key={tweet._id}
          className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Tweet tweet={tweet} userId={userId} username={userInfo?.username} />
        </div>
      ))}
    </>
  );
}