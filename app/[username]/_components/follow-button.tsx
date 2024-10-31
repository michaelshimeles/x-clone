'use client'

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { fetchQuery } from "convex/nextjs";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FollowButtonProps {
  followerId: string;      // Current user's ID
  followingId: string;     // Profile user's ID
  variant?: "default" | "outline";
  className?: string;
}

export default function FollowButton({
  followerId,
  followingId,
  variant = "default",
  className = "",
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleFollow = useMutation(api.follows.toggleFollow);

  // Check initial follow status
  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const status = await fetchQuery(api.follows.isFollowing, {
          followerId,
          followingId,
        });
        setIsFollowing(status);
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    if (followerId && followingId) {
      checkFollowStatus();
    }
  }, [followerId, followingId]);

  // Prevent following yourself
  if (followerId === followingId) {
    return null;
  }

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const status = await toggleFollow({
        followerId,
        followingId,
      });
      setIsFollowing(status);
      toast.success(status ? "Followed successfully" : "Unfollowed successfully");
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error toggling follow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = isLoading
    ? "Loading..."
    : isFollowing
    ? isHovered
      ? "Unfollow"
      : "Following"
    : "Follow";

  const buttonVariant = isFollowing ? "outline" : variant;

  return (
    <Button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variant={buttonVariant}
      className={`font-semibold ${
        isFollowing && isHovered ? "hover:bg-red-100 hover:text-red-600 hover:border-red-200" : ""
      } ${className}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : null}
      {buttonText}
    </Button>
  );
}
