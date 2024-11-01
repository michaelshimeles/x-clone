import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface NotificationItemProps {
  notification: any;
  userInfo: any;
}

export function NotificationItem({ notification, userInfo }: NotificationItemProps) {
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
      {/* Actor's avatar - links to actor's profile */}
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
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {/* Actor's name - links to actor's profile */}
            <Link
              href={`/${notification.actor.username}`}
              className="font-semibold hover:underline"
            >
              {notification.actor.name}
            </Link>

            {/* Notification text and timestamp - not clickable */}
            <span className="text-gray-500">
              {getNotificationText()}
            </span>
            <span className="text-gray-500 text-sm">
              · {formatDistanceToNow(notification.createdAt)} ago
            </span>
          </div>

          {/* Tweet content - links to the tweet */}
          {notification.tweet && (
            <Link
              href={`/${userInfo.username}/${notification.tweet._id}`}
              className="text-gray-500 text-sm hover:text-gray-700"
            >
              {notification.tweet.content}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}