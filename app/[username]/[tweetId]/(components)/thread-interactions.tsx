// app/(components)/thread-interactions.tsx
'use client'

import { api } from "@/convex/_generated/api"
import { useNotification } from "@/utils/notifications"
import { useUser } from "@clerk/nextjs"
import { fetchQuery } from "convex/nextjs"
import { useMutation } from "convex/react"
import { BarChart2, Bookmark, Heart, MessageCircle, Repeat2, Share } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface ThreadInteractionsProps {
  tweet: any
  userId: string
}

export default function ThreadInteractions({ tweet, userId }: ThreadInteractionsProps) {
  const [isRetweeted, setIsRetweeted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [retweetCount, setRetweetCount] = useState(tweet?.retweetCount || 0)
  const [likeCount, setLikeCount] = useState(tweet?.likeCount || 0)
  const [bookmarkCount, setBookmarkCount] = useState(tweet?.bookmarkCount || 0)
  const { user } = useUser()
  const { sendNotification } = useNotification()

  // Mutations
  const toggleRetweet = useMutation(api.tweets.toggleRetweet)
  const toggleLike = useMutation(api.tweets.toggleLike)
  const toggleBookmark = useMutation(api.tweets.toggleBookmark)

  // Check initial interaction statuses
  useEffect(() => {
    const checkInteractions = async () => {
      const [retweetStatus, likeStatus, bookmarkStatus] = await Promise.all([
        fetchQuery(api.tweets.isRetweeted, {
          userId,
          tweetId: tweet._id
        }),
        fetchQuery(api.tweets.isLiked, {
          userId,
          tweetId: tweet._id
        }),
        fetchQuery(api.tweets.isBookmarked, {
          bookmarkedByUserId: userId,
          tweetId: tweet._id
        })
      ])

      setIsRetweeted(retweetStatus)
      setIsLiked(likeStatus)
      setIsBookmarked(bookmarkStatus)
    }

    if (tweet && userId) {
      checkInteractions()
      // Update local counts from tweet
      setRetweetCount(tweet.retweetCount || 0)
      setLikeCount(tweet.likeCount || 0)
      setBookmarkCount(tweet.bookmarkCount || 0)
    }
  }, [tweet, userId])

  const handleRetweet = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const status = await toggleRetweet({
        userId,
        tweetId: tweet._id
      })
      setIsRetweeted(status)
      // Update retweet count immediately
      setRetweetCount((prev: any) => status ? prev + 1 : prev - 1)
      if (status) {
        await sendNotification({
          userId: tweet.userId,      // The tweet author who will receive the notification
          actorId: userId,    // You (the current user) who performed the like action
          type: "retweet",
          tweetId: tweet._id
        })

      }
      toast.success(status ? "Retweeted" : "Removed Retweet")
    } catch (error) {
      toast.error("Failed to retweet")
    }
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const status = await toggleLike({
        userId,
        tweetId: tweet._id
      })

      setIsLiked(status)
      // Update like count immediately
      setLikeCount((prev: any) => status ? prev + 1 : prev - 1)
      if (status) {
        await sendNotification({
          userId: tweet.userId,      // The tweet author who will receive the notification
          actorId: userId,    // You (the current user) who performed the like action
          type: "like",
          tweetId: tweet._id
        })
      }

    } catch (error) {
      toast.error("Failed to like tweet")
    }
  }

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const status = await toggleBookmark({
        bookmarkedByUserId: user?.id!,
        tweetAuthorUserId: tweet.userId,
        tweetId: tweet._id
      })
      setIsBookmarked(status)
      // Update bookmark count immediately
      setBookmarkCount((prev: any) => status ? prev + 1 : prev - 1)

      toast.success(status ? "Added to Bookmarks" : "Removed from Bookmarks")
    } catch (error) {
      toast.error("Failed to bookmark tweet")
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${tweet.user.username}/${tweet._id}`
      )
      toast.success("Tweet URL copied to clipboard")
    } catch (error) {
      toast.error("Failed to copy URL")
    }
  }

  return (
    <>
      <div className="mt-3 flex items-center justify-between border-y py-3 w-full">
        {/* Reply Button */}
        <button className="flex items-center space-x-1 group">
          <MessageCircle className="w-5 h-5 group-hover:text-blue-500" />
          <span className="text-xs group-hover:text-blue-500">
            {tweet?.replyCount || 0}
          </span>
        </button>

        {/* Retweet Button */}
        <button
          className="flex items-center space-x-1 group"
          onClick={handleRetweet}
        >
          <Repeat2
            className={`w-5 h-5 ${retweetCount > 0 && isRetweeted
              ? 'fill text-green-500'
              : 'group-hover:text-green-500'
              }`}
          />
          <span className={`text-xs ${retweetCount > 0 && isRetweeted
            ? 'text-green-500'
            : 'group-hover:text-green-500'
            }`}>
            {retweetCount}
          </span>
        </button>

        {/* Like Button */}
        <button
          className="flex items-center space-x-1 group"
          onClick={handleLike}
        >
          <Heart
            className={`w-5 h-5 ${isLiked
              ? 'fill-current text-pink-500'
              : 'group-hover:text-pink-500'
              }`}
          />
          <span className={`text-xs ${isLiked
            ? 'text-pink-500'
            : 'group-hover:text-pink-500'
            }`}>
            {likeCount}
          </span>
        </button>

        {/* Bookmark and Share Section */}
        <div className="flex items-center space-x-4">
          <button onClick={handleBookmark}>
            <Bookmark
              className={`w-5 h-5 ${isBookmarked
                ? 'fill-current text-blue-500'
                : 'hover:text-blue-500'
                }`}
            />
          </button>
          <button onClick={handleShare}>
            <Share className="w-5 h-5 hover:text-blue-500" />
          </button>
        </div>
      </div>
    </>
  )
}