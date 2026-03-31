import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Calendar,
  List,
  Pause,
  MessageCircle,
} from "lucide-react";

export default function MessageDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const { setCurrentMessage } = usePlayerStore();
  const { isLoggedIn } = useAuthStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { openAuthModal } = useAppStore();

  // Get message from navigation state
  const passedMessage = location.state?.message;

  // If no message passed, redirect back to messages page
  if (!passedMessage) {
    navigate("/messages");
    return null;
  }

  const message = {
    ...passedMessage,
    id: id || passedMessage.id,
  };

  const isLiked = isFavorite(message.id);

  const handleToggleFavorite = () => {
    if (!isLoggedIn) {
      openAuthModal("login");
      return;
    }
    if (isLiked) {
      removeFavorite(message.id);
    } else {
      addFavorite(message.id, message);
    }
  };

  const handlePlayEpisode = (episode) => {
    // Create a message object for the episode
    const episodeMessage = {
      ...message,
      title: episode.title,
      audioUrl: episode.audioUrl || message.audioUrl, // Use episode audio if available
      episodeId: episode.id,
    };
    setCurrentMessage(episodeMessage);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700/40">
        <button
          onClick={() => navigate("/messages")}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition text-slate-700 dark:text-slate-300">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition text-slate-700 dark:text-slate-300">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-5xl mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-8">
        {/* Message Info */}
        <div className="flex gap-4 md:gap-6">
          <div className="relative shrink-0">
            <img
              src={message.image}
              alt={message.title}
              className="w-24 h-24 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-lg object-cover shadow-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs md:text-sm px-2 py-1 rounded flex items-center gap-1">
              <Play className="h-3 w-3 md:h-4 md:w-4" />
              {message.episodes?.length || 0}
            </div>
          </div>
          <div className="flex-1 min-w-0 md:flex md:flex-col md:justify-center">
            <h1 className="text-lg md:text-3xl lg:text-4xl font-bold mb-1 md:mb-3">
              {message.title}
            </h1>
            <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 mb-2 md:mb-4">
              {message.speaker}
            </p>
            <span className="inline-block px-2 md:px-4 py-1 md:py-1.5 bg-slate-100 dark:bg-violet-900/30 border border-slate-200 dark:border-violet-800 text-slate-700 dark:text-violet-400 rounded-full text-xs md:text-base w-fit">
              {message.category}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
          {message.description}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 md:gap-4">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex-1 md:max-w-md bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white h-11 md:h-14 text-base md:text-xl rounded-full shadow-lg md:font-semibold"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 md:h-6 md:w-6 mr-2" />
            ) : (
              <Play className="h-4 w-4 md:h-6 md:w-6 mr-2" />
            )}
            Play all
          </Button>
          <button
            onClick={handleToggleFavorite}
            className={`p-2.5 md:p-4 rounded-full transition shrink-0 ${
              isLiked
                ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Heart
              className={`h-5 w-5 md:h-6 md:w-6 ${isLiked ? "fill-current" : ""}`}
            />
          </button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="episodes" className="w-full">
          <div className="border-b border-slate-200 dark:border-slate-700/40 -mx-4 rounded-sm">
            <TabsList className="grid h-12 md:h-16 w-full grid-cols-2 rounded-none border-0 bg-transparent p-0 px-4">
              <TabsTrigger
                value="episodes"
                className="relative rounded-none px-2 md:px-6 py-3 text-sm md:text-lg text-center transition-colors duration-200 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-b-violet-500 hover:text-violet-500 dark:hover:text-violet-400 data-[state=active]:bg-transparent"
              >
                Episodes {message.episodes?.length || 0}
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className="relative rounded-none px-2 md:px-6 py-3 text-sm md:text-lg text-center transition-colors duration-200 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-b-violet-500 hover:text-violet-500 dark:hover:text-violet-400 data-[state=active]:bg-transparent"
              >
                Comments 2
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Episodes Tab */}
          <TabsContent
            value="episodes"
            className="mt-3 md:mt-6 space-y-2 md:space-y-4"
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="flex items-center gap-2 md:gap-3">
                <button className="p-2 md:p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition text-slate-700 dark:text-slate-300">
                  <List className="h-4 w-4 md:h-6 md:w-6" />
                </button>
              </div>
            </div>

            {message.episodes && message.episodes.length > 0 ? (
              message.episodes.map((episode) => (
                <Card
                  key={episode.id}
                  className="p-3 md:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                  onClick={() => handlePlayEpisode(episode)}
                >
                  <div className="flex items-start justify-between gap-2 md:gap-4">
                    <div className="flex items-start gap-2 md:gap-4 flex-1 min-w-0">
                      <span className="text-base md:text-xl font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                        {episode.id}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm md:text-lg">
                          {episode.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-base text-slate-600 dark:text-slate-400 mt-1 md:mt-2">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 md:h-4 md:w-4" />
                            {episode.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                            {episode.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="p-2 md:p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition text-slate-700 dark:text-slate-300 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayEpisode(episode);
                      }}
                    >
                      <Play className="h-4 w-4 md:h-6 md:w-6" />
                    </button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <List className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  No episodes available yet.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="mt-4">
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                No comments yet. Be the first to comment!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
