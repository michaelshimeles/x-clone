// app/components/tweet-list.tsx
'use client'

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Tweet from "@/app/profile/_components/tweet";
import Link from "next/link";

export default function TweetList({ preloadedTweets, userId, userInfo }: any) {
  const tweets = useQuery(api.tweets.getTweets, preloadedTweets?._valueJSON?.userId) || preloadedTweets?._valueJSON;

  if (!tweets?.length) {
    return (
      <div className="p-4 text-center text-gray-500">
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