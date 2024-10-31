"use client"

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { BadgeCheck, Briefcase, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import EditProfile from './edit-profile';
import FollowButton from './follow-button';
import ImageModal from './image-modal';

// FollowList component for the dialog content
function FollowList({
  userId,
  currentUserId,
  type
}: {
  userId: string;
  currentUserId: string;
  type: 'followers' | 'following'
}) {
  const users = useQuery(
    type === 'followers' ? api.follows.getFollowers : api.follows.getFollowing,
    { userId }
  );

  if (!users) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <Skeleton className="h-8 w-[80px]" />
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        {type === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
      </div>
    );
  }

  return (
    <div className="divide-y max-h-[60vh] overflow-y-auto">
      {users.map((follow: any) => (
        <div key={follow.user.userId} className="flex items-center justify-between">
          <Link
            href={`/${follow.user.username}`}
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            <img
              src={follow.user.profileImage}
              alt={`${follow.user.name}'s avatar`}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{follow.user.name}</p>
              <p className="text-sm text-gray-500 truncate">@{follow.user.username}</p>
            </div>
          </Link>
          {currentUserId !== follow.user.userId && (
            <div className="ml-4">
              <FollowButton
                followerId={currentUserId}
                followingId={follow.user.userId}
                variant="outline"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const UserInfo = ({ preloadedUserInfo, currentUserId, userProfileId }: any) => {
  const pathname = usePathname()
  const userInfo = preloadedUserInfo?._valueJSON;
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    imageSrc: '',
    altText: ''
  });

  // Get follow counts
  const followCounts = useQuery(api.follows.getFollowCounts, {
    userId: userProfileId
  });

  const handleImageClick = (e: React.MouseEvent, imageSrc: string, altText: string) => {
    e.preventDefault();
    setModalConfig({
      isOpen: true,
      imageSrc,
      altText
    });
  };

  const closeModal = () => {
    setModalConfig({
      isOpen: false,
      imageSrc: '',
      altText: ''
    });
  };

  return (
    <div className="max-w-2xl">
      {/* Cover Image */}
      <div
        onClick={(e) => handleImageClick(
          e,
          userInfo?.bannerImage || "/api/placeholder/560/192",
          "Banner image"
        )}
        className="block h-[200px] relative overflow-hidden cursor-pointer"
      >
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${userInfo?.bannerImage || "/api/placeholder/560/192"})`
          }}
          role="img"
          aria-label="Profile banner"
        />
      </div>

      {/* Profile Section */}
      <div>
        {/* Profile Picture and Edit Button */}
        <div className="flex justify-between items-start px-4">
          <div className="relative -mt-16">
            <div
              onClick={(e) => handleImageClick(
                e,
                userInfo?.profileImage || "https://placehold.co/20x20",
                "Profile picture"
              )}
              className="cursor-pointer"
            >
              <img
                src={userInfo?.profileImage || "https://placehold.co/20x20"}
                alt="Profile picture"
                className="w-32 h-32 rounded-full border-4 border-white"
              />
            </div>
          </div>
          {currentUserId === userProfileId ? (
            <div className="flex gap-2 mt-4">
              <EditProfile userInfo={userInfo} />
            </div>
          ) : (
            <div className="flex gap-2 mt-4">
              <FollowButton
                followerId={currentUserId}
                followingId={userProfileId}
              />
            </div>
          )}
        </div>

        {/* Name and Username */}
        <div className="mt-4 px-4">
          <div className="flex items-center gap-1">
            <h2 className="text-xl font-bold">{userInfo?.name}</h2>
            <BadgeCheck className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-gray-600">@{userInfo?.username}</p>
        </div>

        {/* Bio */}
        <p className="mt-3 px-4">
          {userInfo?.description}
        </p>

        {/* Info Items */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-gray-600 px-4">
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            <span>Engineer</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>Toronto 🇨🇦</span>
          </div>
          <div className="flex items-center gap-1">
            {userInfo?.link && (
              <a href={userInfo.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {userInfo.link}
              </a>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Joined {new Date(userInfo?.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            })}</span>
          </div>
        </div>

        {/* Following/Followers */}
        <div className="flex gap-4 mt-3 px-4">
          <Dialog>
            <DialogTrigger asChild>
              <button className="hover:underline">
                <span className="font-bold">{followCounts?.following || 0}</span>
                <span className="text-gray-600"> Following</span>
              </button>
            </DialogTrigger>
            <DialogTitle></DialogTitle>
            <DialogContent className="sm:max-w-[425px]">
              <h2 className="text-xl font-bold mb-4">Following</h2>
              <FollowList
                userId={userProfileId}
                currentUserId={currentUserId}
                type="following"
              />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <button className="hover:underline">
                <span className="font-bold">{followCounts?.followers || 0}</span>
                <span className="text-gray-600"> Followers</span>
              </button>
            </DialogTrigger>
            <DialogTitle></DialogTitle>
            <DialogContent className="sm:max-w-[425px]">
              <h2 className="text-xl font-bold mb-4">Followers</h2>
              <FollowList
                userId={userProfileId}
                currentUserId={currentUserId}
                type="followers"
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Navigation Tabs */}
        <div className="flex mt-4 border-b">
          {(currentUserId !== userProfileId ? [
            { tab: 'Posts', path: `/${userInfo?.username}` },
            { tab: 'Replies', path: `/${userInfo?.username}/replies` },
            { tab: 'Media', path: `/${userInfo?.username}/media` }
          ] : [
            { tab: 'Posts', path: `/${userInfo?.username}` },
            { tab: 'Replies', path: `/${userInfo?.username}/replies` },
            { tab: 'Media', path: `/${userInfo?.username}/media` },
            { tab: 'Likes', path: `/${userInfo?.username}/likes` }
          ]).map((tab, index) => (
            <Link
              href={tab.path}
              key={index}
              className={`px-4 text-center py-4 font-medium hover:bg-gray-50 relative w-full ${pathname === tab.path
                ? 'font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-500 after:rounded-full'
                : 'text-gray-600'
                }`}
            >
              {tab.tab}
            </Link>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        imageSrc={modalConfig.imageSrc}
        altText={modalConfig.altText}
      />
    </div>
  );
};

export default UserInfo;