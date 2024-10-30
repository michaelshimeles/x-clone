import { api } from '@/convex/_generated/api';
import { auth } from '@clerk/nextjs/server';
import { preloadQuery } from 'convex/nextjs';
import ProfileHeader from '../_components/header';
import MediaGrid from '../_components/media-grid';
import UserInfo from '../_components/user-info';

export default async function Media() {
  const { userId } = await auth()

  const preloadedUserInfo: any = await preloadQuery(api.user.readUser, {
    userId: userId!
  });

  const preloadedTweets: any = await preloadQuery(api.tweets.getTweets, {
    userId: userId!
  });

  console.log('preloadedUserInfo', preloadedUserInfo._valueJSON?.username)

  return (
    <div className="border-l border-r border-gray-200 min-h-screen w-full">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm mt-3">
        <ProfileHeader />
      </div>

      <main>
        <div className="border-b border-gray-200">
          <UserInfo preloadedUserInfo={preloadedUserInfo} />
        </div>

        {/* Tweets */}
        <MediaGrid tweets={preloadedTweets._valueJSON} username={preloadedUserInfo._valueJSON?.username} />
      </main>
    </div>
  )
}