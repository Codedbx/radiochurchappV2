"use client";
import { Button } from "@/components/ui/button";
import { Play, Pause, Heart, Loader2 } from "lucide-react";
import { usePlayerStore } from "../stores/playerStore";
import { useAuthStore } from "../stores/authStore";
import { useFavoritesStore } from "../stores/favoritesStore";
import { useAppStore } from "../stores/appStore";

export default function MobileCompactPlayer({ audioProps }) {
  const { isPlaying, isLoading, togglePlayPause } = audioProps;
  const { currentMessage, isLiveStream } = usePlayerStore();
  const { isLoggedIn } = useAuthStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { openAuthModal } = useAppStore();

  const messageId = currentMessage?.id;
  const isLiked = messageId && isFavorite(messageId);

  const handleToggleFavorite = () => {
    if (!isLoggedIn) {
      openAuthModal("login");
      return;
    }
    if (isLiked) {
      removeFavorite(messageId);
    } else if (currentMessage) {
      addFavorite(messageId, currentMessage);
    }
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 z-50 mx-4 mb-2">
      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 backdrop-blur-md shadow-2xl border border-slate-800">
        {/* Album Art */}
        <div className="w-14 h-14 bg-gradient-to-br from-violet-700 to-violet-700/70 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
          {currentMessage?.image && !isLiveStream ? (
            <img
              src={currentMessage.image}
              className="w-full h-full object-cover"
              alt={currentMessage.title}
            />
          ) : (
            <img src="/images/logo.png" className="w-10 h-10" alt="logo" />
          )}
        </div>

        {/* Title and Subtitle */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate text-white">
            {isLiveStream
              ? "Christ Embassy Nigeria"
              : currentMessage?.title || "Christ Embassy Nigeria"}
          </p>
          <p className="text-xs text-slate-400">
            {isLiveStream
              ? "Live Radio"
              : currentMessage?.speaker || "Live Radio"}
          </p>
        </div>

        {/* Heart Icon */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleFavorite}
          className={`h-10 w-10 shrink-0 ${
            isLiked
              ? "text-red-500 hover:text-red-600 hover:bg-slate-800"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
        </Button>

        {/* Play/Pause Button */}
        <Button
          onClick={togglePlayPause}
          size="icon"
          variant="ghost"
          className="h-10 w-10 text-white hover:bg-slate-800 shrink-0"
        >
          {isLoading && isPlaying ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" />
          )}
        </Button>
      </div>
    </div>
  );
}
