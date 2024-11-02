import PostInput from '@/components/post-input';
import { TweetFeed } from '@/components/tweet-feed';
import { api } from '@/convex/_generated/api';
import { auth } from '@clerk/nextjs/server';
import { preloadQuery } from 'convex/nextjs';

export default async function HomePage() {
  const { userId } = await auth()

  const preloadedUserInfo: any = await preloadQuery(api.user.readUser, {
    userId: userId!
  });

  return (
    <div className="border-l border-r border-gray-200 min-h-screen max-w-6xl w-full">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm mt-3">
        {/* <TabNavigation tabs={["For you", "Following"]} /> */}
      </div>

      {/* Main Content */}
      <main>
        {/* Post Input */}
        <div className="px-4 py-2 border-b border-gray-200">
          <PostInput userInfo={preloadedUserInfo?._valueJSON} />
        </div>

        {/* Tweet Feed */}
        <TweetFeed userId={userId!} />
      </main>
    </div>
  )
}