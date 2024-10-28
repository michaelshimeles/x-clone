"use client"
import { PenSquare, Search, Settings } from 'lucide-react'
import { useState } from 'react'

interface MessageProps {
  avatarSrc: string
  name: string
  handle: string
  time: string
  message: string
  isVerified?: boolean
  hasGroup?: boolean
  groupCount?: number
}

function MessageRow({
  avatarSrc,
  name,
  handle,
  time,
  message,
  isVerified = false,
  hasGroup = false,
  groupCount = 0
}: MessageProps): JSX.Element {
  return (
    <div className="flex items-start space-x-3 p-4 hover:bg-gray-100 cursor-pointer">
      {hasGroup ? (
        <div className="relative">
          <div className="flex flex-wrap w-12 h-12">
            {[...Array(4)].map((_, i) => (
              <img
                key={i}
                src={avatarSrc}
                alt=""
                className="w-6 h-6 rounded-full border border-white"
              />
            ))}
          </div>
          {groupCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {groupCount}
            </span>
          )}
        </div>
      ) : (
        <img src={avatarSrc} alt="" className="w-12 h-12 rounded-full" />
      )}

      <div className="flex-grow min-w-0">
        <div className="flex items-center space-x-1">
          <span className="font-bold truncate">{name}</span>
          {isVerified && (
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
            </svg>
          )}
          <span className="text-gray-500 text-sm truncate">{handle}</span>
          <span className="text-gray-500 text-sm">·</span>
          <span className="text-gray-500 text-sm">{time}</span>
        </div>
        <p className="text-gray-600 truncate">{message}</p>
      </div>
    </div>
  )
}

export default function Messages(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="flex w-full min-h-screen border-l">
      {/* Messages List Panel */}
      <div className="w-[400px] border-r">
        <header className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-bold">Messages</h1>
          <div className="flex space-x-4">
            <Settings className="w-6 h-6 text-gray-700 cursor-pointer" />
            <PenSquare className="w-6 h-6 text-gray-700 cursor-pointer" />
          </div>
        </header>

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

        <div className="border-b">
          <div className="flex items-center space-x-3 p-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <PenSquare className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h2 className="font-bold">Message requests</h2>
              <p className="text-gray-500 text-sm">7 people you may know</p>
            </div>
          </div>
        </div>

        <div>
          <MessageRow
            avatarSrc="https://placehold.co/48x48"
            name="Serge"
            handle="@sergeua"
            time="2h"
            message="Haha I love the enthusiasm, thanks!"
            hasGroup={true}
            groupCount={4}
          />

          <MessageRow
            avatarSrc="https://placehold.co/48x48"
            name="Raouf Chebri"
            handle="@raoufai"
            time="13h"
            message="Will do, I been"
            isVerified={true}
          />

          <MessageRow
            avatarSrc="https://placehold.co/48x48"
            name="Dazai"
            handle="@dazai_0x"
            time="19h"
            message="Awesome thanks!"
          />

          <MessageRow
            avatarSrc="https://placehold.co/48x48"
            name="Nizzy"
            handle="@NizzyABT"
            time="Oct 26"
            message="yes it's ok, we'll have it for next month"
            isVerified={true}
          />
        </div>
      </div>

      {/* Empty State Panel */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-3 p-8 text-center bg-white">
        <h2 className="text-2xl font-bold">Select a message</h2>
        <p className="text-gray-500">
          Choose from your existing conversations, start a new one, or just keep swimming.
        </p>
        <button className="bg-blue-500 text-white font-bold px-4 py-2 rounded-full hover:bg-blue-600">
          New message
        </button>
      </div>
    </div>
  )
}