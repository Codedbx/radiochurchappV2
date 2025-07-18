"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, Play, Share2, Pause, Volume2, VolumeX, Heart } from "lucide-react"

export default function FullPlayer({
  isPlaying,
  togglePlayPause,
  isMuted,
  toggleMute,
  isLiked,
  toggleLike,
  likes,
}) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center">
      {/* Logo Container */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-2xl animate-pulse" />
        <div className="relative w-46 h-46 flex justify-center items-center bg-gradient-to-br from-card to-card/50 rounded-full p-4 shadow-2xl border-8 border-border/50 backdrop-blur-sm">
          <img
            src="/images/logo.png"
            alt="Christ Embassy Logo"
            className="w-32 h-32 object-contain"
          />
        </div>
      </div>
      {/* Church Info */}
      <div className="mb-8 max-w-md">
        <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Christ Embassy Nigeria
        </h1>
        <p className="text-lg text-muted-foreground mb-4">South South Zone 1</p>
        {/* Live Status */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs shadow-lg">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          Live Now
        </div>
      </div>
      {/* Main Play Controls */}
      <div className="flex items-center justify-center gap-6">
        <Button
          onClick={togglePlayPause}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-primary to-primary/80 shadow-2xl hover:scale-105 transition-all duration-300 border-4 border-white/20"
        >
          {isPlaying ? <Pause className="h-8 w-8 text-white" /> : <Play className="h-8 w-8 text-white ml-1" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="h-12 w-12 rounded-full text-muted-foreground hover:scale-110 transition-all"
        >
          {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </Button>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-8 mt-4">
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-2 h-auto py-3 px-6 rounded-2xl hover:bg-muted/50 transition-all"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="text-sm">Comment</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-2 h-auto py-3 px-6 rounded-2xl hover:bg-muted/50 transition-all"
        >
          <Share2 className="h-6 w-6" />
          <span className="text-sm">Share</span>
        </Button>
      </div>
    </div>
  )
}
