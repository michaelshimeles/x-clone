import PostInput from '@/components/post-input';
import TabNavigation from '@/components/tab-navigation';

export default async function HomePage() {
  return (
    <div className="border-l border-r border-gray-200 min-h-screen max-w-6xl w-full">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm mt-3">
        <TabNavigation tabs={["For you", "Following"]} />
      </div>

      {/* Main Content */}
      <main>
        {/* Post Input */}
        <div className="px-4 py-2 border-b border-gray-200">
          <PostInput />
        </div>

      </main>
    </div>
  )
}