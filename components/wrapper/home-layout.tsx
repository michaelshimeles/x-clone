"use client"
import { Input } from '@/components/ui/input'
import LeftSidebar from '@/components/wrapper/left-sidebar'
import ExploreSection from '@/components/wrapper/right-sidarbar'
import React from 'react'
import { usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'


export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useUser()
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
          <LeftSidebar userId={user?.id!} />
          {children}
        </div>
      </div>
    )
  }
  return (
    <div className="flex justify-center bg-white text-black min-h-screen">
      <div className="flex w-full max-w-[1600px]">
        {/* Left Sidebar */}
        <LeftSidebar userId={user?.id!} />
        {children}
        <div className="hidden md:block max-w-[400px] w-full p-4 overflow-y-auto mr-[135px]">
          <Input className='rounded-full p-6 mb-3 bg-gray-100' placeholder='Search' />
          <ExploreSection />
        </div>
      </div>
    </div>
  )
}
