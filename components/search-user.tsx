// app/components/search-users.tsx
"use client"

import { Input } from '@/components/ui/input'
import { useState, useEffect, useRef } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'
import { BadgeCheck } from 'lucide-react'
import { useClickAway } from '@/utils/hook/use-click-away'

export function SearchUsers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  // Search users query
  const searchResults = useQuery(api.user.searchUsers, {
    searchTerm,
    currentUserId: "", // Empty string to get all users
  });

  // Close results when clicking outside
  useClickAway(containerRef, () => {
    setShowResults(false)
  })

  const handleUserClick = (username: string) => {
    router.push(`/${username}`)
    setShowResults(false)
    setSearchTerm('')
  }

  return (
    <div ref={containerRef} className="relative">
      <Input
        className='rounded-full p-6 mb-3 bg-gray-100'
        placeholder='Search users'
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setShowResults(true)
        }}
        onFocus={() => setShowResults(true)}
      />

      {/* Search Results Dropdown */}
      {showResults && searchTerm && (
        <div className="absolute w-full bg-white rounded-lg shadow-lg mt-1 border overflow-hidden max-h-[400px] overflow-y-auto z-50">
          {searchResults?.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">
              No users found
            </div>
          ) : (
            <div className="divide-y">
              {searchResults?.map((user) => (
                <button
                  key={user.userId}
                  className="w-full p-3 hover:bg-gray-50 flex items-center gap-3 text-left"
                  onClick={() => handleUserClick(user.username)}
                >
                  <img
                    src={user.profileImage || "/placeholder.svg"}
                    alt={`${user.name}'s profile picture`}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{user.name}</span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      @{user.username}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
