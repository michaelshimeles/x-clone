import Provider from '@/app/provider'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import AuthWrapper from '@/components/wrapper/auth-wrapper'
import { Analytics } from "@vercel/analytics/react"
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import './globals.css'
import { Input } from '@/components/ui/input'
import XLogo from '@/components/x-logo'
import { Home, Search, Bell, Mail, Bookmark, User, MoreHorizontal, Twitter, Hash } from 'lucide-react'
import React from 'react'

export const metadata: Metadata = {
  // metadataBase: new URL(""),
  title: {
    default: 'Not X',
    template: `%s | Not X`
  },
  description: 'An X Clone built using Nextjs 15 & Convex',
  openGraph: {
    description: 'An X Clone built using Nextjs 15 & Convex',
    // images: ['https://utfs.io/f/8a428f85-ae83-4ca7-9237-6f8b65411293-eun6ii.png'],
    // url: 'https://starter.rasmic.xyz/'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Not X',
    description: 'An X Clone built using Nextjs 15 & Convex',
    siteId: "",
    creator: "@rasmic",
    creatorId: "",
    // images: ['https://utfs.io/f/8a428f85-ae83-4ca7-9237-6f8b65411293-eun6ii.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthWrapper>
      <html lang="en" suppressHydrationWarning>
        {/* <head>
          <link
            rel="preload"
            href="https://utfs.io/f/31dba2ff-6c3b-4927-99cd-b928eaa54d5f-5w20ij.png"
            as="image"
          />
          <link
            rel="preload"
            href="https://utfs.io/f/69a12ab1-4d57-4913-90f9-38c6aca6c373-1txg2.png"
            as="image"
          />
        </head> */}
        <body className={GeistSans.className}>
          <Provider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex justify-center bg-white text-black min-h-screen">
                <div className="flex w-full max-w-[1600px]">
                  {/* Left Sidebar */}
                  <div className="w-64 flex-shrink-0  p-4 overflow-y-auto ml-[135px]">
                    <div className="flex flex-col h-full">
                      {/* <Twitter className="w-8 h-8 text-blue-400 mb-4 ml-3" /> */}
                      <XLogo />
                      <nav>
                        <NavItem icon={<Home />} label="Home" path="/" />
                        <NavItem icon={<Hash />} label="Explore" path="/" />
                        <NavItem icon={<Bell />} label="Notifications" path="/" />
                        <NavItem icon={<Mail />} label="Messages" path="/" />
                        <NavItem icon={<Bookmark />} label="Bookmarks" path="/" />
                        <NavItem icon={<User />} label="Profile" path="/profile" />
                        <NavItem icon={<MoreHorizontal />} label="More" path="/" />
                      </nav>
                      <button className="bg-blue-400 text-white rounded-full py-3 px-4 font-bold mt-4">
                        Post
                      </button>
                    </div>
                  </div>
                  {children}
                  <div className=" flex-shrink-0  p-4 overflow-y-auto mr-[135px]">
                    <Input className='rounded-full p-6 mb-3 bg-gray-100' placeholder='Search' />
                    <ExploreSection />
                  </div>
                </div>
              </div>
              <Toaster />
            </ThemeProvider>
          </Provider>
          <Analytics />
        </body>
      </html>
    </AuthWrapper>
  )
}

function ExploreSection() {
  const exploreItems = [
    {
      title: "Tommy Robinson Charged Under Terrorism Act",
      metadata: "7 hours ago · Politics · 155K posts",
      avatars: ["/api/placeholder/32/32", "/api/placeholder/32/32", "/api/placeholder/32/32"]
    },
    {
      title: "Arc Browser's Future Uncertain",
      metadata: "Trending now · Technology · 320 posts",
      avatars: ["/api/placeholder/32/32", "/api/placeholder/32/32", "/api/placeholder/32/32"]
    },
    {
      title: "Hallelujah Challenge Festival 2024",
      metadata: "6 hours ago · Festival · 5.3K posts",
      avatars: ["/api/placeholder/32/32", "/api/placeholder/32/32", "/api/placeholder/32/32"]
    },
    {
      title: "Fortnite Players Seek Trio Teammates",
      metadata: "Trending now · Gaming · 1.7K posts",
      avatars: ["/api/placeholder/32/32", "/api/placeholder/32/32", "/api/placeholder/32/32"]
    }
  ];

  return (
    <div className="w-[375px] bg-white rounded-2xl p-4 border">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[23px] font-bold">Explore</h1>
        <span className="px-2 py-1 text-xs font-medium bg-[#FFF4EE] text-[#CD6C3B] rounded">Beta</span>
      </div>

      <div className="space-y-4">
        {exploreItems.map((item, index) => (
          <div key={index} className="cursor-pointer hover:bg-gray-50 -mx-4 px-4 py-3">
            <div className="flex items-start justify-between">
              <div className="flex-grow">
                <h2 className="font-bold text-[15px] mb-1">{item.title}</h2>
                <p className="text-gray-500 text-sm">{item.metadata}</p>
              </div>
              <div className="flex -space-x-2 ml-4">
                {item.avatars.map((avatar, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="text-blue-500 text-[15px] mt-2 hover:text-blue-600">
        Show more
      </button>
    </div>
  );
};


function NavItem({ icon, label, path }: {
  icon: any,
  label: string,
  path: string
}) {
  return (
    <a
      href={path}
      className={`flex items-center space-x-4 py-4 px-3 rounded-full hover:bg-gray-200 w-fit transition-colors
        }`}
    >
      {React.cloneElement(icon, { className: 'w-7 h-7' })}
      <span className='text-xl'>{label}</span>
    </a>
  )
}