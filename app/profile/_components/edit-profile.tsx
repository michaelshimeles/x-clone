'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/convex/_generated/api"
import { fetchMutation } from "convex/nextjs"
import { Calendar, Camera, Link, MapPin, X } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useRef, useState } from 'react'
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function EditProfile({ userInfo }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [bannerImage, setBannerImage] = useState(userInfo?.bannerImage)
  const [profileImage, setProfileImage] = useState(userInfo?.profileImage)
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const profileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: userInfo?.username,
      name: userInfo?.name,
      bio: userInfo?.description,
      link: userInfo?.link,
      location: userInfo?.location,
      birthday: userInfo?.createdAt
    }
  })
  const onSubmit = async (data: any) => {
    console.log("data", data)

    try {

      await fetchMutation(api.user.updateUser, {
        username: data?.username || userInfo?.username,
        userId: userInfo?.userId,
        description: data?.bio || userInfo?.description,
        email: userInfo?.email || userInfo?.email,
        name: data?.name || userInfo?.name,
        link: data?.link || userInfo?.link,
        location: data?.location || userInfo?.location,
        // birthday: data?.birthday || userInfo?.createdAt
      });

      console.log("YES")

      toast("Profile has been updated", {
        description: new Date(userInfo?.createdAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }),
      })

      setIsOpen(false)

    } catch (error) {

      console.error(error)
      return error
    }

  }


  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'banner' | 'profile'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'banner') {
          setBannerImage(reader.result as string);
        } else {
          setProfileImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Get upload URL from Convex
      const postUrl = await fetchMutation(api.messages.generateUploadUrl);

      // Upload file to Convex storage
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText}`);
      }

      const { storageId } = await result.json();

      // Get the URL for the uploaded file
      const url = await fetchMutation(api.messages.getUploadUrl, { storageId });

      // Update the user's profile with the new image URL
      if (url) {
        await fetchMutation(api.user.updateUser, {
          userId: userInfo.userId,
          ...(type === 'banner'
            ? { bannerImage: url }
            : { profileImage: url }
          )
        });
      }

    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image");
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 font-bold rounded-full border border-gray-200 hover:bg-gray-50">
          Edit profile
        </button>
      </DialogTrigger>
      <DialogContent className="[&>button]:hidden sm:max-w-[425px] md:max-w-[600px] p-0">
        <DialogHeader className="flex flex-row items-center justify-between p-2 border-b">
          <div className="flex justify-between w-full items-center space-x-4 p-2">
            <DialogTitle className="text-xl font-bold">Edit profile</DialogTitle>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="relative">
            <div className="relative h-32 bg-cover bg-center">
              <input
                type="file"
                ref={bannerInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'banner')}
              />
              <img
                src={bannerImage ?? "https://placehold.co/600/192"}
                alt="Banner"
                className="w-full h-full object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/30 rounded-full"
                onClick={() => bannerInputRef.current?.click()}
                type="button"
              >
                <Camera className="h-5 w-5 text-white" />
              </Button>
            </div>

            <div className="absolute -bottom-16 left-4">
              <div className="relative">
                <img
                  src={profileImage ?? "https://placehold.co/20x20"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white object-cover"
                />
                <input
                  type="file"
                  ref={profileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'profile')}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="absolute bottom-0 right-0 bg-black/50 hover:bg-black/30 rounded-full"
                  onClick={() => profileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-20 p-4 space-y-4">
            <div className="flex flex-row w-full justify-between items-center gap-3">
              <div className="w-full">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <Input
                  {...register("username")}
                  className="mt-1"
                />
              </div>
              <div className="w-full">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <Input
                  {...register("name")}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <Textarea
                {...register("bio")}
                className="mt-1"
                rows={4}
              />
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Link className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="website"
                  {...register("link")}
                  className="pl-10"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="location"
                  {...register("location")}
                  className="pl-10"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>
            <div>
              <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
                Birth date
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="birthday"
                  type="date"
                  {...register("birthday")}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <div className="px-4 pb-4 w-full">
            <Button className="w-full rounded-full bg-black text-white hover:bg-gray-800" type="submit" onClick={() => {
              // setIsOpen(false)
              router.refresh();
            }}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}