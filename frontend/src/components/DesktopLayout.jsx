"use client";
import { Outlet, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import CompactPlayer from "./CompactPlayer";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Radio,
  Loader2,
  Phone,
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useFavoritesStore } from "../stores/favoritesStore";
import { usePlayerStore } from "../stores/playerStore";

export default function DesktopLayout({ audioProps }) {
  const { isLoggedIn } = useAuthStore();
  const { isLiveStream, currentMessage, setLiveStream } = usePlayerStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const messageId = currentMessage?.id;
  const isLiked = messageId && isFavorite(messageId);

  const toggleLike = () => {
    if (!isLoggedIn) return;
    if (isLiked) removeFavorite(messageId);
    else if (currentMessage) addFavorite(messageId, currentMessage);
  };

  return (
    <div className="container max-w-[90rem] mx-auto px-6 py-8 pb-24">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Player */}
        {isHome && (
          <div className="lg:w-96 lg:sticky lg:top-24 lg:self-start">
            <Card className="bg-white gap-0 backdrop-blur-sm border-0 shadow-xl dark:bg-slate-800/70">
              <CardHeader className="text-center pb-6">
                <div className="relative mx-auto">
                  <div className="absolute inset-0 bg-linear-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" />
                  <div className="relative h-40 w-40 flex justify-center items-center bg-linear-to-br from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30 rounded-full p-6 shadow-2xl border-4 border-white/50 dark:border-slate-700/50">
                    <img src="/images/logo.png" alt="logo" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Online Radio Church
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xs mx-auto">
                  Christ Embassy Nigeria North West Zone 1
                </p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  <span className="text-sm text-slate-500">On Air</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Now Playing Info */}
                {/* <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {isLiveStream ? "Live Stream" : currentMessage?.title}
                </h3>
                {!isLiveStream && currentMessage && (
                  <p className="text-sm text-muted-foreground">{currentMessage.speaker}</p>
                )}
              </div> */}

                {/* Play Controls */}
                <div className="flex items-center justify-center gap-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleLike}
                    className={`h-12 w-12 rounded-full transition-all duration-300 ${
                      isLiked
                        ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                    />
                  </Button>
                  <Button
                    onClick={audioProps.togglePlayPause}
                    className="w-20 h-20 rounded-full bg-linear-to-r from-violet-600 to-purple-600 shadow-2xl hover:scale-105 transition-all duration-300 hover:shadow-violet-500/25"
                  >
                    {audioProps.isLoading && audioProps.isPlaying ? (
                      <Loader2 className="h-8 w-8 text-white animate-spin" />
                    ) : audioProps.isPlaying ? (
                      <Pause className="h-8 w-8" />
                    ) : (
                      <Play className="h-8 w-8 ml-1" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={audioProps.toggleMute}
                    className="h-12 w-12 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 bg-transparent"
                  >
                    {audioProps.isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                {audioProps.error && (
                  <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {audioProps.error}
                    </p>
                  </div>
                )}

                {/* Volume Control */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>Volume</span>
                    <span>{audioProps.volume}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <VolumeX className="h-4 w-4 text-slate-400" />
                    <Slider
                      value={[audioProps.volume]}
                      max={100}
                      step={1}
                      onValueChange={audioProps.handleVolumeChange}
                      className="flex-1"
                    />
                    <Volume2 className="h-4 w-4 text-slate-400" />
                  </div>
                </div>

                {/* Call to Action */}
                <div className="space-y-3 border-t border-slate-200/50 pt-6 dark:border-slate-700/50">
                  <Button
                    variant="outline"
                    className="w-full rounded-lg border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 dark:border-green-800 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-400"
                    asChild
                  >
                    <a
                      href="tel:+2347042066472"
                      className="flex items-center justify-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Call In: +234 704 206 6472
                    </a>
                  </Button>
                </div>

                {/* Back to Live Button */}
                {!isLiveStream && (
                  <Button
                    onClick={setLiveStream}
                    variant="outline"
                    className="w-full border-violet-200 text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-400 dark:hover:bg-violet-900/20"
                  >
                    <Radio className="w-4 h-4 mr-2" />
                    Back to Live Stream
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>

      {/* Compact Player - Fixed at bottom (not on home page) */}
      {!isHome && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6">
          <div className="container max-w-[90rem] mx-auto">
            <CompactPlayer
              isPlaying={audioProps.isPlaying}
              isMuted={audioProps.isMuted}
              isLoading={audioProps.isLoading}
              togglePlayPause={audioProps.togglePlayPause}
              toggleMute={audioProps.toggleMute}
              volume={audioProps.volume}
              handleVolumeChange={audioProps.handleVolumeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
