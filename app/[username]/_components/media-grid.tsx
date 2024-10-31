'use client'

import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import Image from 'next/image'
import Link from 'next/link'

export default function MediaGrid({ username, userId }: any) {
  const tweets = useQuery(api.tweets.getTweets, { userId })

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-3 gap-1">
          {tweets?.map((tweet: any, index: number) => (
            tweet?.images?.[0] && <Link
              key={index}
              href={`/${username}/media/${tweet?._id}`}
              className="relative aspect-square cursor-pointer overflow-hidden hover:opacity-90 transition-opacity"
            >
              <Image
                src={tweet?.images?.[0]}
                alt={`Grid image ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </Link>
          ))}
        </div>
      </div>

    </>
  )
}