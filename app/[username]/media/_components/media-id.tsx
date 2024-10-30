"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, Repeat2, Share, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface PageProps {
  params: {
    mediaId: string;
    username: string;
  }
}

export default function MediaId({ params }: PageProps) {
  const [selectedTweet, setSelectedTweet] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        const tweet = await fetchQuery(api.tweets.getTweet, {
          tweetId: params.mediaId,
          username: params.username
        });

        console.log('tweet', tweet)
        setSelectedTweet(tweet);
      } catch (error) {
        console.error('Error fetching tweet:', error);
      }
    };

    fetchTweet();
  }, [params.mediaId, params.username]);

  return (
    <div className="h-screen w-full flex">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 rounded-full bg-black/50 hover:bg-black/70 w-7 h-7"
        onClick={() => router.back()}
      >
        <X className="h-4 w-4 text-white" />
      </Button>

      {/* Left side - Image */}
      <div className="w-[75%] bg-black relative h-screen flex items-center justify-center">
        {selectedTweet?.images && selectedTweet.images.length > 0 && (
          <div className="relative max-h-screen max-w-full">
            <img
              src={selectedTweet.images[0]}
              alt="Tweet image"
              className="max-h-screen max-w-full h-auto w-auto"
            />
          </div>
        )}
      </div>

      {/* Right side - Tweet content */}
      <div className="w-[25%] bg-white p-4">
        {selectedTweet && (
          <div className="flex flex-col">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className='flex justify-start items-center gap-1'>
                  <Avatar>
                    <AvatarImage src={selectedTweet.user?.profileImage} />
                    <AvatarFallback>
                      {selectedTweet.user?.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start justify-center ml-2">
                    <div className='flex gap-1'>
                      <span className="font-semibold">{selectedTweet.user?.name}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">
                        {formatDistanceToNow(selectedTweet.createdAt)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">@{selectedTweet.user?.username}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-[15px]">{selectedTweet.content}</p>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-6">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>{selectedTweet.replyCount || 0}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Repeat2 className="w-4 h-4" />
                      <span>{selectedTweet.retweetCount || 0}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Heart className="w-4 h-4" />
                      <span>{selectedTweet.likeCount || 0}</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-bold mb-4">Replies</h3>
                  {/* Add replies content */}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}