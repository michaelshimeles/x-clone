import { auth } from "@clerk/nextjs/server";
import { NotificationList } from "./_components/notification-list";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function NotificationsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const preloadedUserInfo: any = await preloadQuery(api.user.readUser, {
    userId: userId
  });


  return (
    <div className=" w-full border-x">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="px-4 py-4">
          <h1 className="text-xl font-semibold">Notifications</h1>
        </div>
      </div>

      <NotificationList userId={userId} userInfo={preloadedUserInfo?._valueJSON} />
    </div>
  );
}
