"use client"
import { Input } from '@/components/ui/input'
import LeftSidebar from '@/components/wrapper/left-sidebar'
import ExploreSection from '@/components/wrapper/right-sidarbar'
import React from 'react'
import { usePathname } from 'next/navigation'


export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isSignInPage = pathname === '/account'
  const isMessagesPage = pathname === '/messages'

  if (isSignInPage) {
    return <>{children}</>
  }

  if (isMessagesPage) {
    return (
      <div className="flex justify-center bg-white text-black min-h-screen">
        <div className="flex w-full max-w-[1600px]">
          {/* Left Sidebar */}
          <LeftSidebar />
          {children}
        </div>
      </div>
    )
  }
  return (
    <div className="flex justify-center bg-white text-black min-h-screen">
      <div className="flex w-full max-w-[1600px]">
        {/* Left Sidebar */}
        <LeftSidebar />
        {children}
        <div className="hidden md:block max-w-[400px] w-full p-4 overflow-y-auto mr-[135px]">
          <Input className='rounded-full p-6 mb-3 bg-gray-100' placeholder='Search' />
          <ExploreSection />
        </div>
      </div>
    </div>
  )
}
