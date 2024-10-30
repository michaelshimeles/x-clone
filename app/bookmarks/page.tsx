import { api } from '@/convex/_generated/api';
import { auth } from '@clerk/nextjs/server';
import { preloadQuery } from 'convex/nextjs';
import { Search } from 'lucide-react';
import BackButton from './_components/back-button';
import BookmarkPost from './_components/bookmark-post';

interface BookmarkPostProps {
  avatar: string
  name: string
  handle: string
  date: string
  verified: boolean
  content: string
  image?: string
  imageAlt?: string
  comments?: string
  retweets?: string
  likes?: string
  views?: string
}

export default async function Bookmark() {
  const { userId } = await auth()

  console.log('userId', userId)

  const preloadedBookmark: any = await preloadQuery(api.tweets.getBookmarks, {
    userId: userId!
  });

  console.log('preloadedBookmark', preloadedBookmark?._valueJSON?.[0]?.tweetData?.[0])
  return (
    <div className="w-full bg-white min-h-screen border-r border-l">
      <BackButton />

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Bookmarks"
            className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full"
          />
        </div>
      </div>

      <div className="space-y-4">
        {preloadedBookmark?._valueJSON?.map((bookmark: any, index: number) => {
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
      </div>
    </div>
  )
}
