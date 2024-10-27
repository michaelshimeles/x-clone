import React from 'react';
import { BadgeCheck, MapPin, Calendar, Link as LinkIcon, Briefcase } from 'lucide-react';

const UserInfo = () => {
  return (
    <div className="max-w-2xl">
      {/* Cover Image */}
      {/* <div className="h-48 bg-black w-full relative"> */}
      <img
        src="https://placehold.co/560x192"
        alt="Profile picture"
        className='w-full'
      />

      {/* </div> */}

      {/* Profile Section */}
      <div className="px-4">
        {/* Profile Picture and Edit Button */}
        <div className="flex justify-between items-start">
          <div className="relative -mt-16">
            <img
              src="https://placehold.co/48x48"
              alt="Profile picture"
              className="w-32 h-32 rounded-full border-4 border-white"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button className="p-2 rounded-full border border-gray-200">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M15 8v8H5V8h10m1-2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3l4 4v-11l-4 4v-3c0-.55-.45-1-1-1z" />
              </svg>
            </button>
            <button className="px-4 py-2 font-bold rounded-full border border-gray-200 hover:bg-gray-50">
              Edit profile
            </button>
          </div>
        </div>

        {/* Name and Username */}
        <div className="mt-4">
          <div className="flex items-center gap-1">
            <h2 className="text-xl font-bold">Micky</h2>
            <BadgeCheck className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-gray-600">@rasmickyy</p>
        </div>

        {/* Bio */}
        <p className="mt-3">
          Bond servant of the Lord Jesus Christ. Full Stack Engineer | youtuber 🏠 my site →
        </p>

        {/* Website */}
        <a href="https://rasmic.xyz" className="text-blue-500 hover:underline mt-1 inline-block">
          rasmic.xyz
        </a>

        {/* Info Items */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-gray-600">
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            <span>Engineer</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>Toronto 🇨🇦</span>
          </div>
          <div className="flex items-center gap-1">
            <LinkIcon className="w-4 h-4" />
            <a href="https://youtube.com/@rasmic" className="text-blue-500 hover:underline">
              youtube.com/@rasmic
            </a>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Joined September 2019</span>
          </div>
        </div>

        {/* Following/Followers */}
        <div className="flex gap-4 mt-3">
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
        <div className="flex mt-4 border-b">
          {['Posts', 'Replies', 'Highlights', 'Articles', 'Media', 'Likes'].map((tab, index) => (
            <button
              key={tab}
              className={`px-4 py-4 font-medium hover:bg-gray-50 relative ${index === 0 ? 'font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-500 after:rounded-full' : 'text-gray-600'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;