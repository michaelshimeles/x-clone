"use client"
import React, { useState } from 'react';
import { BadgeCheck, MapPin, Calendar, Briefcase } from 'lucide-react';
import EditProfile from './edit-profile';
import ImageModal from './image-modal';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const UserInfo = ({ preloadedUserInfo, currentUserId, userProfileId }: any) => {
  const pathname = usePathname()

  const userInfo = preloadedUserInfo?._valueJSON;
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    imageSrc: '',
    altText: ''
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
          {currentUserId === userProfileId && <div className="flex gap-2 mt-4">
            <EditProfile userInfo={userInfo} />
          </div>}
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
            {/* <LinkIcon className="w-4 h-4" /> */}
            <a href={userInfo?.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {userInfo?.link}
            </a>
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
          <button className="hover:underline">
            <span className="font-bold">467</span>
            <span className="text-gray-600"> Following</span>
          </button>
          <button className="hover:underline">
            <span className="font-bold">6,678</span>
            <span className="text-gray-600"> Followers</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        {
          currentUserId !== userProfileId ?
            <div className="flex mt-4 border-b">
              {[{
                tab: 'Posts',
                path: `/${userInfo?.username}`
              }, {
                tab: 'Replies',
                path: `/${userInfo?.username}/replies`
              }, {
                tab: 'Media',
                path: `/${userInfo?.username}/media`
              }].map((tab, index: number) => (
                <Link
                  href={tab?.path}
                  key={index}
                  className={`px-4 text-center py-4 font-medium hover:bg-gray-50 relative w-full ${pathname === tab?.path ? 'font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-500 after:rounded-full' : 'text-gray-600'
                    }`}
                >
                  {tab?.tab}
                </Link>
              ))}

            </div> : <div className="flex mt-4 border-b">
              {[{
                tab: 'Posts',
                path: `/${userInfo?.username}`
              }, {
                tab: 'Replies',
                path: `/${userInfo?.username}/replies`
              }, {
                tab: 'Media',
                path: `/${userInfo?.username}/media`
              }, {
                tab: 'Likes',
                path: `/${userInfo?.username}/likes`
              }].map((tab, index: number) => (
                <Link
                  href={tab?.path}
                  key={index}
                  className={`px-4 text-center py-4 font-medium hover:bg-gray-50 relative w-full ${pathname === tab?.path ? 'font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-500 after:rounded-full' : 'text-gray-600'
                    }`}
                >
                  {tab?.tab}
                </Link>
              ))}

            </div>}
      </div>

      {/* Modal Component */}
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