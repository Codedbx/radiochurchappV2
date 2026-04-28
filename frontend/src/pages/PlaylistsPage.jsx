import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Play } from "lucide-react";

// Restored original data exactly as it was
const playlistsData = [
  {
    id: 1,
    title: "Worship Anthems",
    count: 15,
    image: "/images/house-exterior.jpg",
    description: "Powerful worship songs to lift your spirit",
    duration: "1h 23m",
    isOwned: true,
  },
  {
    id: 2,
    title: "Healing Declarations",
    count: 10,
    image: "/images/house-exterior.jpg",
    description: "Messages of healing and restoration",
    duration: "2h 15m",
    isOwned: false,
  },
  {
    id: 3,
    title: "Prosperity Teachings",
    count: 8,
    image: "/images/house-exterior.jpg",
    description: "Learn about God's plan for your prosperity",
    duration: "1h 45m",
    isOwned: true,
  },
  {
    id: 4,
    title: "Youth Empowerment",
    count: 12,
    image: "/images/house-exterior.jpg",
    description: "Inspiring messages for young believers",
    duration: "2h 30m",
    isOwned: false,
  },
];

const sortOptions = [
  { value: "a-z", label: "A-Z" },
  { value: "z-a", label: "Z-A" },
  { value: "recent", label: "Recently Added" },
  { value: "oldest", label: "Oldest First" },
];

export default function PlaylistsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("playlists");
  const [sortOrder, setSortOrder] = useState("a-z");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortChange = (value) => {
    setSortOrder(value);
    setIsDropdownOpen(false);
  };

  const filteredPlaylists = playlistsData
    .filter((playlist) => {
      if (activeTab === "owned") {
        return playlist.isOwned;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "a-z") return a.title.localeCompare(b.title);
      if (sortOrder === "z-a") return b.title.localeCompare(a.title);
      if (sortOrder === "recent") return b.id - a.id;
      if (sortOrder === "oldest") return a.id - b.id;
      return 0;
    });

  return (
    <div className="min-h-screen py-6 sm:py-10 px-4 md:px-8 bg-slate-50 dark:bg-transparent">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 px-1 tracking-tight">
          Playlists
        </h1>

        {/* Filters and Navigation */}
        <div className="flex flex-row items-center gap-4 mb-8 ml-1">
          {/* Distinct Tab Navigation matching the screenshot spacing */}
          <div className="flex items-center gap-3 w-fit">
            <button
              onClick={() => setActiveTab("playlists")}
              className={`px-6 py-2 rounded-[5px] text-[13px] font-semibold transition-all shadow-sm ${
                activeTab === "playlists"
                  ? "bg-slate-300 text-slate-900 border border-slate-400 dark:bg-[#455073] dark:border-transparent dark:text-gray-100"
                  : "bg-slate-100 text-slate-600 border border-slate-200 dark:border-transparent dark:bg-[#1a2130] dark:text-slate-400 hover:bg-slate-200 dark:hover:text-white"
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => setActiveTab("owned")}
              className={`px-6 py-2 rounded-[5px] text-[13px] font-semibold transition-all shadow-sm ${
                activeTab === "owned"
                  ? "bg-slate-300 text-slate-900 border border-slate-400 dark:bg-[#455073] dark:border-transparent dark:text-gray-100"
                  : "bg-slate-100 text-slate-600 border border-slate-200 dark:border-transparent dark:bg-[#1a2130] dark:text-slate-400 hover:bg-slate-200 dark:hover:text-white"
              }`}
            >
              Latest
            </button>
          </div>
        </div>

        {/* Main Grid: 1 Column on Mobile for that massive cinematic feel from the screenshot */}
        {filteredPlaylists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-12 sm:gap-x-4 sm:gap-y-10">
            {filteredPlaylists.map((playlist) => (
              <div 
                key={playlist.id} 
                className="group/card cursor-pointer flex flex-col relative"
                onClick={() => navigate(`/playlist/${playlist.id}`, { state: { playlist } })}
              >
                {/* 
                  Stacked Images Concept exactly matching mobile 1-column 5-slice format
                  Aspect ratio 2/1 creates the ultra-wide cinematic banner on mobile
                */}
                <div className="relative aspect-[16/9] sm:aspect-[4/3] w-full rounded-md bg-transparent overflow-hidden">
                  
                  {/* Repeated 5 times to simulate the 5 UI slices from the new screenshot */}
                  {[...Array(5)].map((_, i) => {
                    // Mathematically perfect fit: 4 gaps of 16.25% + 1 width of 35% = 100% Container Fill
                    const leftOffset = i * 16.25; 
                    const zIndexes = [50, 40, 30, 20, 10]; // Leftmost is fully in front
                    return (
                      <div
                        key={i}
                        className="absolute inset-y-0 overflow-hidden transition-transform duration-300 ease-out group-hover/card:-translate-y-1.5 rounded-sm"
                        style={{
                          width: "35%", // Each slice is 35% wide
                          left: `${leftOffset}%`,
                          zIndex: zIndexes[i],
                          // Deep shadow to the right so it casts over the panel behind it
                          boxShadow: i < 4 ? "4px 0px 15px -3px rgba(0,0,0,0.8)" : "none",
                        }}
                      >
                        {/* Slight darkening overlay on cards further back for depth */}
                        <div className={`absolute inset-0 z-10 transition-colors duration-300 pointer-events-none ${i === 0 ? 'bg-transparent group-hover/card:bg-black/10' : 'bg-black/20 group-hover/card:bg-black/5'}`} />
                        <img
                          src={playlist.image}
                          alt={`${playlist.title} frame ${i+1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Text Meta Content aligned to exactly match the 3 clean lines in the screenshot */}
                <div className="flex flex-col mt-3 px-1">
                  <h3 className="font-extrabold text-[15px] sm:text-[16px] text-slate-900 dark:text-gray-50 truncate tracking-wide">
                    {playlist.title}
                  </h3>
                  
                  <div className="text-[13px] sm:text-[14px] text-slate-600 dark:text-slate-300 mt-1 font-medium">
                    {playlist.count} Messages
                  </div>
                  
                  <div className="text-[13px] sm:text-[14px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
                    By Radio Church
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/50 dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2">No lists found</h3>
          </div>
        )}
      </div>
    </div>
  );
}
