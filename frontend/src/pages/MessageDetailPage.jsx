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
  Send,
  ArrowRight,
} from "lucide-react";

export default function MessageDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "John Doe",
      avatar: "JD",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      time: "2 mins ago",
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "JS",
      text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      time: "5 mins ago",
    },
  ]);
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
      audioUrl: episode.audioUrl || message.audioUrl,
      episodeId: episode.id,
    };
    setCurrentMessage(episodeMessage);
  };

  const handlePlayAll = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setCurrentMessage(message);
    }
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;

    if (!isLoggedIn) {
      openAuthModal("login");
      return;
    }

    const newComment = {
      id: Date.now(),
      name: "You",
      avatar: "Y",
      text: commentText,
      time: "Just now",
    };

    setComments([newComment, ...comments]);
    setCommentText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/40">
        <button
          onClick={() => navigate("/messages")}
          className="p-2 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-full transition text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-full transition text-slate-700 dark:text-slate-300">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-full transition text-slate-700 dark:text-slate-300">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block w-full max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-[1fr_380px] gap-6">
          {/* Left Column - Video/Player & Info */}
          <div className="space-y-6">
            {/* Large Video Player */}
            <div className="relative w-full aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={message.image}
                alt={message.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-red-600 text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-2 font-semibold">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                LIVE
              </div>
              <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-1 border border-white/10">
                <Play className="h-4 w-4" />
                {message.episodes?.length || 0} Episodes
              </div>
            </div>

            {/* Message Info Card */}
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-slate-200/50 dark:border-slate-700/30">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-violet-900/50 border border-purple-200 dark:border-violet-700/50 text-purple-700 dark:text-violet-300 rounded-full text-xs font-medium mb-3 backdrop-blur-sm">
                    {message.category}
                  </span>
                  <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
                    {message.title}
                  </h1>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                        {message.speaker?.charAt(0) || "P"}
                      </span>
                    </div>
                    <p className="text-base text-slate-700 dark:text-slate-300 font-medium">
                      {message.speaker}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleToggleFavorite}
                  className={`p-3 rounded-full transition shrink-0 backdrop-blur-sm ${
                    isLiked
                      ? "bg-red-100/80 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200/80 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800/50"
                      : "bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/50"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                  />
                </button>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                {message.description}
              </p>

              <Button
                onClick={handlePlayAll}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white h-12 text-base rounded-full shadow-lg font-semibold"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 mr-2" />
                ) : (
                  <Play className="h-5 w-5 mr-2" />
                )}
                Play all
              </Button>
            </div>

            {/* Episodes List */}
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-slate-200/50 dark:border-slate-700/30">
              <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                Episodes ({message.episodes?.length || 0})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {message.episodes && message.episodes.length > 0 ? (
                  message.episodes.map((episode) => (
                    <Card
                      key={episode.id}
                      className="p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/70 transition cursor-pointer border border-slate-200/50 dark:border-slate-700/30 rounded-2xl shadow-sm"
                      onClick={() => handlePlayEpisode(episode)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-violet-900/50 flex items-center justify-center shrink-0 border border-purple-200 dark:border-violet-700/50">
                            <span className="text-sm font-bold text-purple-700 dark:text-violet-300">
                              {episode.id}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1">
                              {episode.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {episode.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {episode.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          className="p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-full transition shrink-0 shadow-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayEpisode(episode);
                          }}
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <List className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      No episodes available yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Live Chat */}
          <div className="sticky top-24 self-start">
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/30 overflow-hidden h-[calc(100vh-120px)] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/40">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Live Chat
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <MessageCircle className="h-4 w-4" />
                    <span>
                      {comments.length}{" "}
                      {comments.length === 1 ? "person" : "people"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                        {comment.avatar}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {comment.name}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {comment.time}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/40">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a comment..."
                      className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 rounded-full text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <button
                    onClick={handleSendComment}
                    disabled={!commentText.trim()}
                    className="p-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-full transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Recommended Playlists */}
              <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/40 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Recommended Playlists
                  </h3>
                  <button className="text-xs text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
                    See more
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden w-full max-w-5xl mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-8">
        <div className="flex gap-4 md:gap-6">
          <div className="relative shrink-0">
            <img
              src={message.image}
              alt={message.title}
              className="w-24 h-24 md:w-56 md:h-56 rounded-lg object-cover shadow-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs md:text-sm px-2 py-1 rounded flex items-center gap-1">
              <Play className="h-3 w-3 md:h-4 md:w-4" />
              {message.episodes?.length || 0}
            </div>
          </div>
          <div className="flex-1 min-w-0 md:flex md:flex-col md:justify-center">
            <h1 className="text-lg md:text-3xl font-bold mb-1 md:mb-3">
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

        <p className="text-sm md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
          {message.description}
        </p>

        <div className="flex items-center gap-3 md:gap-4">
          <Button
            onClick={handlePlayAll}
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

          <TabsContent
            value="episodes"
            className="mt-3 md:mt-6 space-y-2 md:space-y-4"
          >
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
