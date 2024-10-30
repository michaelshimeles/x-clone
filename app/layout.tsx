import Provider from '@/components/wrapper/provider'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from "@vercel/analytics/react"
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import React from 'react'
import HomeLayout from '../components/wrapper/home-layout'
import './globals.css'

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
    <ClerkProvider dynamic>
      <html lang="en" suppressHydrationWarning>
        <body className={GeistSans.className}>
          <Provider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <HomeLayout>
                {children}
              </HomeLayout>
              <Toaster />
            </ThemeProvider>
          </Provider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>)
}
