import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api } from "@/convex/_generated/api"
import { auth } from "@clerk/nextjs/server"
import { preloadQuery } from "convex/nextjs"
import Link from "next/link"
import DeleteButton from "./(components)/delete-button"
import Header from "./(components)/header"
import ThreadInteractions from "./(components)/thread-interactions"

export default async function ThreadView({ params }: { params: Promise<{ username: string, tweetId: string }> }) {
  const { userId } = await auth()
  const id = await params
  if (!userId) return null

  const result: any = await preloadQuery(api.tweets.getTweet, {
    tweetId: id.tweetId,
    username: id.username
  })

  const tweet = result?._valueJSON
  if (!tweet) return null

  return (
    <div className="max-w-2xl mx-auto w-full bg-background border-x">
      <Header />
      <article className="p-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <Link href={`/${id.username}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={tweet.user?.profileImage}
                        alt={tweet.user?.name}
                      />
                      <AvatarFallback>
                        {tweet.user?.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0">
                      <div className="flex justify-start items-center gap-1">
                        <span className="font-bold">{tweet.user?.name}</span>
                        {tweet.user?.verified && (
                          <svg
                            viewBox="0 0 22 22"
                            aria-label="Verified account"
                            className="h-5 w-5 text-blue-500 fill-current"
                          >
                            <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                          </svg>
                        )}
                      </div>
                      <div className="text-muted-foreground w-full">
                        @{tweet.user?.username}
                      </div>
                    </div>
                  </div>
                </div>
                {userId === tweet.userId && (
                  <DeleteButton userId={userId} tweetId={id.tweetId} />
                )}
              </div>
            </Link>

            <div className="mt-3 space-y-3 text-base">
              <p>{tweet.content}</p>
              {tweet.images?.length > 0 && (
                <div className={`grid gap-2 mt-3 ${tweet.images.length === 1 ? 'grid-cols-1' :
                  tweet.images.length === 2 ? 'grid-cols-2' :
                    tweet.images.length === 3 ? 'grid-cols-2' :
                      'grid-cols-2'
                  }`}>
                  {tweet.images.map((image: string, index: number) => (
                    <div
                      key={index}
                      className={`relative ${tweet.images.length === 3 && index === 0 ? 'col-span-2' : ''
                        }`}
                    >
                      <Link href={`/${id.username}/media/${id.tweetId}`}>
                        <img
                          src={image}
                          alt={`Tweet image ${index + 1}`}
                          className="rounded w-full h-full object-cover"
                        />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-3 text-sm text-muted-foreground">
              <span>
                {new Date(tweet.createdAt).toLocaleTimeString() + "  ·  " +
                  new Date(tweet.createdAt).toLocaleDateString('en-US', {
                    day: "numeric",
                    month: 'long',
                    year: 'numeric'
                  })}
              </span>
              <span className="mx-1"> · </span>
              <span className="font-semibold text-foreground">
                {tweet.viewCount || 0}
              </span>
              <span> Views</span>
            </div>

            <ThreadInteractions
              tweet={tweet}
              userId={userId}
            />
          </div>
        </div>
      </article>
    </div>
  )
}
