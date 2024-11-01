'use client'

import ReplyButton from "@/components/post/reply-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from '@/convex/_generated/api';
import { useNotification } from "@/utils/notifications";
import { useUser } from "@clerk/nextjs";
import { fetchMutation, fetchQuery } from 'convex/nextjs';
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNow } from 'date-fns';
import { Bookmark, Heart, MessageCircle, Repeat2, Trash, Upload } from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Tweet({ tweet, userProfileId, username, currentUserId }: { tweet: any, userProfileId: string, username: string, currentUserId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const pathname = usePathname();
  const { user } = useUser()
  const { sendNotification } = useNotification()

  // Mutations
  const toggleRetweet = useMutation(api.tweets.toggleRetweet);
  const toggleLike = useMutation(api.tweets.toggleLike);
  const toggleBookmark = useMutation(api.tweets.toggleBookmark);

  // Check if tweet is a retweet
  const isRetweet = tweet.isRetweet;
  const quotedTweet = useQuery(api.tweets.getQuotedTweet,
    isRetweet ? { tweetId: tweet.quotedTweetId } : "skip"
  );

  // Check initial interaction statuses
  useEffect(() => {
    const checkInteractions = async () => {
      // Always check the original tweet's ID for interactions
      const originalTweetId = isRetweet ? tweet.quotedTweetId : tweet._id;

      // Check interactions on both tweets if it's a retweet
      const [retweetStatus, likeStatus, bookmarkStatus] = await Promise.all([
        fetchQuery(api.tweets.isRetweeted, {
          userId: userProfileId,
          tweetId: originalTweetId
        }),
        fetchQuery(api.tweets.isLiked, {
          userId: userProfileId,
          tweetId: originalTweetId
        }),
        fetchQuery(api.tweets.isBookmarked, {
          bookmarkedByUserId: userProfileId,
          tweetId: originalTweetId
        })
      ]);

      setIsRetweeted(retweetStatus);
      setIsLiked(likeStatus);
      setIsBookmarked(bookmarkStatus);
    };
    checkInteractions();
  }, [userProfileId, tweet._id, tweet.quotedTweetId, isRetweet]);

  // Update the handleBookmark function
  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const originalTweetId = isRetweet ? tweet.quotedTweetId : tweet._id;
      const originalTweet = isRetweet ? quotedTweet : tweet;

      console.log('originalTweet', originalTweet)
      console.log('bookmarkedByUserId', userProfileId)

      const status = await toggleBookmark({
        bookmarkedByUserId: user?.id!,
        tweetAuthorUserId: originalTweet.userId,
        tweetId: originalTweetId
      });

      setIsBookmarked(status);
      toast.success(status ? "Added to Bookmarks" : "Removed from Bookmarks");
    } catch (error) {
      toast.error("Failed to bookmark tweet");
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await fetchMutation(api.tweets.deleteTweet, {
        tweetId: tweet._id,
        userId: userProfileId
      });
      toast.success("Tweet deleted successfully");
    } catch (error) {
      console.error("Failed to delete tweet:", error);
      toast.error("Failed to delete tweet");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRetweet = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const status = await toggleRetweet({
        userId: currentUserId,
        tweetId: isRetweet ? tweet.quotedTweetId : tweet._id
      });
      setIsRetweeted(status);
      toast.success(status ? "Retweeted" : "Removed Retweet");
    } catch (error) {
      toast.error("Failed to retweet");
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // Always use original tweet ID
      const originalTweetId = isRetweet ? tweet.quotedTweetId : tweet._id;
      const status = await toggleLike({
        userId: currentUserId,
        tweetId: originalTweetId
      });
      console.log('status', status)
      setIsLiked(status);
      if (status) {
        await sendNotification({
          userId: tweet.userId,      // The tweet author who will receive the notification
          actorId: currentUserId,    // You (the current user) who performed the like action
          type: "like",
          tweetId: tweet._id
        })
      }
    } catch (error) {
      toast.error("Failed to like tweet");
    }
  };


  const handleDropdownClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const isOwner = tweet.userId === userProfileId;
  const displayTweet = isRetweet ? quotedTweet : tweet;

  const isLoading = !displayTweet?.user;

  if (isLoading) {
    return <TweetSkeleton />;
  }


  return (
    <Link href={`${displayTweet?.user?.username}/${tweet?._id}`} key={tweet._id}>
      {isRetweet && (
        <div className="flex items-center gap-2 mb-2 pl-12 text-gray-500 text-sm">
          <Repeat2 className="w-4 h-4" />
          {currentUserId === userProfileId ? <span>You reposted</span> : <span>{username} reposted</span>}
        </div>
      )}
      <div className="w-full mx-auto font-sans">
        <div className="">
          <div className="flex items-start space-x-3">
            <img
              src={displayTweet?.user?.profileImage}
              alt="Profile picture"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <span className="font-bold text-[15px]">{displayTweet?.user?.name}</span>
                {displayTweet?.user?.verified && (
                  <svg className="w-4 h-4 text-blue-400 fill-current" viewBox="0 0 24 24">
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                  </svg>
                )}
                <span className="text-gray-500 text-[15px]">
                  @{displayTweet?.user?.username} · {displayTweet?._creationTime && formatDistanceToNow(displayTweet._creationTime)}
                </span>
              </div>
              <p className="mt-1 text-[15px] leading-normal">{displayTweet?.content}</p>
              {displayTweet?.images?.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {displayTweet.images.map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image?.split(":")[1]}
                      alt={`Tweet image ${index + 1}`}
                      className="rounded-lg object-cover w-full"
                    />
                  ))}
                </div>
              )}
              <div className="mt-3 flex items-center justify-between text-gray-500">
                <div className="flex items-center space-x-4">
                  <button
                    className="flex items-center space-x-1 group"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <MessageCircle className="w-5 h-5 group-hover:text-blue-500" />
                    <span className="text-xs group-hover:text-blue-500">{0}</span>
                  </button>
                  <button
                    className="flex items-center space-x-1 group"
                    onClick={handleRetweet}
                  >
                    <Repeat2 className={`w-5 h-5 ${displayTweet?.retweetCount > 0 && isRetweeted && currentUserId === userProfileId ? 'fill text-green-500' : 'group-hover:text-green-500'}`} />
                    <span className={`text-xs ${displayTweet?.retweetCount > 0 && isRetweeted && currentUserId === userProfileId ? 'text-green-500' : 'group-hover:text-green-500'}`}>
                      {displayTweet?.retweetCount || 0}
                    </span>
                  </button>
                  <button
                    className="flex items-center space-x-1 group"
                    onClick={handleLike}
                  >
                    <Heart
                      className={`w-5 h-5 ${isLiked ? 'fill-current text-pink-500' : 'group-hover:text-pink-500'}`}
                    />
                    <span className={`text-xs ${isLiked ? 'text-pink-500' : 'group-hover:text-pink-500'}`}>
                      {displayTweet?.likeCount || 0}
                    </span>
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <button onClick={handleBookmark}>
                    <Bookmark
                      className={`w-5 h-5 ${isBookmarked ? 'fill-current text-blue-500' : 'hover:text-blue-500'}`}
                    />
                  </button>
                  <button>
                    <Upload
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_FRONTEND_URL}${pathname}/${tweet._id}`);
                        toast.success("Copied tweet URL");
                      }}
                      className="w-5 h-5 hover:text-blue-500"
                    />
                  </button>
                </div>
              </div>
            </div>
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger onClick={handleDropdownClick} asChild>
                  <button className="text-gray-500 hover:text-gray-300">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g>
                    </svg>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    {isDeleting ? "Deleting..." : "Delete Tweet"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

const TweetSkeleton = () => {
  return (
    <div className="w-full mx-auto font-sans">
      <div className="flex items-start space-x-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-3/4 mt-2" />
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-12">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
