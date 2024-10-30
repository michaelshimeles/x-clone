import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { api } from "@/convex/_generated/api"
import { fetchMutation, fetchQuery } from "convex/nextjs"
import { AlignLeft, ChevronDown, Globe, Image, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type PostButtonProps = {
  userId: string;
};

export default function PostButton({ userId }: PostButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [audience, setAudience] = useState("Everyone");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const getUserInfo = async () => {
      if (userId) {
        const userInfo = await fetchQuery(api.user.readUser, { userId });
        setUserInfo(userInfo);
      }
    };
    getUserInfo();
  }, [userId]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      let imageData;
      if (selectedImages.length > 0) {
        imageData = {
          imageUrls: selectedImages,
          imageIds: [],
        };
      }

      await fetchMutation(api.tweets.createTweet, {
        content: data.post,
        userId: userInfo?.userId,
        visibility: audience.toLowerCase(),
        images: imageData,
        createdAt: Date.now(),
      });

      toast.success("Tweet posted!");
      setIsOpen(false);
      reset();
      setSelectedImages([]);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-500 text-white rounded-full py-3 px-4 font-bold mt-4 hover:bg-blue-600 transition-colors">
          <span className="hidden md:inline">Post</span>
          <span className="md:hidden">
            <AlignLeft size={24} />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogTitle></DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-4 mt-3">
            <div className="flex items-start space-x-4">
              <div className="flex flex-col w-full gap-2">
                <div className="flex items-start gap-1">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={userInfo?.profileImage || "/placeholder.svg?height=48&width=48"} />
                    <AvatarFallback>{userInfo?.name?.[0]}</AvatarFallback>
                  </Avatar>
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
                </div>
                <textarea
                  placeholder="What is happening?!"
                  className="w-full text-xl resize-none border-none focus:outline-none min-h-[50px] mt-4"
                  style={{ height: 'auto' }}
                  rows={1}
                  {...register("post", { required: true })}
                  onChange={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                />
                {selectedImages.length > 0 && (
                  <div className="overflow-y-auto max-h-[300px] rounded-xl">
                    <div className="flex flex-col gap-2">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={file}
                            alt={`Upload ${index + 1}`}
                            className="rounded-lg w-full h-auto object-contain"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeImage(index);
                            }}
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
            <div className="flex items-center text-[#1DA1F2] mt-4">
              <Globe className="h-4 w-4 mr-2" />
              <span className="text-sm">Everyone can reply</span>
            </div>
          </div>
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-white">
            <div className="flex">
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
  );
}