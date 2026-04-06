"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Loader2,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  Heart,
  ChevronDown,
} from "lucide-react";
import { usePlayerStore } from "../stores/playerStore";
import { useFavoritesStore } from "../stores/favoritesStore";
import { useAuthStore } from "../stores/authStore";
import { useAppStore } from "../stores/appStore";

export default function CompactPlayer({
  isPlaying,
  isMuted,
  isLoading,
  togglePlayPause,
  toggleMute,
  volume,
  handleVolumeChange,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentMessage, isLiveStream, setCurrentMessage } = usePlayerStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { isLoggedIn } = useAuthStore();
  const { setAuthModalOpen } = useAppStore();

  // Get current episode index and episodes list
  const episodes = currentMessage?.episodes || [];
  const currentEpisodeId = currentMessage?.episodeId;
  const currentIndex = episodes.findIndex((ep) => ep.id === currentEpisodeId);

  const messageId = currentMessage?.id;
  const isLiked = messageId && isFavorite(messageId);

  const toggleLike = () => {
    if (!isLoggedIn) {
      setAuthModalOpen(true);
      return;
    }
    if (isLiked) {
      removeFavorite(messageId);
    } else if (currentMessage) {
      addFavorite(messageId, currentMessage);
    }
  };

  const handleNext = () => {
    if (episodes.length === 0 || currentIndex === -1) return;

    const nextIndex = (currentIndex + 1) % episodes.length;
    const nextEpisode = episodes[nextIndex];

    const episodeMessage = {
      ...currentMessage,
      title: nextEpisode.title,
      audioUrl: nextEpisode.audioUrl || currentMessage.audioUrl,
      episodeId: nextEpisode.id,
    };
    setCurrentMessage(episodeMessage);
  };

  const handlePrevious = () => {
    if (episodes.length === 0 || currentIndex === -1) return;

    const prevIndex =
      currentIndex === 0 ? episodes.length - 1 : currentIndex - 1;
    const prevEpisode = episodes[prevIndex];

    const episodeMessage = {
      ...currentMessage,
      title: prevEpisode.title,
      audioUrl: prevEpisode.audioUrl || currentMessage.audioUrl,
      episodeId: prevEpisode.id,
    };
    setCurrentMessage(episodeMessage);
  };

  // Collapsed state - small icon with album art
  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div
          onClick={() => setIsExpanded(true)}
          className="relative h-16 w-16 rounded-full shadow-2xl border-4 border-slate-700 cursor-pointer hover:scale-105 transition-transform overflow-hidden"
        >
          {/* Album Art Background */}
          {currentMessage?.image && !isLiveStream ? (
            <img
              src={currentMessage.image}
              className="w-full h-full object-cover"
              alt={currentMessage.title}
            />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <img src="/images/logo.png" className="w-8 h-8" alt="logo" />
            </div>
          )}

          {/* Play/Pause Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            {isLoading && isPlaying ? (
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 text-white ml-0.5" />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Expanded state - full player
  return (
    <div className="fixed bottom-6 right-6 z-50 w-96">
      <div className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-slate-700/30 relative before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-slate-800/20 before:to-transparent before:pointer-events-none">
        {/* Close/Collapse Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(false)}
          className="absolute -top-2 -right-2 h-8 w-8 bg-slate-800/90 backdrop-blur-md hover:bg-slate-700 text-white rounded-full border border-slate-600/50 z-10"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>

        {/* Album Art and Title */}
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className="w-16 h-16 bg-slate-800/60 backdrop-blur-sm rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-lg border border-slate-700/40">
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
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate text-white drop-shadow-lg">
              {isLiveStream
                ? "Christ Embassy Nigeria"
                : currentMessage?.title || "Christ Embassy Nigeria"}
            </h3>
            <p className="text-sm text-slate-200/90 truncate drop-shadow-md">
              {isLiveStream
                ? "Live Radio"
                : currentMessage?.speaker || "Live Radio"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLike}
            className={`h-10 w-10 shrink-0 ${
              isLiked
                ? "text-red-400 hover:text-red-300"
                : "text-slate-200 hover:text-white"
            } hover:bg-slate-800/60 backdrop-blur-sm`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          {!isLiveStream && (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-slate-200 hover:text-white hover:bg-slate-800/60 backdrop-blur-sm"
            >
              <Shuffle className="h-5 w-5" />
            </Button>
          )}
          {!isLiveStream && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={episodes.length === 0 || currentIndex === -1}
              className="h-10 w-10 text-slate-200 hover:text-white hover:bg-slate-800/60 backdrop-blur-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <SkipBack className="h-6 w-6" />
            </Button>
          )}
          <Button
            onClick={togglePlayPause}
            size="icon"
            className={`h-14 w-14 bg-white/95 hover:bg-white text-slate-900 rounded-full shadow-lg backdrop-blur-sm ${
              isLiveStream ? "mx-auto" : ""
            }`}
          >
            {isLoading && isPlaying ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-7 w-7" />
            ) : (
              <Play className="h-7 w-7 ml-0.5" />
            )}
          </Button>
          {!isLiveStream && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={episodes.length === 0 || currentIndex === -1}
              className="h-10 w-10 text-slate-200 hover:text-white hover:bg-slate-800/60 backdrop-blur-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <SkipForward className="h-6 w-6" />
            </Button>
          )}
          {!isLiveStream && (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-slate-200 hover:text-white hover:bg-slate-800/60 backdrop-blur-sm"
            >
              <Repeat className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 relative z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-8 w-8 text-slate-200 hover:text-white hover:bg-slate-800/60 backdrop-blur-sm"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
          <Slider
            value={[volume || 50]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
          <span className="text-xs text-slate-200/90 w-8 text-right drop-shadow-md">
            {volume}%
          </span>
        </div>
      </div>
    </div>
  );
}
