"use client"

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
import { api } from "@/convex/_generated/api"
import { fetchMutation, fetchQuery } from "convex/nextjs"
import { AlignLeft, Calendar, ChevronDown, Gift, Globe, Image, MapPin, Smile, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function PostButton({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [audience, setAudience] = useState("Everyone")
  const [isUploading, setIsUploading] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await fetchQuery(api.user.readUser, { userId });
      setUserInfo(userInfo)

    }
    getUserInfo()
  }, [userId])


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data: any) => {
    try {
      let imageData;
      if (selectedImages.length > 0) {
        // Use the already uploaded images instead of trying to upload again
        imageData = {
          imageUrls: selectedImages.map(file => URL.createObjectURL(file)),
          imageIds: [] // You'll need to store these when images are first uploaded
        };
      }

      // Create the tweet
      await fetchMutation(api.tweets.createTweet, {
        content: data.post,
        userId: userInfo.userId,
        visibility: audience.toLowerCase(),
        images: imageData,
        createdAt: Date.now()
      });

      toast.success('Tweet posted!')
      setIsOpen(false)
      reset() // Reset form
      setSelectedImages([]) // Clear images
    } catch (error) {
      console.error('Failed to post tweet:', error)
      toast.error('Failed to post tweet')
    }
  }

  // Modify handleImageSelect to store the imageIds
  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)
    try {
      const imageUrls: string[] = []
      const imageIds: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        // Get upload URL from Convex
        const postUrl = await fetchMutation(api.messages.generateUploadUrl);

        // Upload file
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) throw new Error('Upload failed');

        const { storageId } = await result.json();
        const imageUrl = await fetchMutation(api.messages.getUploadUrl, { storageId });

        imageUrls.push(imageUrl!)
        imageIds.push(storageId)
      }

      setSelectedImages(Array.from(files))
      // Store the uploaded image data
      return { imageUrls, imageIds }
    } catch (error) {
      console.error('Image upload failed:', error)
      toast.error('Failed to upload images')
    } finally {
      setIsUploading(false)
    }
  }

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
          <DialogTitle className="text-lg font-bold text-[#1DA1F2]">New Tweet</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-4">
            <div className="flex items-start space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={userInfo?.profileImage || "/placeholder.svg?height=48&width=48"} />
                <AvatarFallback>{userInfo?.name?.[0]}</AvatarFallback>
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
                  {...register("post", { required: true })}
                />
                {/* Image previews */}
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedImages.map((file, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="rounded-lg object-cover h-32 w-full"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center text-[#1DA1F2] mt-4">
              <Globe className="h-4 w-4 mr-2" />
              <span className="text-sm">Everyone can reply</span>
            </div>
          </div>
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
            <div className="flex space-x-4">
              <input
                type="file"
                ref={imageInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-[#1DA1F2]"
                onClick={() => imageInputRef.current?.click()}
                type="button"
              >
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
            <Button
              type="submit"
              className="bg-[#1DA1F2] text-white rounded-full px-6 py-2 font-bold hover:bg-[#1A91DA] transition-colors"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting || isUploading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
