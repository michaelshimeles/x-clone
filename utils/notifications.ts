// Helper function to send notifications (use this in your interaction handlers)
// utils/notifications.ts
import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"

export const useNotification = () => {
  const createNotification = useMutation(api.notifications.createNotification)

  const sendNotification = async ({
    userId,
    actorId,
    type,
    tweetId
  }: {
    userId: string
    actorId: string
    type: "like" | "retweet" | "follow" | "reply"
    tweetId?: string
  }) => {
    try {
      await createNotification({
        userId,
        actorId,
        type,
        tweetId: tweetId as any // Add proper type handling
      })
    } catch (error) {
      console.error("Failed to send notification:", error)
    }
  }

  return { sendNotification }
}
