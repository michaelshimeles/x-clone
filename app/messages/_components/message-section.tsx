"use client"

import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { Search, Settings } from 'lucide-react'
import { useState } from 'react'
import { ChatPanel } from "./chat-panel"
import { MessageRow } from "./message-row"
import { NewMessageDialog } from "./new-message"

export default function MessageSection({ userId }: { userId: string }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<any>(null)

  const conversations = useQuery(api.messages.getConversations, {
    userId: userId!
  })

  return (
    <div className="flex w-full min-h-screen border-l">
      {/* Left sidebar with conversations */}
      <div className="w-[400px] border-r flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-bold">Messages</h1>
          <div className="flex space-x-4">
            {/* <Settings className="w-6 h-6 text-gray-700 cursor-pointer" /> */}
            <NewMessageDialog userId={userId} />
          </div>
        </header>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Direct Messages"
              className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations?.map((conversation) => (
            <MessageRow
              key={conversation._id}
              conversation={conversation}
              isSelected={selectedConversation?._id === conversation._id}
              onClick={() => setSelectedConversation(conversation)}
            />
          ))}
        </div>
      </div>

      {/* Right panel - Chat or Empty state */}
      {selectedConversation ? (
        <ChatPanel
          conversation={selectedConversation}
          userId={userId!}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center space-y-3 p-8 text-center bg-white">
          <h2 className="text-2xl font-bold">Select a message</h2>
          <p className="text-gray-500">
            Choose from your existing conversations, start a new one, or just keep swimming.
          </p>
          <NewMessageDialog userId={userId} />
        </div>
      )}
    </div>
  )
}
