"use client"

import { useState } from "react"
import { X, ChevronDown, Image, Gift, AlignLeft, MapPin, Smile, Calendar, Globe } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function PostButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [audience, setAudience] = useState("Everyone")

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-500 text-white rounded-full py-3 px-4 font-bold mt-4 hover:bg-blue-600 transition-colors">
          <span className="hidden md:inline">Post</span>
          <span className="md:hidden">
            <AlignLeft size={24} />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="[&>button]:hidden sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="px-4 py-2 border-b border-gray-200 flex flex-row justify-between items-center w-full">
          <DialogTitle className="text-lg font-bold text-[#1DA1F2]">Drafts</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="p-4">
          <div className="flex items-start space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full px-4 py-0 h-8 text-[#1DA1F2] border-[#1DA1F2]">
                    {audience}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  <DropdownMenuItem onClick={() => setAudience("Everyone")}>
                    Everyone
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setAudience("Followers")}>
                    Followers
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <textarea
                placeholder="What is happening?!"
                className="w-full min-h-[150px] text-xl resize-none border-none focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center text-[#1DA1F2] mt-4">
            <Globe className="h-4 w-4 mr-2" />
            <span className="text-sm">Everyone can reply</span>
          </div>
        </div>
        <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon" className="text-[#1DA1F2]">
              <Image className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#1DA1F2]">
              <Gift className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#1DA1F2]">
              <AlignLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#1DA1F2]">
              <Smile className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#1DA1F2]">
              <Calendar className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#1DA1F2]">
              <MapPin className="h-5 w-5" />
            </Button>
          </div>
          <Button className="bg-[#1DA1F2] text-white rounded-full px-6 py-2 font-bold hover:bg-[#1A91DA] transition-colors">
            Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}