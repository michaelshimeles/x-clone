import { BarChart2, Bookmark, Heart, MessageCircle, Repeat, Settings, Share } from 'lucide-react'

interface LikeNotificationProps {
  mainUser: string
  otherCount?: number
  content: string
  subContent?: string
}

interface FollowNotificationProps {
  mainUser: string
  otherCount?: number
}

interface ReplyNotificationProps {
  user: string
  handle: string
  time: string
  replyTo: string
  content: string
}

export default function Notifications(): JSX.Element {
  return (
    <div className="w-full min-h-screen border-r border-l">
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-bold">Notifications</h1>
        <Settings className="w-6 h-6" />
      </header>

      <nav className="flex border-b">
        <button className="flex-1 py-3 text-center text-blue-500 border-b-2 border-blue-500 font-semibold">All</button>
        <button className="flex-1 py-3 text-center text-gray-500">Verified</button>
        <button className="flex-1 py-3 text-center text-gray-500">Mentions</button>
      </nav>

      <div className="space-y-4 p-4">
        <LikeNotification
          mainUser="ebeneazy"
          otherCount={24}
          content="Might make a change to @neondatabase Postgres and @DrizzleORM from supabase"
          subContent="Been using neon + drizzle and loving the workflow"
        />

        <FollowNotification
          mainUser="Shawn Erquhart"
          otherCount={12}
        />

        <ReplyNotification
          user="Shawn Erquhart"
          handle="@erquhart_"
          time="9m"
          replyTo="@rasmickyy @neondatabase and @DrizzleORM"
          content="Oh snap would love to see this"
        />

        <LikeNotification
          mainUser="Shawn Erquhart"
          content="i am build a twitter clone with convex :)"
        />

        <LikeNotification
          mainUser="Nirzhuk"
          content="github.com/michaelshimele..."
        />

        <LikeNotification
          mainUser="Manoj Kumar 👨‍💻"
          otherCount={4}
          content="BROs I ACTUALLY WONNN 🔥🔥🔥🔥 pic.x.com/CmUbyfsfLF"
        />

        <LikeNotification
          mainUser="Nikita Shamgunov"
          content="100%"
          subContent="i just prefer the workflow working with neon+drizzle"
        />
      </div>
    </div>
  )
}

function LikeNotification({ mainUser, otherCount, content, subContent }: LikeNotificationProps): JSX.Element {
  return (
    <div className="flex space-x-3">
      <Heart className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
      <div>
        <div className="flex -space-x-2 mb-2">
          {[...Array(5)].map((_, i) => (
            <img key={i} src="https://placehold.co/24x24" width={24} height={24} className="rounded-full border border-white" alt="" />
          ))}
        </div>
        <p className="text-sm">
          <span className="font-bold">{mainUser}</span>
          {otherCount && <> and {otherCount} others</>} liked your post
        </p>
        <p className="text-gray-500 text-sm mt-1">{content}</p>
        {subContent && <p className="text-gray-500 text-sm mt-1">{subContent}</p>}
      </div>
    </div>
  )
}

function FollowNotification({ mainUser, otherCount }: FollowNotificationProps): JSX.Element {
  return (
    <div className="flex space-x-3">
      <div className="w-5 h-5 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
      <div>
        <div className="flex -space-x-2 mb-2">
          {[...Array(5)].map((_, i) => (
            <img key={i} src="https://placehold.co/24x24" width={24} height={24} className="rounded-full border border-white" alt="" />
          ))}
        </div>
        <p className="text-sm">
          <span className="font-bold">{mainUser}</span>
          {otherCount && <> and {otherCount} others</>} followed you
        </p>
      </div>
    </div>
  )
}

function ReplyNotification({ user, handle, time, replyTo, content }: ReplyNotificationProps): JSX.Element {
  return (
    <div className="flex items-start space-x-3">
      <img src="https://placehold.co/40x40" width={40} height={40} className="rounded-full border border-white mt-1" alt={user} />
      <div>
        <p className="text-sm">
          <span className="font-bold">{user}</span> <span className="text-gray-500">{handle} · {time}</span>
        </p>
        <p className="text-gray-500 text-sm">Replying to {replyTo}</p>
        <p className="text-sm mt-1">{content}</p>
        <div className="flex space-x-12 mt-2 text-gray-500">
          <MessageCircle className="w-4 h-4" />
          <Repeat className="w-4 h-4" />
          <Heart className="w-4 h-4" />
          <BarChart2 className="w-4 h-4" />
          <Bookmark className="w-4 h-4" />
          <Share className="w-4 h-4" />
        </div>
      </div>
    </div>
  )
}