import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'

interface NewsItemProps {
  title: string
  time: string
  image: string
  category?: string
}

export default async function Explore() {
  const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=366e9399aae1498da8fa1722fff51ce0')
  const result = await response.json()

  return (
    <div className="w-full border min-h-screen">
      <div className="">
        <header className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-bold">News</h1>
        </header>

        {result?.articles?.[0] && (
          <Link href={result.articles[0].url} target="_blank">
            <FeaturedNewsItem
              title={result.articles[0].title}
              time={result.articles[0].publishedAt}
              image={result.articles[0].urlToImage}
              category="NBA"
            />
          </Link>
        )}

        <div className="space-y-4 mt-4">
          {result?.articles?.slice(1).map((article: any) => (
            <Link href={article?.url} target="_blank" key={article.title}>
              <NewsItem
                title={article?.title}
                time={article?.publishedAt}
                image={article?.urlToImage}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function FeaturedNewsItem({ title, time, image, category }: NewsItemProps): JSX.Element {
  return (
    <div className="relative w-full h-[300px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
      <img
        src={image}
        alt={title}
        width={800}
        height={400}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
        <h1 className="text-xl font-bold mb-2">{title}</h1>
        <div className="flex items-center space-x-2 text-sm">
          <span>{formatDistanceToNow(new Date(time))} ago</span>
        </div>
      </div>
    </div>
  )
}

function NewsItem({ title, time, image }: NewsItemProps): JSX.Element {
  return (
    <div className="flex items-start space-x-3 hover:bg-gray-200 px-4 py-2">
      <div className="flex-grow">
        <h2 className="text-md font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>{formatDistanceToNow(new Date(time))} ago</span>
        </div>
      </div>
      <img
        src={image || '/placeholder.svg'}
        alt={title}
        width={80}
        height={80}
        className="rounded-lg object-cover"
      />
    </div>
  )
}