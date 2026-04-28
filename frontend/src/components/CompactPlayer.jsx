"use client";

import { useState, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Loader2,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  ChevronDown,
  Radio,
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
  currentTime = 0,
  duration = 0,
  seek,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentMessage, isLiveStream, setCurrentMessage } = usePlayerStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { isLoggedIn } = useAuthStore();
  const { setAuthModalOpen } = useAppStore();

  const episodes = currentMessage?.episodes || [];
  const currentEpisodeId = currentMessage?.episodeId;
  const currentIndex = episodes.findIndex((ep) => ep.id === currentEpisodeId);
  const messageId = currentMessage?.id;
  const isLiked = messageId && isFavorite(messageId);

  // Formatting time helper
  const formatTime = (time) => {
    if (isNaN(time) || time === Infinity || time === null) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const toggleLike = () => {
    if (!isLoggedIn) { setAuthModalOpen(true); return; }
    if (isLiked) removeFavorite(messageId);
    else if (currentMessage) addFavorite(messageId, currentMessage);
  };

  const handleNext = () => {
    if (episodes.length === 0 || currentIndex === -1) return;
    const next = episodes[(currentIndex + 1) % episodes.length];
    setCurrentMessage({ ...currentMessage, title: next.title, audioUrl: next.audioUrl || currentMessage.audioUrl, episodeId: next.id });
  };

  const handlePrevious = () => {
    if (episodes.length === 0 || currentIndex === -1) return;
    const prev = episodes[currentIndex === 0 ? episodes.length - 1 : currentIndex - 1];
    setCurrentMessage({ ...currentMessage, title: prev.title, audioUrl: prev.audioUrl || currentMessage.audioUrl, episodeId: prev.id });
  };

  const handleSeek = (val) => {
    if (isLiveStream) return;
    const seekTime = (val[0] / 100) * duration;
    seek(seekTime);
  };

  const title = isLiveStream ? "Live Radio" : (currentMessage?.title || "Christ Embassy Nigeria");
  const subtitle = isLiveStream ? "Christ Embassy Nigeria" : (currentMessage?.speaker || "Online Radio Church");
  const coverImage = currentMessage?.image && !isLiveStream ? currentMessage.image : null;

  // ─── COLLAPSED: Premium floating mini-bar ───────────────────────────
  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-4 sm:right-6 z-50">
        <div
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full cursor-pointer
                     bg-slate-900/80 dark:bg-slate-950/90 backdrop-blur-2xl
                     border border-white/10 shadow-2xl shadow-black/40
                     hover:scale-105 hover:shadow-violet-900/30 transition-all duration-300
                     max-w-[260px] sm:max-w-[300px] group"
        >
          {/* Spinning Album Art / Logo */}
          <div className={`relative w-11 h-11 shrink-0 rounded-full overflow-hidden shadow-lg border-2 border-violet-500/40 ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}>
            {coverImage ? (
              <img src={coverImage} className="w-full h-full object-cover" alt="cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center">
                <Radio className="h-5 w-5 text-white" />
              </div>
            )}
          </div>

          {/* Track Info + Waveform */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-white truncate leading-tight">{title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              {isPlaying ? (
                /* Live equalizer bars */
                <div className="flex items-end gap-[2px] h-3">
                  <div className="w-[2px] bg-violet-400 rounded-full animate-[bounce_0.8s_ease-in-out_infinite]" style={{ height: '8px', animationDelay: '0ms' }} />
                  <div className="w-[2px] bg-violet-400 rounded-full animate-[bounce_0.8s_ease-in-out_infinite]" style={{ height: '12px', animationDelay: '150ms' }} />
                  <div className="w-[2px] bg-violet-400 rounded-full animate-[bounce_0.8s_ease-in-out_infinite]" style={{ height: '6px', animationDelay: '300ms' }} />
                  <div className="w-[2px] bg-violet-400 rounded-full animate-[bounce_0.8s_ease-in-out_infinite]" style={{ height: '10px', animationDelay: '100ms' }} />
                </div>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium truncate">{subtitle}</span>
              )}
            </div>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
            className="w-9 h-9 shrink-0 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center transition-all duration-200 shadow-lg shadow-violet-500/30"
          >
            {isLoading && isPlaying ? (
              <Loader2 className="h-4 w-4 text-white animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4 text-white fill-white" />
            ) : (
              <Play className="h-4 w-4 text-white fill-white ml-0.5" />
            )}
          </button>
        </div>

        {/* Progress bar under the pill */}
        {!isLiveStream && (
          <div className="mt-1.5 mx-3 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
      </div>
    );
  }

  // ─── EXPANDED: Premium full player card ─────────────────────────────
  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[320px] sm:w-[360px]">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
        
        {/* Blurred album backdrop */}
        <div className="absolute inset-0 z-0">
          {coverImage ? (
            <img src={coverImage} className="w-full h-full object-cover scale-110 blur-2xl opacity-60" alt="" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-900 via-slate-900 to-indigo-900" />
          )}
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-5">

          {/* Collapse button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10"
          >
            <ChevronDown className="h-4 w-4 text-white" />
          </button>

          {/* Live Badge / Now Playing label */}
          <div className="flex items-center gap-2 mb-4">
            {isLiveStream ? (
              <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Live Radio
              </span>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">
                Now Playing
              </span>
            )}
          </div>

          {/* Album Art + Track Info Row */}
          <div className="flex items-center gap-4 mb-5">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-xl border border-white/10 shrink-0 ${isPlaying && !isLiveStream ? 'animate-[spin_20s_linear_infinite]' : ''}`}>
              {coverImage ? (
                <img src={coverImage} className="w-full h-full object-cover" alt={title} />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center">
                  <Radio className="h-7 w-7 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className={`text-base font-bold text-white leading-tight ${title.length > 22 ? 'animate-[marquee_8s_linear_infinite]' : 'truncate'}`}>
                {title}
              </h3>
              <p className="text-sm text-slate-300/80 truncate mt-0.5">{subtitle}</p>
            </div>

            {/* Like button */}
            <button
              onClick={toggleLike}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                isLiked
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-white/10 text-slate-300 border border-white/10 hover:bg-white/20'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Progress Bar */}
          {!isLiveStream && (
            <div className="mb-4">
              <Slider
                value={[progressPercentage]}
                max={100}
                step={0.1}
                onValueChange={handleSeek}
                className="[&>span:first-child]:h-1.5 [&>span:first-child]:bg-white/15 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-white [&>span:first-child_>span]:bg-violet-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-bold tracking-tight">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* Main Controls */}
          <div className={`flex items-center ${isLiveStream ? 'justify-center' : 'justify-between'} mb-4`}>
            {!isLiveStream && (
              <button
                onClick={handlePrevious}
                disabled={episodes.length === 0}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-30"
              >
                <SkipBack className="h-5 w-5 fill-current" />
              </button>
            )}

            {/* Large play/pause */}
            <button
              onClick={togglePlayPause}
              className="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
            >
              {isLoading && isPlaying ? (
                <Loader2 className="h-7 w-7 animate-spin text-violet-600" />
              ) : isPlaying ? (
                <Pause className="h-7 w-7 fill-current" />
              ) : (
                <Play className="h-7 w-7 fill-current ml-1" />
              )}
            </button>

            {!isLiveStream && (
              <button
                onClick={handleNext}
                disabled={episodes.length === 0}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-30"
              >
                <SkipForward className="h-5 w-5 fill-current" />
              </button>
            )}
          </div>

          {/* Volume Row */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className="text-slate-400 hover:text-white transition-colors shrink-0"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <Slider
              value={[isMuted ? 0 : (volume || 80)]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="flex-1 [&>span:first-child]:h-1 [&>span:first-child]:bg-white/15 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-white [&>span:first-child_>span]:bg-violet-400"
            />
            <span className="text-[11px] text-slate-400 w-7 text-right font-bold">{volume}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
