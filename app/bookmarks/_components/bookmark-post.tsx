'use client'

import { api } from "@/convex/_generated/api"
import { fetchQuery } from "convex/nextjs"
import { useMutation, useQuery } from "convex/react"
import { formatDistanceToNow } from "date-fns"
import { Bookmark, Heart, MessageCircle, Repeat2, Upload } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function Component({
  tweet,
  userId,
  username,
  avatar,
  name,
  date,
  verified,
  content,
  image,
  imageAlt,
  comments = 0,
  retweets = 0,
  likes = 0,
}: {
  tweet: any
  userId: string
  username: string
  avatar: string
  name: string
  date: number
  verified?: boolean
  content: string
  image?: string
  imageAlt?: string
  comments?: number
  retweets?: number
  likes?: number
}) {
  const [isRetweeted, setIsRetweeted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const toggleRetweet = useMutation(api.tweets.toggleRetweet);
  const toggleLike = useMutation(api.tweets.toggleLike);
  const toggleBookmark = useMutation(api.tweets.toggleBookmark);

  // Check if tweet is a retweet
  const isRetweet = tweet.isRetweet;
  const quotedTweet = useQuery(api.tweets.getQuotedTweet,
    isRetweet ? { tweetId: tweet.quotedTweetId } : "skip"
  );

  useEffect(() => {
    const checkInteractions = async () => {
      // Always check the original tweet's ID for interactions
      const originalTweetId = isRetweet ? tweet.quotedTweetId : tweet._id;

      // Check interactions on both tweets if it's a retweet
      const [retweetStatus, likeStatus, bookmarkStatus] = await Promise.all([
        fetchQuery(api.tweets.isRetweeted, {
          userId,
          tweetId: originalTweetId
        }),
        fetchQuery(api.tweets.isLiked, {
          userId,
          tweetId: originalTweetId
        }),
        fetchQuery(api.tweets.isBookmarked, {
          userId,
          tweetId: originalTweetId
        })
      ]);

      setIsRetweeted(retweetStatus);
      setIsLiked(likeStatus);
    };
    checkInteractions();
  }, [userId, tweet._id, tweet.quotedTweetId, isRetweet]);

  const handleRetweet = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const status = await toggleRetweet({
        userId,
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
        userId,
        tweetId: originalTweetId
      });
      console.log('status', status)
      setIsLiked(status);
    } catch (error) {
      toast.error("Failed to like tweet");
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const status = await toggleBookmark({
        userId,
        tweetId: tweet._id
      });

      console.log('status', status)
      toast.success("Removed from Bookmarks");
    } catch (error) {
      toast.error("Failed to bookmark tweet");
    }
  }

  return (
    <Link href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${username}/${tweet?._id}`}>
      <div className="w-full mx-auto font-sans border-b p-4">
        <div className="flex items-start space-x-3">
          <img
            src={avatar}
            alt={`${name}'s avatar`}
            width={48}
            height={48}
            className="rounded-full"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1">
              <span className="font-bold text-[15px]">{name}</span>
              {verified && (
                <svg className="w-4 h-4 text-blue-400 fill-current" viewBox="0 0 24 24">
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                </svg>
              )}
              <span className="text-gray-500 text-[15px]">
                @{username} · {formatDistanceToNow(date)}
              </span>
            </div>
            <p className="mt-1 text-[15px] leading-normal">{content}</p>
            {image && (
              <img
                src={image}
                alt={imageAlt}
                className="mt-3 rounded-lg object-cover w-full"
              />
            )}
            <div className="mt-3 flex items-center justify-between text-gray-500">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 group">
                  <MessageCircle className="w-5 h-5 group-hover:text-blue-500" />
                  <span className="text-xs group-hover:text-blue-500">{comments}</span>
                </button>
                <button
                  className="flex items-center space-x-1 group"
                  onClick={handleRetweet}
                >
                  <Repeat2 className={`w-5 h-5 ${isRetweeted ? 'fill-current text-green-500' : 'group-hover:text-green-500'}`} />
                  <span className={`text-xs ${isRetweeted ? 'text-green-500' : 'group-hover:text-green-500'}`}>
                    {retweets}
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
                    {likes}
                  </span>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={handleBookmark}>
                  <Bookmark
                    className={`w-5 h-5 fill-current text-blue-500`}
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${username}/${tweet._id}`)
                    toast.success("Copied tweet URL")
                  }}
                >
                  <Upload className="w-5 h-5 hover:text-blue-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}