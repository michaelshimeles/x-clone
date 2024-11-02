"use client"
import { Input } from '@/components/ui/input'
import LeftSidebar from '@/components/wrapper/left-sidebar'
import { usePathname } from 'next/navigation'
import React from 'react'
import FollowSuggestions from './right-sidarbar'
import { SearchUsers } from '../search-user'


export default function HomeLayout({
  userId,
  children,
}: {
  userId: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isSignInPage = pathname === '/sign-in'
  const isSignUpPage = pathname === '/sign-up'
  const testPage = pathname === '/push'

  const isMessagesPage = pathname === '/messages'
  const isSettingsPage = pathname === '/settings'
  const mediaPage = pathname.match(/^\/[\w]+\/media\/[\w\d]+$/);

  if (isSignInPage || isSignUpPage || testPage || mediaPage) {
    return <>{children}</>
  }
  if (isMessagesPage || isSettingsPage) {
    return (
      <div className="flex justify-center bg-white text-black min-h-screen">
        <div className="flex w-full max-w-[1600px]">
          {/* Left Sidebar */}
          <LeftSidebar userId={userId!} />
          {children}
        </div>
      </div>
    )
  }
  return (
    <div className="flex justify-center bg-white text-black min-h-screen">
      <div className="flex w-full max-w-[1600px]">
        {/* Left Sidebar */}
        <LeftSidebar userId={userId!} />
        {children}
        <div className="hidden md:block max-w-[400px] w-full p-4 overflow-y-auto mr-[135px]">
          <SearchUsers />
          <FollowSuggestions userId={userId!} />
        </div>
      </div>
    </div>
  )
}
