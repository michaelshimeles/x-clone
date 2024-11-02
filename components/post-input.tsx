"use client"
import { Camera, ChevronDown, MapPin, Smile, Type, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { api } from "@/convex/_generated/api"
import { fetchMutation } from "convex/nextjs"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'

export default function PostInput({ userInfo }: any) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [expandInput, setExpandInput] = useState<Boolean>(false)
  const [content, setContent] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [audience, setAudience] = useState("Everyone")

  // Adjust height as the user types
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const handleInput = () => {
      textarea.style.height = '8px'
      textarea.style.height = `${textarea.scrollHeight}px`
    }

    textarea.addEventListener('input', handleInput)
    return () => textarea.removeEventListener('input', handleInput)
  }, [])

  const handlePost = async () => {
    if (!content.trim() && selectedImages.length === 0) return

    try {
      let imageData;
      if (selectedImages.length > 0) {
        imageData = {
          imageUrls: selectedImages,
          imageIds: [],
        };
      }

      await fetchMutation(api.tweets.createTweet, {
        content: content.trim(),
        userId: userInfo?.userId,
        visibility: audience.toLowerCase(),
        images: imageData,
        createdAt: Date.now(),
      });

      // Reset form
      setContent("");
      setSelectedImages([]);
      setExpandInput(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = '32px'; // Set to h-8 equivalent
        textareaRef.current.blur(); // Remove focus from textarea
      }
      toast.success("Tweet posted!");
    } catch (error) {
      console.error("Failed to post tweet:", error);
      toast.error("Failed to post tweet");
    }
  };
  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      const imageUrls: string[] = [];
      const imageIds: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const postUrl = await fetchMutation(api.messages.generateUploadUrl);

        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) throw new Error('Upload failed');

        const { storageId } = await result.json();
        const imageUrl = await fetchMutation(api.messages.getUploadUrl, { storageId });

        if (imageUrl) {
          imageUrls.push(imageUrl);
          imageIds.push(storageId);
        }
      }

      setSelectedImages((prev) => [...prev, ...imageUrls]);
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0">
          <img
            src={userInfo?.profileImage}
            alt="Profile picture"
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
        <div className="min-w-0 flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full px-4 py-0 h-8 text-[#1DA1F2] border-[#1DA1F2] mb-2"
              >
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
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onClick={() => setExpandInput(true)}
            className="text-xl h-8 font-normal text-black focus:outline-none focus:border-none resize-none overflow-hidden w-full"
            placeholder="What is happening?!"
          />

          {selectedImages.length > 0 && (
            <div className="mt-2 overflow-y-auto max-h-[300px] rounded-xl">
              <div className="grid grid-cols-2 gap-2">
                {selectedImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={file}
                      alt={`Upload ${index + 1}`}
                      className="rounded-lg w-full h-auto object-contain"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70
                        text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex justify-start items-center">
          <input
            type="file"
            ref={imageInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
          />
          <button
            className="text-gray-400 hover:text-blue-500"
            onClick={() => imageInputRef.current?.click()}
          >
            <Camera className="w-6 h-6" />
          </button>
        </div>
        <button
          className="px-4 py-2 bg-blue-400 text-white font-semibold rounded-full hover:bg-blue-500
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 disabled:opacity-50"
          onClick={handlePost}
          disabled={(!content.trim() && selectedImages.length === 0) || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Post'}
        </button>
      </div>
    </div>
  )
}