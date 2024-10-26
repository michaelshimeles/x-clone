"use client"
import { Camera, MapPin, Smile, Type } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function PostInput() {
  const textareaRef = useRef(null)
  const [expandInput, setExpandInput] = useState<Boolean>(false)

  // Adjust height as the user types
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const handleInput = () => {
      textarea.style.height = '8px' // Reset height
      textarea.style.height = `${textarea.scrollHeight}px` // Set height to scroll height
    }

    // Attach input event listener to adjust height
    textarea.addEventListener('input', handleInput)

    // Cleanup event listener on component unmount
    return () => {
      textarea.removeEventListener('input', handleInput)
    }
  }, [])

  return (
    <div className="pb-3 w-full">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <img
            src="https://placehold.co/48x48"
            alt="Profile picture"
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
        <div className="min-w-0 flex-1 mt-3">
          <textarea
            ref={textareaRef}
            onClick={() => setExpandInput(true)}
            className="text-xl h-8 font-normal text-black focus:outline-none focus:border-none resize-none overflow-hidden w-full"
            placeholder="What is happening?!"
          />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex space-x-4">
          {/* Icon Buttons */}
          <button className="text-gray-400 hover:text-blue-500"><Smile className="w-6 h-6" /></button>
          <button className="text-gray-400 hover:text-blue-500"><Camera className="w-6 h-6" /></button>
          <button className="text-gray-400 hover:text-blue-500"><MapPin className="w-6 h-6" /></button>
          <button className="text-gray-400 hover:text-blue-500"><Type className="w-6 h-6" /></button>
        </div>
        <button className="px-4 py-2 bg-blue-400 text-white font-semibold rounded-full hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
          Post
        </button>
      </div>
    </div>
  )
}
