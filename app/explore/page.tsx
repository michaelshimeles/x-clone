import { Search, Settings } from 'lucide-react'

interface NewsItemProps {
  title: string
  time: string
  category: string
  posts: string
  image: string
}

export default function Explore(): JSX.Element {
  return (
    <div className="w-full border min-h-screen">
      <div className="">
        <div className='p-4'>
          <div className="flex items-center bg-white rounded-full px-4 py-2 border">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input type="text" placeholder="Search" className="flex-grow outline-none text-gray-600" />
            <Settings className="w-5 h-5 text-gray-400 ml-2" />
          </div>
        </div>

        <div className="flex justify-between space-x-6 text-sm font-medium text-gray-500 p-4">
          <span>For you</span>
          <span>Trending</span>
          <span className="text-blue-500 border-b-2 border-blue-500 pb-1">News</span>
          <span>Sports</span>
          <span>Entertainment</span>
          <span>Saved</span>
        </div>

        <div className="space-y-4">
          <NewsItem
            title="Trump's McDonald's Ice Cream Pledge"
            time="2 hours ago"
            category="Politics"
            posts="136K"
            image="https://placehold.co/80x80"
          />

          <NewsItem
            title="BC Election: Tight Race for Majority"
            time="10 hours ago"
            category="Politics"
            posts="29K"
            image="https://placehold.co/80x80"
          />

          <NewsItem
            title="Michelle Obama's Powerful Trump Critique"
            time="2 hours ago"
            category="Politics"
            posts="217K"
            image="https://placehold.co/80x80"
          />

          <NewsItem
            title="Kamala Harris Heckled at Kalamazoo Rally"
            time="3 hours ago"
            category="Politics"
            posts="86K"
            image="https://placehold.co/80x80"
          />

          <NewsItem
            title="Penn State Wrestlers Endorse Trump"
            time="1 day ago"
            category="Politics"
            posts="1.2M"
            image="https://placehold.co/80x80"
          />

          <NewsItem
            title="UN Warns of Genocide Risk in North Gaza"
            time="10 hours ago"
            category="Genocide"
            posts="292K"
            image="https://placehold.co/80x80"
          />

          <NewsItem
            title="Trump's Tariff Plan to Replace Income Tax"
            time="7 hours ago"
            category="Politics"
            posts="166K"
            image="https://placehold.co/80x80"
          />
        </div>
      </div>
    </div>
  )
}

function NewsItem({ title, time, category, posts, image }: NewsItemProps): JSX.Element {
  return (
    <div className="flex items-start space-x-3 hover:bg-gray-200 px-4 py-2">
      <div className="flex-grow">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>{time}</span>
          <span>•</span>
          <span>{category}</span>
          <span>•</span>
          <span>{posts} posts</span>
        </div>
      </div>
      <img src={image} alt={title} width={80} height={80} className="rounded-lg" />
    </div>
  )
}