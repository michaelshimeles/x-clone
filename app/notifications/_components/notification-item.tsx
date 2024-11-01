import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface NotificationItemProps {
  notification: any;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const getNotificationText = () => {
    switch (notification.type) {
      case "like":
        return "liked your tweet";
      case "retweet":
        return "retweeted your tweet";
      case "follow":
        return "followed you";
      case "reply":
        return "replied to your tweet";
      default:
        return "interacted with your tweet";
    }
  };

  return (
    <div className={`p-4 hover:bg-gray-50 flex items-start gap-3 ${!notification.read ? 'bg-gray-50' : ''
      }`}>
      <Link href={`/${notification.actor.username}`}>
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={notification.actor.profileImage}
            alt={notification.actor.name}
          />
          <AvatarFallback>
            {notification.actor.name[0]}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link
            href={`/${notification.actor.username}`}
            className="font-semibold hover:underline"
          >
            {notification.actor.name}
          </Link>
          <span className="text-gray-500">
            {getNotificationText()}
          </span>
          <span className="text-gray-500 text-sm">
            · {formatDistanceToNow(notification.createdAt)} ago
          </span>
        </div>

        {notification.tweet && (
          <Link
            href={`/${notification.actor.username}/${notification.tweet._id}`}
            className="mt-2 text-gray-500 text-sm"
          >
            {notification.tweet.content}
          </Link>
        )}
      </div>
    </div>
  );
}