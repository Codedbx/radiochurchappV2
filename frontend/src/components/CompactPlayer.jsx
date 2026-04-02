"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Loader2,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { usePlayerStore } from "../stores/playerStore";

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

  // Get current episode index and episodes list
  const episodes = currentMessage?.episodes || [];
  const currentEpisodeId = currentMessage?.episodeId;
  const currentIndex = episodes.findIndex((ep) => ep.id === currentEpisodeId);

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

  if (!isExpanded) {
    // Collapsed state - floating compact player icon
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-3 p-3 rounded-full bg-slate-900 hover:bg-slate-800 shadow-2xl border border-slate-800 cursor-pointer transition-all"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-violet-700 to-violet-700/70 rounded-full flex items-center justify-center overflow-hidden shrink-0">
            {currentMessage?.image && !isLiveStream ? (
              <img
                src={currentMessage.image}
                className="w-full h-full object-cover"
                alt={currentMessage.title}
              />
            ) : (
              <img src="/images/logo.png" className="w-8 h-8" alt="logo" />
            )}
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            size="icon"
            className="h-10 w-10 bg-white hover:bg-slate-100 text-slate-900 rounded-full shrink-0"
          >
            {isLoading && isPlaying ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800">
      <div className="flex items-center justify-between w-full px-6 py-4">
        {/* Left - Station Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-700 to-violet-700/70 rounded flex items-center justify-center shrink-0 overflow-hidden">
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
          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate text-white">
              {isLiveStream
                ? "Christ Embassy Nigeria"
                : currentMessage?.title || "Christ Embassy Nigeria"}
            </h3>
            <p className="text-xs text-slate-400">
              {isLiveStream
                ? "Live Radio"
                : currentMessage?.speaker || "Live Radio"}
            </p>
          </div>
        </div>

        {/* Center - Playback Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={episodes.length === 0 || currentIndex === -1}
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              onClick={togglePlayPause}
              size="icon"
              className="h-10 w-10 bg-white hover:bg-slate-100 text-slate-900 rounded-full"
            >
              {isLoading && isPlaying ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={episodes.length === 0 || currentIndex === -1}
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-slate-400 w-10 text-right">0:00</span>
            <Slider value={[0]} max={100} step={1} className="flex-1" />
            <span className="text-xs text-slate-400 w-10">
              {isLiveStream ? "Live" : "0:00"}
            </span>
          </div>
        </div>

        {/* Right - Volume Control */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <div className="w-24">
            <Slider
              value={[volume || 50]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="flex-1"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(false)}
            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
