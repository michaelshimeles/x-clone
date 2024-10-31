import { api } from '@/convex/_generated/api';
import { auth } from '@clerk/nextjs/server';
import { preloadQuery } from 'convex/nextjs';
import { redirect } from 'next/navigation';
import ProfileHeader from '../_components/header';
import UserInfo from '../_components/user-info';
import LikedTweetList from './_components/liked-tweet-list';

export default async function Likes({ params }: { params: Promise<{ username: string }> }) {
  const { userId } = await auth()


  const preloadedUserInfo: any = await preloadQuery(api.user.readUser, {
    // userId: userId!,
    username: (await params)?.username
  });


  let currentUserId = userId
  let userProfileId = preloadedUserInfo?._valueJSON.userId

  if (currentUserId !== userProfileId) {
    redirect("/")
  }


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
          <UserInfo preloadedUserInfo={preloadedUserInfo} userId={userId} />
        </div>

        {/* Render Liked tweets here */}
        <LikedTweetList userInfo={preloadedLikes._valueJSON} currentUserId={currentUserId!} userProfileId={userProfileId} />
      </main>
    </div>
  )
}