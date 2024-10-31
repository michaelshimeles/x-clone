import { api } from '@/convex/_generated/api';
import { auth } from '@clerk/nextjs/server';
import { preloadQuery } from 'convex/nextjs';
import ProfileHeader from './_components/header';
import TweetList from './_components/tweet-list';
import UserInfo from './_components/user-info';

// app/profile/page.tsx
export default async function Profile({ params }: { params: Promise<{ username: string }> }) {
  const { userId } = await auth()

  const preloadedUserInfo: any = await preloadQuery(api.user.readUser, {
    username: (await params)?.username
  });

  let currentUserId = userId
  let userProfileId = preloadedUserInfo?._valueJSON.userId
  let userProfile = preloadedUserInfo?._valueJSON

  return (
    <div className="border-l border-r border-gray-200 min-h-screen w-full">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm mt-3">
        <ProfileHeader currentUserId={currentUserId!} userProfileId={userProfileId} userProfile={userProfile} />
      </div>

      <main>
        <div className="border-b border-gray-200">
          <UserInfo preloadedUserInfo={preloadedUserInfo} currentUserId={currentUserId!} userProfileId={userProfileId} />
        </div>

        {/* Tweets */}
        <TweetList userInfo={preloadedUserInfo?._valueJSON} currentUserId={currentUserId!} userProfileId={userProfileId} />
      </main>
    </div>
  )
}