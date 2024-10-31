import { auth } from '@clerk/nextjs/server';
import BackButton from './_components/back-button';
import BookmarkList from './_components/bookmark-list';

export default async function Bookmark() {
  const { userId } = await auth()

  return (
    <div className="w-full bg-white min-h-screen border-r border-l">
      <BackButton />

      <div className="space-y-4">
        <BookmarkList userId={userId!}/>
      </div>
    </div>
  )
}
