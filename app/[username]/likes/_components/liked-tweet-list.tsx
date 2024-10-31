// app/components/tweet-list.tsx
'use client'

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import LikedTweet from "../_components/liked-tweet";

export default function LikedTweetList({ currentUserId, userProfileId, userInfo }: any) {

  const tweets = useQuery(api.tweets.getLikes, {
    userId: currentUserId!
  })

  console.log('tweets', tweets)
  console.log('currentUserId', currentUserId)
  console.log('userProfileId', userProfileId)

  if (!tweets?.length) {
    return (
      <div className="p-4 text-center text-gray-500 mt-[2rem]">
        No tweets yet
      </div>
    );
  }

  return (
    <>
      {tweets.map((tweet: any) => (
        <div
          key={tweet._id}
          className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <LikedTweet tweet={tweet} userProfileId={userProfileId} currentUserId={currentUserId} username={userInfo?.username} />
        </div>
      ))}
    </>
  );
}