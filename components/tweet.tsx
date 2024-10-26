import Image from 'next/image'
import { MessageCircle, Repeat2, Heart, BarChart2, Bookmark, Upload } from 'lucide-react'

export default function Tweet() {
  return (
    <div className="w-full mx-auto font-sans">
      <div className="">
        <div className="flex items-start space-x-3">
          <img
            src="https://placehold.co/48x48"
            alt="Profile picture"
            width={48}
            height={48}
            className="rounded-full"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1">
              <span className="font-bold text-[15px]">Micky</span>
              <svg className="w-4 h-4 text-blue-400 fill-current" viewBox="0 0 24 24">
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
              </svg>
              <span className="text-gray-500 text-[15px]">@rasmickyy · Oct 16</span>
            </div>
            <p className="mt-1 text-[15px] leading-normal">
              man y'all gotta put me on where to go and what to do at sf... gonna be there oct 22-25
            </p>
            <div className="mt-3 flex items-center justify-between text-gray-500">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 group">
                  <MessageCircle className="w-5 h-5 group-hover:text-blue-500" />
                  <span className="text-xs group-hover:text-blue-500">1</span>
                </button>
                <button className="flex items-center space-x-1 group">
                  <Repeat2 className="w-5 h-5 group-hover:text-green-500" />
                  <span className="text-xs group-hover:text-green-500">1</span>
                </button>
                <button className="flex items-center space-x-1 group">
                  <Heart className="w-5 h-5 group-hover:text-pink-500" />
                  <span className="text-xs group-hover:text-pink-500">10</span>
                </button>
                <button className="flex items-center space-x-1 group">
                  <BarChart2 className="w-5 h-5 group-hover:text-blue-500" />
                  <span className="text-xs group-hover:text-blue-500">1K</span>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <button>
                  <Bookmark className="w-5 h-5 hover:text-blue-500" />
                </button>
                <button>
                  <Upload className="w-5 h-5 hover:text-blue-500" />
                </button>
              </div>
            </div>
          </div>
          <button className="text-gray-500 hover:text-gray-300">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}