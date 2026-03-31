"use client";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";
import { usePlayerStore } from "../stores/playerStore";

export default function MobileCompactPlayer({ audioProps }) {
  const { isPlaying, isMuted, isLoading, togglePlayPause, toggleMute } =
    audioProps;
  const { currentMessage, isLiveStream } = usePlayerStore();

  return (
    <div className="fixed bottom-16 left-0 right-0 z-50 mx-4 mb-2 rounded-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-lg border border-slate-200/50 dark:border-slate-700/50">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-700 to-violet-700/70 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
            {currentMessage?.image && !isLiveStream ? (
              <img
                src={currentMessage.image}
                className="w-full h-full object-cover"
                alt={currentMessage.title}
              />
            ) : (
              <img src="/images/logo.png" className="w-5 h-5" alt="logo" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">
              {isLiveStream
                ? "Christ Embassy Nigeria"
                : currentMessage?.title || "Christ Embassy Nigeria"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isLiveStream
                ? "Live Radio"
                : currentMessage?.speaker || "Live Radio"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-8 w-8 text-muted-foreground"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={togglePlayPause}
            size="icon"
            className="h-8 w-8 bg-primary hover:bg-primary/90 rounded-full"
          >
            {isLoading && isPlaying ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3 ml-0.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
