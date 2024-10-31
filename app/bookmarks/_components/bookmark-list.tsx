'use client'

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import BookmarkPost from './bookmark-post';

export default function BookmarkList({ userId }: { userId: string }) {
  const bookmarkedTweets = useQuery(api.tweets.getBookmarks, { userId });

  console.log('bookmarkedTweets', bookmarkedTweets);

  if (!bookmarkedTweets?.length) {
    return (
      <div className="p-4 text-center text-gray-500 mt-[2rem]">
        No bookmarks yet
      </div>
    );
  }

  return (
    <>
      {bookmarkedTweets?.map((tweet: any) => {
        return (
          <BookmarkPost
            key={tweet._id}
            tweet={tweet}
            userId={userId}
            username={tweet.authorInfo.username}
            avatar={tweet.authorInfo.profileImage}
            name={tweet.authorInfo.name}
            date={tweet._creationTime}
            verified={tweet.authorInfo.verified}
            content={tweet.content}
            image={tweet.images?.[0]}
            imageAlt={`Image from ${tweet.authorInfo.name}'s tweet`}
            comments={tweet.replyCount || 0}
            retweets={tweet.retweetCount || 0}
            likes={tweet.likeCount || 0}
          />
        );
      })}
    </>
  );
}
