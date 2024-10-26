import Tweet from '@/components/tweet'
import ProfileHeader from './_components/header'
import UserInfo from './_components/user-info'

export default function Profile() {
  return (
    <div className="border-l border-r border-gray-200 min-h-screen w-full">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm mt-3">
        <ProfileHeader />
      </div>

      {/* Main Content */}
      <main>
        {/* Post Input */}
        <div className="border-b border-gray-200">
          <UserInfo />
        </div>

        {/* Tweets */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Tweet />
          </div>
        ))}
      </main>
    </div>
  )
}