// app/components/notifications/notification-list.tsx
'use client'

import { api } from "@/convex/_generated/api"
import { fetchMutation } from "convex/nextjs"
import { useQuery } from "convex/react"
import { useEffect } from "react"
import { NotificationItem } from "./notification-item"

interface NotificationListProps {
  userId: string,
  userInfo: any
}

export function NotificationList({ userId, userInfo }: NotificationListProps) {
  // Use the subscription query instead of regular query
  const notifications = useQuery(api.notifications.subscribeToNotifications, {
    userId
  })



  useEffect(() => {
    const markAsRead = async () => {
      await fetchMutation(api.notifications.markNotificationsAsRead, {
        userId
      })
    }
    if (notifications?.length) {
      markAsRead()
    }
  }, [userId, notifications?.length])

  if (!notifications?.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        No notifications yet
      </div>
    )
  }

  return (
    <div className="divide-y">
      {notifications.map((notification: any) => (
        <NotificationItem
          key={notification._id}
          notification={notification}
          userInfo={userInfo}
        />
      ))}
    </div>
  )
}
