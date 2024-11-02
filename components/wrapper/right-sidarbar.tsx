// app/components/follow-suggestions.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { BadgeCheck } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function FollowSuggestions({ userId }: { userId: string }) {
  const [showAll, setShowAll] = useState(false);
  const toggleFollow = useMutation(api.follows.toggleFollow);

  const suggestions = useQuery(api.user.getFollowSuggestions, {
    userId: userId!,
    limit: showAll ? 10 : 3
  });

  const handleFollow = async (suggestedUserId: string) => {
    try {
      await toggleFollow({
        followerId: userId!,
        followingId: suggestedUserId
      });
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  if (!suggestions?.length) return null;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">You might like</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion) => (
          <Link href={`/${suggestion.username}`} key={suggestion.userId} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={suggestion.profileImage || "/placeholder.svg"}
                alt={`${suggestion.name}'s profile picture`}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold">{suggestion.name}</span>
                </div>
                <span className="text-muted-foreground">@{suggestion.username}</span>
              </div>
            </div>
            <Button
              variant="default"
              className="rounded-full px-6"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleFollow(suggestion.userId)
              }}
            >
              Follow
            </Button>
          </Link>
        ))}

        {suggestions.length >= 3 && (
          <button
            className="text-primary hover:underline text-sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show less" : "Show more"}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
