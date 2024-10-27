import { BarChart2, Heart, MessageCircle, Repeat2, Search } from 'lucide-react'
import BackButton from './_components/back-button'

interface BookmarkPostProps {
  avatar: string
  name: string
  handle: string
  date: string
  verified: boolean
  content: string
  image?: string
  imageAlt?: string
  comments?: string
  retweets?: string
  likes?: string
  views?: string
}

function BookmarkPost({
  avatar,
  name,
  handle,
  date,
  verified,
  content,
  image,
  imageAlt,
  comments,
  retweets,
  likes,
  views
}: BookmarkPostProps) {
  return (
    <div className="border-b pb-4">
      <div className="flex items-start space-x-3">
        <img src={avatar} width={48} height={48} className="rounded-full" alt={`${name}'s avatar`} />
        <div className="flex-grow">
          <div className="flex items-center">
            <span className="font-bold">{name}</span>
            {verified && (
              <svg className="w-4 h-4 ml-1 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
              </svg>
            )}
            <span className="text-gray-500 ml-1">{handle}</span>
            <span className="text-gray-500 ml-1">·</span>
            <span className="text-gray-500 ml-1">{date}</span>
          </div>
          <p className="mt-1">{content}</p>
          {image && (
            <img src={image} width={550} height={200} className="mt-3 rounded-xl" alt={imageAlt} />
          )}
          {(comments || retweets || likes || views) && (
            <div className="flex justify-between mt-3 text-gray-500 text-sm">
              <div className="flex items-center group cursor-pointer hover:text-blue-500">
                <MessageCircle className="w-4 h-4 mr-1 group-hover:text-blue-500" />
                <span>{comments}</span>
              </div>
              <div className="flex items-center group cursor-pointer hover:text-green-500">
                <Repeat2 className="w-4 h-4 mr-1 group-hover:text-green-500" />
                <span>{retweets}</span>
              </div>
              <div className="flex items-center group cursor-pointer hover:text-red-500">
                <Heart className="w-4 h-4 mr-1 group-hover:text-red-500" />
                <span>{likes}</span>
              </div>
              <div className="flex items-center group cursor-pointer hover:text-blue-500">
                <BarChart2 className="w-4 h-4 mr-1 group-hover:text-blue-500" />
                <span>{views}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Bookmark(): JSX.Element {
  return (
    <div className="w-full bg-white min-h-screen border-r border-l">
      <BackButton />

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Bookmarks"
            className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full"
          />
        </div>
      </div>

      <div className="space-y-4 p-4">
        <BookmarkPost
          avatar="https://placehold.co/48x48"
          name="shadcn"
          handle="@shadcn"
          date="Oct 25"
          verified={true}
          content={`Do all shadcn/ui apps look the same? No. They don't have to.

Think of shadcn/ui as a coloring template - it provides the outlines & structure. Black & white. A starting point.

You get to fill it with your own unique colors and styles.

And it's really easy. Here's an example:`}
          image="https://placehold.co/400x200"
          imageAlt="Example of shadcn/ui customization"
          comments="93"
          retweets="188"
          likes="2.8K"
          views="229K"
        />

        <BookmarkPost
          avatar="https://placehold.co/48x48"
          name="Fuma Nama"
          handle="@fuma_nama"
          date="Oct 22"
          verified={false}
          content={`Introducing Fumadocs v14: docs framework that works on Next.js App Router

- Beautifully designed, trusted by awesome teams/projects

- Fumadocs MDX for your documents, works natively with Turbopack

- Fumadocs CLI to customise components

fumadocs.vercel.app/blog/v14`}
          image="https://placehold.co/400x200"
          imageAlt="Fumadocs v14 banner"
          comments="93"
          retweets="188"
          likes="2.8K"
          views="229K"
        />
      </div>
    </div>
  )
}