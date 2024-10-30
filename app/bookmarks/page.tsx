import { api } from '@/convex/_generated/api';
import { auth } from '@clerk/nextjs/server';
import { preloadQuery } from 'convex/nextjs';
import BackButton from './_components/back-button';
import BookmarkPost from './_components/bookmark-post';
import BookmarkList from './_components/bookmark-list';

export default async function Bookmark() {
  const { userId } = await auth()

  console.log('userId', userId)



  return (
    <div className="w-full bg-white min-h-screen border-r border-l">
      <BackButton />

      <div className="space-y-4">
        <BookmarkList userId={userId}/>
      </div>
    </div>
  )
}
