export default function ExploreSection() {
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
    <div className="hidden md:block bg-white rounded-2xl p-4 border">
      <div className="items-center justify-between mb-3 hidden m:flex">
        <h1 className="text-[23px] font-bold">Explore</h1>
        <span className="px-2 py-1 text-xs font-medium bg-[#FFF4EE] text-[#CD6C3B] rounded">Beta</span>
      </div>

      <div className="space-y-4">
        {exploreItems.map((item, index) => (
          <div key={index} className="cursor-pointer hover:bg-gray-50 -mx-4 px-4 py-3">
            <div className="flex items-start justify-between w-full">
              <div className="flex-row">
                <h2 className="font-bold text-[15px] mb-1">{item.title}</h2>
                <p className="text-gray-500 text-sm">{item.metadata}</p>
              </div>
              {/* <div className="hidden md:block -space-x-2 ml-4">
                {item.avatars.map((avatar, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"
                  />
                ))}
              </div> */}
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