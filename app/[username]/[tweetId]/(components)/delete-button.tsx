"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { MoreHorizontal, Trash } from "lucide-react"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteButton({ userId, tweetId }: { userId: string, tweetId: any }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Stop event bubbling

    try {
      setIsDeleting(true);
      await fetchMutation(api.tweets.deleteTweet, {
        tweetId: tweetId,
        userId: userId
      });
      toast.success("Tweet deleted successfully");
      router.back()
    } catch (error) {
      console.error("Failed to delete tweet:", error);
      toast.error("Failed to delete tweet");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Stop event bubbling
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger onClick={handleDropdownClick}>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreHorizontal className="h-5 w-5" />
          <span className="sr-only">More options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onClick={(e) => e.stopPropagation()} // Prevent link click when clicking menu
      >
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 cursor-pointer"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash className="w-4 h-4 mr-2" />
          {isDeleting ? "Deleting..." : "Delete Tweet"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}