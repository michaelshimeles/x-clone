"use client"
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Bell, Bookmark, Hash, Home, Mail, MoreHorizontal, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PostButton from '../post/post-button';

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
  const pathname = usePathname();
  return (
    <Link
      href={path}
      className={`flex items-center gap-4 p-3 rounded-full transition-colors text-xl hover:bg-gray-100 ${pathname === path && "p-2 rounded bg-gray-100"}`}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
};

const Sidebar = ({ userId }: { userId: string }) => {

  console.log("userId", userId)
  const userInfo = useQuery(api.user.readUser, { userId })
  console.log('userInfo', userInfo?.username)

  return (
    <div className="w-20 md:w-64 flex-shrink-0 p-4 overflow-y-auto md:ml-[135px]">
      <div className="flex flex-col h-full">
        <Link href="/" className="flex justify-start items-center gap-2 p-4">
          <XLogo />
          <p className='text-white text-sm bg-black border rounded-full px-3'>{userInfo?.username}</p>
        </Link>
        <nav className="space-y-1 mt-2">
          <NavItem icon={<Home size={28} />} label="Home" path="/" />
          <NavItem icon={<Hash size={28} />} label="News" path="/explore" />
          <NavItem icon={<Bell size={28} />} label="Notifications" path="/notifications" />
          <NavItem icon={<Mail size={28} />} label="Messages" path="/messages" />
          <NavItem icon={<Bookmark size={28} />} label="Bookmarks" path="/bookmarks" />
          {<NavItem icon={<User size={28} />} label="Profile" path={`/${userInfo?.username}`} />}
          <NavItem icon={<MoreHorizontal size={28} />} label="More" path='/settings' />
        </nav>
        <PostButton userId={userId} />
      </div>
    </div>
  );
};

export default Sidebar;