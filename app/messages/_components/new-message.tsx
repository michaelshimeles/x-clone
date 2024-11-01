// app/components/new-message-dialog.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useState } from "react"
import { api } from "@/convex/_generated/api"
import { useQuery, useMutation } from "convex/react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export function NewMessageDialog() {
  const { user } = useUser()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const getOrCreateConversation = useMutation(api.messages.getOrCreateConversation)

  console.log('searchTerm', searchTerm)
  // Search users query
  const users = useQuery(api.user.searchUsers, {
    searchTerm,
    currentUserId: user?.id!
  })

  const handleUserSelect = async (selectedUser: any) => {
    setSelectedUser(selectedUser)
  }

  // In your NewMessageDialog component
  const handleStartConversation = async () => {
    if (!selectedUser || !user?.id) return

    try {
      const conversation: any = await getOrCreateConversation({
        participantOneId: user.id,        // Changed from participantOne
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
        <Button variant="default" className="rounded-full bg-blue-500 hover:bg-blue-600">
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
                      {/* {user.verified && (
                        <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 24 24">
                          <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                        </svg>
                      )} */}
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
