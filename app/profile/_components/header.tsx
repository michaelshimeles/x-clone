"use client"
import { ArrowLeft, BadgeCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfileHeader({ username = "Micky", postCount = 5872 }) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-4 border-b border-gray-200 pb-2">
      <button className="hover:bg-gray-100 p-2 rounded-full ml-3" onClick={() => router.back()}>
        <ArrowLeft className="w-5 h-5 text-gray-900" />
      </button>

      <div>
        <div className="flex items-center gap-1">
          <h1 className="text-xl font-semibold text-gray-900">{username}</h1>
          <BadgeCheck className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-gray-600 text-xs">
          {postCount.toLocaleString()} posts
        </p>
      </div>
    </div>
  )
}