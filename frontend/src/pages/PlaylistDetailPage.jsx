import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePlayerStore } from "@/stores/playerStore";
import { useAuthStore } from "@/stores/authStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useAppStore } from "@/stores/appStore";
import {
  ArrowLeft,
  Share2,
  MoreVertical,
  Play,
  Heart,
  Clock,
  Music,
  Pause,
  ListMusic,
} from "lucide-react";

export default function PlaylistDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const { setCurrentMessage, isPlaying: playerIsPlaying } = usePlayerStore();
  const { isLoggedIn } = useAuthStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { openAuthModal } = useAppStore();

  // Get playlist from navigation state
  const passedPlaylist = location.state?.playlist;

  // If no playlist passed, redirect back to playlists page
  useEffect(() => {
    if (!passedPlaylist) {
      navigate("/playlists");
    }
  }, [passedPlaylist, navigate]);

  // Show loading or null while redirecting
  if (!passedPlaylist) {
    return null;
  }

  const playlist = {
    ...passedPlaylist,
    id: id || passedPlaylist.id,
  };

  // Sample tracks for the playlist - using real messages from the app
  const tracks = [
    {
      id: 1,
      title: "Faith in Action",
      speaker: "Pastor John",
      duration: "25:30",
      date: "Mar 12, 2024",
      audioUrl: "https://example.com/faith-in-action.mp3",
      image: "/images/house-exterior.jpg",
      category: "Faith",
      description:
        "Discover how to put your faith into action in everyday life through practical examples and biblical teachings.",
    },
    {
      id: 2,
      title: "The Power of Prayer",
      speaker: "Pastor Mary",
      duration: "22:45",
      date: "Mar 10, 2024",
      audioUrl: "https://example.com/power-of-prayer.mp3",
      image: "/images/house-exterior.jpg",
      category: "Spirituality",
      description:
        "Learn about the transformative power of prayer and how to develop a deeper prayer life.",
    },
    {
      id: 3,
      title: "Living in Grace",
      speaker: "Pastor Chris",
      duration: "24:20",
      date: "Mar 8, 2024",
      audioUrl: "https://example.com/living-in-grace.mp3",
      image: "/images/house-exterior.jpg",
      category: "Life",
      description:
        "Explore what it means to live in God's grace and how it transforms our daily walk.",
    },
    {
      id: 4,
      title: "God's Love Revealed",
      speaker: "Pastor John",
      duration: "30:15",
      date: "Mar 5, 2024",
      audioUrl: "https://example.com/gods-love.mp3",
      image: "/images/house-exterior.jpg",
      category: "Theology",
      description:
        "A deep dive into understanding the depth and breadth of God's unconditional love for us.",
    },
    {
      id: 5,
      title: "Breaking Free",
      speaker: "Pastor Sarah",
      duration: "26:50",
      date: "Mar 1, 2024",
      audioUrl: "https://example.com/breaking-free.mp3",
      image: "/images/house-exterior.jpg",
      category: "Deliverance",
      description:
        "Find freedom from bondage and discover the liberty that comes through Christ.",
    },
  ];

  const isLiked = isFavorite(playlist.id);

  const handleToggleFavorite = () => {
    if (!isLoggedIn) {
      openAuthModal("login");
      return;
    }
    if (isLiked) {
      removeFavorite(playlist.id);
    } else {
      addFavorite(playlist.id, playlist);
    }
  };

  const handlePlayTrack = (track) => {
    const trackMessage = {
      id: track.id,
      title: track.title,
      speaker: track.speaker,
      audioUrl: track.audioUrl,
      image: playlist.image,
      category: "Playlist Track",
      description: `From ${playlist.title}`,
    };
    setCurrentMessage(trackMessage);
  };

  const handlePlayAll = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && tracks.length > 0) {
      handlePlayTrack(tracks[0]);
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-6 overflow-visible">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center px-4 py-3">
        <button
          onClick={() => navigate("/playlists")}
          className="p-2 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-full transition text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block w-full max-w-7xl mx-auto px-4 overflow-visible">
        <div className="grid grid-cols-[380px_1fr] gap-6 items-start overflow-visible min-h-screen">
          {/* Left Column - Playlist Info Card */}
          <div className="bg-slate-800 dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl pb-20">
            <div className="sticky top-4 z-10">
              <div className="relative">
                <img
                  src={playlist.image}
                  alt={playlist.title}
                  className="w-full aspect-square object-cover"
                />
              </div>

              <div className="p-6">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {playlist.title}
                </h1>
                <p className="text-slate-400 text-sm mb-4">
                  {playlist.description}
                </p>

                <div className="flex items-center gap-3 text-sm text-slate-400 mb-6">
                  <span className="flex items-center gap-1">
                    <Music className="h-4 w-4" />
                    {playlist.count} tracks
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {playlist.duration}
                  </span>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handlePlayAll}
                    className="w-full bg-white hover:bg-slate-100 text-slate-900 h-12 text-base rounded-full shadow-lg font-semibold"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 mr-2" />
                    ) : (
                      <Play className="h-5 w-5 mr-2" />
                    )}
                    Play all
                  </Button>

                  <button
                    onClick={handleToggleFavorite}
                    className={`w-full flex items-center justify-center gap-2 h-12 rounded-full font-semibold transition ${
                      isLiked
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-slate-700 hover:bg-slate-600 text-white"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                    />
                    {isLiked ? "Liked" : "Like"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tracks List */}
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {playlist.count} Messages
              </h2>
            </div>

            {/* Tracks */}
            <div className="space-y-2">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  className="flex gap-4 p-3 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition cursor-pointer group"
                  onClick={() => handlePlayTrack(track)}
                >
                  {/* Thumbnail */}
                  <div className="relative shrink-0 w-40 h-24 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700">
                    <img
                      src={track.image}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Duration badge */}
                    <div className="absolute bottom-1 right-1 bg-slate-900/90 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded font-medium">
                      {track.duration}
                    </div>
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        <Play className="h-5 w-5 text-slate-900 ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1 line-clamp-2">
                      {track.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span>{track.speaker}</span>
                      <span>•</span>
                      <span>{track.date}</span>
                    </div>
                  </div>

                  {/* More options */}
                  <button
                    className="p-2 opacity-0 group-hover:opacity-100 transition shrink-0 self-start"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle more options
                    }}
                  >
                    <MoreVertical className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden w-full max-w-5xl mx-auto px-4 py-4 md:py-8 space-y-4">
        {/* Playlist Header */}
        <div className="flex gap-4">
          <div className="relative shrink-0">
            <img
              src={playlist.image}
              alt={playlist.title}
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover shadow-lg"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <ListMusic className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              <span className="text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wide">
                Playlist
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold mb-2 text-slate-900 dark:text-white">
              {playlist.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Music className="h-3 w-3" />
                {playlist.count} tracks
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {playlist.duration}
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {playlist.description}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handlePlayAll}
            className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white h-14 text-base rounded-full shadow-lg font-semibold"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 mr-2" />
            ) : (
              <Play className="h-5 w-5 mr-2" />
            )}
            Play all
          </Button>
          <button
            onClick={handleToggleFavorite}
            className={`p-4 rounded-full transition shrink-0 ${
              isLiked
                ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800/50"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
            }`}
          >
            <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Tracks List */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {playlist.count} Messages
          </h2>
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className="flex gap-3 p-3 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition cursor-pointer group"
              onClick={() => handlePlayTrack(track)}
            >
              {/* Thumbnail */}
              <div className="relative shrink-0 w-32 h-20 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700">
                <img
                  src={track.image}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
                {/* Duration badge */}
                <div className="absolute bottom-1 right-1 bg-slate-900/90 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded font-medium">
                  {track.duration}
                </div>
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <Play className="h-4 w-4 text-slate-900 ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1 line-clamp-2">
                  {track.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span>{track.speaker}</span>
                  <span>•</span>
                  <span>{track.date}</span>
                </div>
              </div>

              {/* More options */}
              <button
                className="p-2 opacity-0 group-hover:opacity-100 transition shrink-0 self-start"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle more options
                }}
              >
                <MoreVertical className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
