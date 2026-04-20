import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Play,
  Heart,
  MoreVertical,
  Clock,
  Music,
  ListMusic,
  Search,
  ChevronDown,
  Check,
} from "lucide-react";

// Actual playlists data from HomePage
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
      // Filter by tab
      let matchesTab = true;
      if (activeTab === "owned") {
        matchesTab = playlist.isOwned;
      }
      // "playlists" tab shows all playlists

      return matchesTab;
    })
    .sort((a, b) => {
      if (sortOrder === "a-z") {
        return a.title.localeCompare(b.title);
      } else if (sortOrder === "z-a") {
        return b.title.localeCompare(a.title);
      } else if (sortOrder === "recent") {
        return b.id - a.id; // Higher IDs are more recent
      } else if (sortOrder === "oldest") {
        return a.id - b.id; // Lower IDs are oldest
      }
      return 0;
    });

  return (
    <div className="min-h-screen pb-20 md:pb-6">
      {/* Header */}
      <div className="px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-violet-600/20 dark:bg-violet-900/30 backdrop-blur-md flex items-center justify-center border border-violet-500/30 shrink-0">
              <ListMusic className="h-7 w-7 md:h-8 md:w-8 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                Playlists
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-xs md:text-base">
                Curated collections of messages and teachings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        {/* Tabs */}
        <div className="sticky top-0 z-20 py-4 -mt-4 flex items-center gap-2 mb-6">
          {/* A-Z Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-all text-sm font-medium cursor-pointer"
            >
              <span>
                {sortOptions.find((opt) => opt.value === sortOrder)?.label}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full mt-2 left-0 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Playlists Tab */}
          <button
            onClick={() => setActiveTab("playlists")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all text-sm cursor-pointer ${
              activeTab === "playlists"
                ? "bg-white dark:bg-slate-200 text-slate-900 shadow-md"
                : "bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-700 dark:hover:bg-slate-600"
            }`}
          >
            Playlists
          </button>

          {/* Owned Tab */}
          <button
            onClick={() => setActiveTab("owned")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all text-sm cursor-pointer ${
              activeTab === "owned"
                ? "bg-white dark:bg-slate-200 text-slate-900 shadow-md"
                : "bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-700 dark:hover:bg-slate-600"
            }`}
          >
            Owned
          </button>
        </div>

        {/* Playlists Grid */}
        {filteredPlaylists.length > 0 ? (
          <div className="space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {filteredPlaylists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => {
                  console.log("Card clicked, navigating to playlist detail");
                  navigate(`/playlist/${playlist.id}`, {
                    state: { playlist },
                  });
                }}
                className="cursor-pointer"
              >
                {/* Desktop Card View */}
                <Card className="hidden md:block group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-0">
                  <div className="relative">
                    {/* Stacked Card Effect */}
                    <div className="absolute inset-x-2 top-0 h-full translate-y-3 rounded-t-lg bg-slate-200 dark:bg-slate-700 opacity-60" />
                    <div className="absolute inset-x-1 top-0 h-full translate-y-1.5 rounded-t-lg bg-slate-300 dark:bg-slate-600 opacity-80" />

                    {/* Main Image */}
                    <div className="relative z-10">
                      <img
                        src={playlist.image}
                        alt={playlist.title}
                        className="w-full h-48 object-cover"
                      />

                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="icon"
                          className="w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle play
                          }}
                        >
                          <Play className="h-6 w-6 ml-0.5" />
                        </Button>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {playlist.isOwned && (
                          <span className="px-2 py-1 bg-violet-600/90 backdrop-blur-md text-white text-xs rounded-full border border-white/20 font-medium">
                            Owned
                          </span>
                        )}
                      </div>

                      {/* Count Badge */}
                      <div className="absolute bottom-3 right-3 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white text-xs rounded-full border border-white/20 flex items-center gap-1">
                        <Music className="h-3 w-3" />
                        {playlist.count} tracks
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate mb-1">
                          {playlist.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                          {playlist.description}
                        </p>
                      </div>
                      <button
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle more options
                        }}
                      >
                        <MoreVertical className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                        <Clock className="h-3 w-3" />
                        {playlist.duration}
                      </div>
                      <button
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition group/heart"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle favorite
                        }}
                      >
                        <Heart className="h-4 w-4 text-slate-400 group-hover/heart:text-red-500 group-hover/heart:fill-red-500 transition" />
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* Mobile List View */}
                <div className="md:hidden flex gap-3 py-2">
                  {/* Thumbnail */}
                  <div className="relative shrink-0 w-40 h-24 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700">
                    <img
                      src={playlist.image}
                      alt={playlist.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Track count badge */}
                    <div className="absolute bottom-1 right-1 bg-slate-900/90 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                      <Music className="h-3 w-3" />
                      {playlist.count}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-semibold text-base text-slate-900 dark:text-white line-clamp-2 mb-1">
                      {playlist.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      {playlist.isOwned && (
                        <>
                          <span>Private</span>
                          <span>•</span>
                        </>
                      )}
                      <span>Playlist</span>
                    </div>
                  </div>

                  {/* More options */}
                  <button
                    className="p-2 shrink-0 self-start"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle more options
                    }}
                  >
                    <MoreVertical className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ListMusic className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No playlists found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              No playlists available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
