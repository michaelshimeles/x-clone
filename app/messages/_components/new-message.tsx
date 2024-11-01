// app/components/new-message-dialog.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import { Search, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function NewMessageDialog({ userId }: { userId: string }) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const getOrCreateConversation = useMutation(api.messages.getOrCreateConversation)

  console.log('searchTerm', searchTerm)
  // Search users query
  const users = useQuery(api.user.searchUsers, {
    searchTerm,
    currentUserId: userId!
  })

  const handleUserSelect = async (selectedUser: any) => {
    setSelectedUser(selectedUser)
  }

  // In your NewMessageDialog component
  const handleStartConversation = async () => {
    if (!selectedUser || !userId) return

    try {
      const conversation: any = await getOrCreateConversation({
        participantOneId: userId,        // Changed from participantOne
        participantTwoId: selectedUser.userId  // Changed from participantTwo
      })

      setOpen(false)
      setSelectedUser(null)
      setSearchTerm("")

      console.log('conversation', conversation)
      // Navigate to the conversation
      router.push(`/messages?conversation=${conversation?._id}`)
    } catch (error) {
      console.error("Failed to start conversation:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default" className="rounded-full bg-blue-500 hover:bg-blue-600">
          New message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>New message</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search people"
              className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Selected User */}
          {selectedUser && (
            <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
              <div className="flex items-center gap-2">
                <img
                  src={selectedUser.profileImage}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-semibold">{selectedUser.name}</p>
                  <p className="text-sm text-gray-500">@{selectedUser.username}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedUser(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Search Results */}
          {!selectedUser && searchTerm && (
            <div className="max-h-72 overflow-y-auto divide-y">
              {users?.map((user) => (
                <button
                  key={user.userId}
                  className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 text-left"
                  onClick={() => handleUserSelect(user)}
                >
                  <img
                    src={user.profileImage}
                    alt=""
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{user.name}</span>

                    </div>
                    <span className="text-gray-500 text-sm">@{user.username}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Next Button */}
          <Button
            onClick={handleStartConversation}
            disabled={!selectedUser}
            className="w-full rounded-full"
          >
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
