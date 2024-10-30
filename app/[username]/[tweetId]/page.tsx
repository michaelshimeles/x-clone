import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { auth } from "@clerk/nextjs/server"
import { preloadQuery } from "convex/nextjs"
import { BarChart2, Bookmark, Heart, MessageCircle, Repeat2, Share } from "lucide-react"
import DeleteButton from "./(components)/delete-button"
import Header from "./(components)/header"
import Link from "next/link"

export default async function ThreadView({ params }: any) {
  const id = (await params)
  const { userId } = await auth()

  const result: any = await preloadQuery(api.tweets.getTweet, {
    tweetId: id?.tweetId,
    username: id?.username
  })

  return (
    <div className="max-w-2xl mx-auto w-full bg-background border-x">
      <Header />
      <article className="p-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" alt="@rasmickyy" />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0">
                    <div className="flex justify-start items-center gap-1">
                      <span className="font-bold">Micky</span>
                      <svg
                        viewBox="0 0 22 22"
                        aria-label="Verified account"
                        className="h-5 w-5 text-blue-500 fill-current"
                      >
                        <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                      </svg>
                    </div>
                    <div className="text-muted-foreground w-full">@{id?.username}</div>
                  </div>
                </div>
              </div>
              <DeleteButton userId={userId!} tweetId={id?.tweetId} />
            </div>
            <div className="mt-3 space-y-3 text-base">
              <p>{result?._valueJSON?.content}</p>
              {result?._valueJSON?.images && result?._valueJSON?.images.length > 0 && (
                <div className={`grid gap-2 mt-3 ${result._valueJSON.images.length === 1 ? 'grid-cols-1' :
                  result._valueJSON.images.length === 2 ? 'grid-cols-2' :
                    result._valueJSON.images.length === 3 ? 'grid-cols-2' :
                      'grid-cols-2'
                  }`}>
                  {result._valueJSON.images.map((image: string, index: number) => (
                    <div
                      key={index}
                      className={`relative ${result._valueJSON.images.length === 3 && index === 0 ? 'col-span-2' : ''
                        }`}
                    >
                      <Link href={`/${id?.username}/media/${id?.tweetId}`}>
                        <img
                          src={image}
                          alt={`Tweet image ${index + 1}`}
                          className="rounded w-full h-full object-cover"
                        // style={{ maxHeight: result._valueJSON.images.length === 1 ? '500px' : '300px' }}
                        />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              <span>{new Date(result?._valueJSON?.createdAt).toLocaleTimeString() + "  ·  " + new Date(result?._valueJSON?.createdAt).toLocaleDateString('en-US', {
                day: "numeric",
                month: 'long',
                year: 'numeric'
              })}</span>

              <span className="mx-1"> · </span>
              <span className="font-semibold text-foreground">25.6K</span>
              <span> Views</span>
            </div>
            <div className="flex p-2 rounded hover:bg-gray-200 text-black items-center mt-3 text-sm text-muted-foreground hover:text-foreground w-full justify-start gap-2 font-medium">
              <BarChart2 className="h-4 w-4" />
              <p>View post engagements</p>
            </div>
            <div className="mt-3 flex items-center justify-between border-y py-3 w-full">
              <Button variant="ghost" size="icon" className="gap-1">
                <MessageCircle className="h-5 w-5" />
                <span>{result?._valueJSON?.replyCount}</span>
              </Button>
              <Button variant="ghost" size="icon" className="gap-1">
                <Repeat2 className="h-5 w-5" />
                <span>{result?._valueJSON?.retweetCount}</span>
              </Button>
              <Button variant="ghost" size="icon" className="gap-1">
                <Heart className="h-5 w-5" />
                <span>{result?._valueJSON?.likeCount}</span>
              </Button>
              <Button variant="ghost" size="icon" className="gap-1">
                <Bookmark className="h-5 w-5" />
                <span>75</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Share className="h-5 w-5" />
              </Button>
            </div>

          </div>
        </div>
      </article>
    </div>
  )
}