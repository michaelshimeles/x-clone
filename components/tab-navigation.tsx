'use client'

import { useState } from 'react'
import { cn } from "@/lib/utils"

interface TabProps {
  tabs: string[]
  defaultTab?: string
}

export default function TabNavigation({ tabs, defaultTab = tabs[0] }: TabProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <nav className="flex justify-center border-b border-gray-200 w-full backdrop-blur-sm">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={cn(
            "px-4 py-2 text-md font-semibold w-[50%] pb-4",
            activeTab === tab
              ? "text-black border-b-2 border-blue-500"
              : "text-gray-500 hover:text-gray-700"
          )}
          aria-current={activeTab === tab ? "page" : undefined}
        >
          {tab}
        </button>
      ))}
    </nav>
  )
}