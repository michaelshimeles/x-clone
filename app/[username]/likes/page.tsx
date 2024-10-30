import { api } from '@/convex/_generated/api';
import { auth } from '@clerk/nextjs/server';
import { preloadQuery } from 'convex/nextjs';
import ProfileHeader from '../_components/header';
import UserInfo from '../_components/user-info';

export default async function Likes() {
  const { userId } = await auth()

  const preloadedUserInfo = await preloadQuery(api.user.readUser, {
    userId: userId!
  });

  const preloadedLikes = await preloadQuery(api.tweets.getLikes, {
    userId: userId!
  });

  console.log('preloadedLikes', preloadedLikes._valueJSON)

  return (
    <div className="border-l border-r border-gray-200 min-h-screen w-full">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm mt-3">
        <ProfileHeader />
      </div>

      <main>
        <div className="border-b border-gray-200">
          <UserInfo preloadedUserInfo={preloadedUserInfo} />
        </div>

        {/* Render Liked tweets here */}
      </main>
    </div>
  )
}