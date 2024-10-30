'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react'

export default function MediaGrid({ tweets }: any) {
  const [showTweet, setShowTweet] = useState(false)

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-3 gap-1">
          {tweets.map((src: any, index: number) => (
            <div
              key={index}
              className="relative aspect-square cursor-pointer overflow-hidden hover:opacity-90 transition-opacity"
              onClick={() => setShowTweet(true)}
            >
              <Image
                src={src?.images?.[0]}
                alt={`Grid image ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>

      <Dialog open={showTweet} onOpenChange={setShowTweet}>
        <DialogContent className="max-w-screen-sm">
          <ScrollArea className="max-h-[80vh]">
            <div className="flex flex-col gap-4 p-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Username</span>
                    <span className="text-muted-foreground">@handle</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">1h</span>
                  </div>
                  <p className="mt-1">This is a custom tweet display that replaces the react-tweet component. It maintains the same functionality but with a custom implementation.</p>
                  <div className="mt-4">
                    <Image
                      src="https://placehold.co/600x400"
                      alt="Tweet image"
                      width={600}
                      height={400}
                      className="rounded-lg"
                      unoptimized
                    />
                  </div>
                  <div className="flex items-center gap-6 mt-4">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>24</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Repeat2 className="w-4 h-4" />
                      <span>12</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Heart className="w-4 h-4" />
                      <span>148</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}