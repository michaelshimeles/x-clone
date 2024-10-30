// app/components/tweet-list.tsx
'use client'

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import BookmarkPost from './bookmark-post';

export default function BookmarkList({ userId }: any) {
  const tweets = useQuery(api.tweets.getBookmarks, { userId })

  console.log('tweets', tweets)
  if (!tweets?.length) {
    return (
      <div className="p-4 text-center text-gray-500 mt-[2rem]">
        No bookmarks yet
      </div>
    );
  }

  console.log('tweets', tweets)
  return (
    <>
      {tweets?.map((bookmark: any, index: number) => {
        return (
          <BookmarkPost
            key={index}
            avatar={bookmark?.userInfo?.profileImage}
            name={bookmark?.userInfo?.name}
            username={bookmark?.userInfo?.username}
            date={bookmark?.tweetData?.[0]?.createdAt}
            verified={true}
            content={bookmark?.tweetData?.[0]?.content}
            image={bookmark?.tweetData?.[0]?.images?.[0]}
            imageAlt="Example of shadcn/ui customization"
            comments={bookmark?.tweetData?.[0]?.replyCount}
            retweets={bookmark?.tweetData?.[0]?.retweetCount}
            likes={bookmark?.tweetData?.[0]?.likeCount}
            tweet={bookmark?.tweetData?.[0]}
            userId={userId!}
          />
        )
      })}
    </>
  );
}