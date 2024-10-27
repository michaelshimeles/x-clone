"use client"
import { ArrowLeft, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()
  return (
    <header className="flex items-center p-4 border-b">
      <ArrowLeft className="w-6 h-6 mr-4 hover:cursor-pointer" onClick={() => router.back()}/>
      <h1 className="text-xl font-bold flex-grow">All Bookmarks</h1>
      <MoreHorizontal className="w-6 h-6" />
    </header>

  )
}