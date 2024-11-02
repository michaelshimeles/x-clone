// app/components/tweet-feed.tsx
"use client"

import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { Skeleton } from "@/components/ui/skeleton"
import Tweet from "@/app/[username]/_components/tweet"

interface TweetFeedProps {
  userId: string
}

export function TweetFeed({ userId }: TweetFeedProps) {
  const tweets = useQuery(api.tweets.getFollowingFeed, { userId });

  if (!tweets) {
    return <TweetFeedSkeleton />;
  }

  if (!tweets.length) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className="text-xl font-semibold mb-2">Welcome to your feed!</p>
        <p>When you follow people, you'll see their tweets here.</p>
      </div>
    );
  }

  return (
    <div>
      {tweets.map((tweet) => (
        <div key={tweet._id}
          className="p-4 border-b">
          <Tweet
            tweet={tweet}
            userProfileId={userId!}
            username={tweet.user?.username!}
            currentUserId={userId}
          />
        </div>
      ))}
    </div>
  );
}

function TweetFeedSkeleton() {
  return (
    <div className="space-y-6 p-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex space-x-12 pt-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}