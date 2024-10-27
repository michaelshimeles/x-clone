import React from 'react';
import { Home, Hash, Bell, Mail, Bookmark, User, MoreHorizontal, PenSquare } from 'lucide-react';
import Link from 'next/link';

const XLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const NavItem = ({ icon, label, path }: {
  icon: any,
  label: string,
  path: string
}) => {
  return (
    <Link
      href={path}
      className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-full transition-colors text-xl"
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  return (
    <div className="w-20 md:w-64 flex-shrink-0 p-4 overflow-y-auto md:ml-[135px]">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <XLogo />
        </div>
        <nav className="mt-2">
          <NavItem icon={<Home size={28} />} label="Home" path="/" />
          <NavItem icon={<Hash size={28} />} label="Explore" path="/explore" />
          <NavItem icon={<Bell size={28} />} label="Notifications" path="/notifications" />
          <NavItem icon={<Mail size={28} />} label="Messages" path="/" />
          <NavItem icon={<Bookmark size={28} />} label="Bookmarks" path="/bookmarks" />
          <NavItem icon={<User size={28} />} label="Profile" path="/profile" />
          <NavItem icon={<MoreHorizontal size={28} />} label="More" path="/" />
        </nav>
        <button className="bg-blue-500 text-white rounded-full py-3 px-4 font-bold mt-4 hover:bg-blue-600 transition-colors">
          <span className="hidden md:inline">Post</span>
          <PenSquare size={28} className="md:hidden" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;