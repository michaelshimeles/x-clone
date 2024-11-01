// app/messages/_components/message-list.tsx
"use client"

import { useEffect, useRef } from "react"
import { formatDistanceToNow } from "date-fns"

interface MessageListProps {
  messages: any
  userId: string
}

export function MessageList({ messages, userId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (behavior: "auto" | "smooth" = "auto") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  }

  // Scroll to bottom when messages change (new message added)
  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages?.length]); // Only trigger when messages array length changes

  // Initial scroll to bottom (instant)
  useEffect(() => {
    scrollToBottom("auto");
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="flex-grow overflow-y-auto p-4 space-y-4 h-full"
      style={{ scrollbarGutter: 'stable' }}
    >
      <div className="flex flex-col justify-end min-h-full">
        {messages?.map((message: any) => (
          <div
            key={message._id}
            className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId === userId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <p className="break-words">{message.content}</p>
              <span
                className={`text-xs ${
                  message.senderId === userId
                    ? 'text-white/70'
                    : 'text-gray-500'
                }`}
              >
                {formatDistanceToNow(message.createdAt)} ago
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}