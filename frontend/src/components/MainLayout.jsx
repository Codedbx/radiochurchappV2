import { useState, useRef, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  ExternalLink,
  Clock,
  Send,
  Loader2,
  Copy,
  CheckIcon,
  CopyIcon,
  Radio,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { motion, AnimatePresence } from "framer-motion"
import { useAuthStore } from "../stores/authStore"
import { useFavoritesStore } from "../stores/favoritesStore"
import { usePlayerStore } from "../stores/playerStore"
import HomePage from "../pages/HomePage"
import MessagesPage from "../pages/MessagesPage"
import UpcomingProgramsPage from "../pages/UpcomingProgramsPage"

const COMMENT_SAMPLES = [
  {
    id: 1,
    name: "Sarah Johnson",
    text: "Beautiful service today! God bless 🙏",
    time: "2 minutes ago",
    avatar: "SJ",
  },
  {
    id: 2,
    name: "Michael David",
    text: "Powerful message from Pastor. Thank you for this ministry!",
    time: "5 minutes ago",
    avatar: "MD",
  },
  {
    id: 3,
    name: "Grace Emmanuel",
    text: "Listening from Lagos. God bless everyone here ❤️",
    time: "8 minutes ago",
    avatar: "GE",
  },
]

export default function MainLayout() {
  const audioRef = useRef(null)
  const { isLoggedIn } = useAuthStore()
  const { isFavorite } = useFavoritesStore()
  const { isLiveStream, currentMessage, setLiveStream } = usePlayerStore()

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(75)
  const [likes, setLikes] = useState(342)
  const [isLiked, setIsLiked] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState([])
  const [copied, setCopied] = useState(false)

  // Fetch comments on mount
  useEffect(() => {
    setComments(COMMENT_SAMPLES)
  }, [])

  // Control audio playback
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.play().catch((e) => console.error("Play error:", e))
    } else {
      audio.pause()
    }
  }, [isPlaying])

  // Control mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  // Control volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const handleCopy = () => {
    navigator.clipboard.writeText("1002231384")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmitComment = async () => {
    if (!isLoggedIn || !commentText.trim()) return
    
    const newComment = {
      id: comments.length + 1,
      name: "You",
      text: commentText,
      time: "just now",
      avatar: "YO",
    }
    setComments([newComment, ...comments])
    setCommentText("")
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-screen bg-gradient-to-br from-slate-400 via-white to-violet-200/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-900/10 p-4 lg:p-6">
      {/* Left: Player Section */}
      <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
        {/* Player Card */}
        <Card className="bg-white backdrop-blur-sm border-0 shadow-lg dark:bg-slate-800/70 overflow-hidden">
          <CardContent className="p-6 space-y-6">
            {/* Now Playing Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {isLiveStream && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">LIVE NOW</span>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isLiveStream ? "Live Stream" : currentMessage?.title || "Select a Message"}
                </h2>
                {!isLiveStream && currentMessage && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    by {currentMessage.speaker}
                  </p>
                )}
              </div>
            </div>

            {/* Player Controls */}
            <div className="space-y-4">
              {/* Play/Pause Button */}
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-lg"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5 mr-2 fill-current" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Play
                  </>
                )}
              </Button>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider defaultValue={[45]} max={100} step={1} className="cursor-pointer" />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>2:15</span>
                  <span>5:00</span>
                </div>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Slider
                  value={[volume]}
                  onValueChange={(val) => setVolume(val[0])}
                  max={100}
                  step={1}
                  className="flex-1 cursor-pointer"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 w-8 text-right">
                  {volume}%
                </span>
              </div>

              {/* Like & Share */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsLiked(!isLiked)}
                  variant="outline"
                  className="flex-1 border-slate-200 dark:border-slate-700"
                >
                  <Heart
                    className={`w-4 h-4 mr-2 ${isLiked ? "fill-rose-600 text-rose-600" : ""}`}
                  />
                  {likes}
                </Button>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="flex-1 border-slate-200 dark:border-slate-700"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <CopyIcon className="w-4 h-4 mr-2" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>

              {/* Switch to Live/Back Button */}
              {!isLiveStream && (
                <Button
                  onClick={() => setLiveStream()}
                  variant="outline"
                  className="w-full border-slate-200 dark:border-slate-700 text-violet-600 dark:text-violet-400"
                >
                  <Radio className="w-4 h-4 mr-2" />
                  Back to Live Stream
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Giving Card */}
        <Card className="bg-gradient-to-br from-violet-600 to-purple-600 border-0 shadow-lg text-white">
          <CardContent className="p-6 text-center space-y-3">
            <h3 className="text-lg font-semibold">Support Our Ministry</h3>
            <p className="text-sm text-violet-100">Help us continue spreading the gospel</p>
            <Button className="w-full bg-white text-violet-600 hover:bg-slate-100 font-semibold">
              Give Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right: Tabs Section */}
      <div className="flex-1 min-w-0">
        <Card className="bg-white backdrop-blur-sm border-0 shadow-lg dark:bg-slate-800/70 h-full overflow-hidden">
          <CardContent className="p-6 h-full overflow-y-auto">
            <Tabs defaultValue="home" className="w-full h-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-6 bg-transparent p-0 rounded-none h-auto border-b border-slate-200 dark:border-slate-700">
                <TabsTrigger
                  value="home"
                  className="px-2 lg:px-4 py-3 text-xs lg:text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 transition-colors duration-200 data-[state=active]:text-violet-600 data-[state=active]:font-semibold dark:data-[state=active]:text-violet-400 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-violet-600 rounded-none -mb-px whitespace-nowrap"
                >
                  Home
                </TabsTrigger>
                <TabsTrigger
                  value="messages"
                  className="px-2 lg:px-4 py-3 text-xs lg:text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 transition-colors duration-200 data-[state=active]:text-violet-600 data-[state=active]:font-semibold dark:data-[state=active]:text-violet-400 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-violet-600 rounded-none -mb-px whitespace-nowrap"
                >
                  Messages
                </TabsTrigger>
                <TabsTrigger
                  value="programs"
                  className="px-2 lg:px-4 py-3 text-xs lg:text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 transition-colors duration-200 data-[state=active]:text-violet-600 data-[state=active]:font-semibold dark:data-[state=active]:text-violet-400 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-violet-600 rounded-none -mb-px whitespace-nowrap"
                >
                  Programs
                </TabsTrigger>
                <TabsTrigger
                  value="give"
                  className="px-2 lg:px-4 py-3 text-xs lg:text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 transition-colors duration-200 data-[state=active]:text-violet-600 data-[state=active]:font-semibold dark:data-[state=active]:text-violet-400 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-violet-600 rounded-none -mb-px whitespace-nowrap"
                >
                  Give
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="hidden lg:block px-4 py-3 text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 transition-colors duration-200 data-[state=active]:text-violet-600 data-[state=active]:font-semibold dark:data-[state=active]:text-violet-400 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-violet-600 rounded-none -mb-px whitespace-nowrap"
                >
                  Services
                </TabsTrigger>
                <TabsTrigger
                  value="comments"
                  className="hidden lg:block px-4 py-3 text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 transition-colors duration-200 data-[state=active]:text-violet-600 data-[state=active]:font-semibold dark:data-[state=active]:text-violet-400 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-violet-600 rounded-none -mb-px whitespace-nowrap"
                >
                  Comments
                </TabsTrigger>
                <TabsTrigger
                  value="links"
                  className="hidden lg:block px-4 py-3 text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 transition-colors duration-200 data-[state=active]:text-violet-600 data-[state=active]:font-semibold dark:data-[state=active]:text-violet-400 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-violet-600 rounded-none -mb-px whitespace-nowrap"
                >
                  Quick Links
                </TabsTrigger>
              </TabsList>

              {/* Tab Contents */}
              <div className="pr-4">
                <TabsContent value="home" className="space-y-6 mt-0">
                  <HomePage />
                </TabsContent>

                <TabsContent value="messages" className="space-y-6 mt-0">
                  <MessagesPage />
                </TabsContent>

                <TabsContent value="programs" className="space-y-6 mt-0">
                  <UpcomingProgramsPage />
                </TabsContent>

                {/* Give Tab */}
                <TabsContent value="give" className="space-y-6 mt-0">
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-rose-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Support Our Ministry</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Your generosity helps us spread the gospel and serve our community
                    </p>
                    <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                      Donate Now
                    </Button>
                  </div>
                </TabsContent>

                {/* Services Tab */}
                <TabsContent value="services" className="space-y-4 mt-0">
                  <div className="space-y-3">
                    {[
                      { day: "Sunday", time: "7:00 AM - 8:30 AM", title: "Sunday Service" },
                      { day: "Wednesday", time: "6:00 PM - 7:30 PM", title: "Midweek Communion" },
                      { day: "Friday", time: "7:00 PM - 8:00 PM", title: "Prayer Meeting" },
                    ].map((service, idx) => (
                      <Card key={idx} className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <CardContent className="p-4 flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">{service.title}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{service.day}</p>
                          </div>
                          <p className="text-sm font-medium text-violet-600 dark:text-violet-400">{service.time}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Comments Tab */}
                <TabsContent value="comments" className="space-y-6 mt-0">
                  {/* Comment Form */}
                  {!isLoggedIn ? (
                    <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200/50 dark:border-violet-800/50 shadow-lg">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-violet-200 dark:bg-violet-900/40 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <MessageCircle className="h-6 w-6 text-violet-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Sign in to comment</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                          Join our community to share your thoughts and connect with others.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-white backdrop-blur-sm border-0 shadow-lg dark:bg-slate-800/70">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Share your thoughts, prayer requests, or testimonies..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="min-h-[100px] resize-none border-0 bg-slate-50/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-violet-500 rounded-xl"
                          />
                          <Button
                            onClick={handleSubmitComment}
                            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-lg"
                            disabled={!commentText.trim()}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Post Comment
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Comments List */}
                  {isLoggedIn ? (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-4 p-6 bg-white backdrop-blur-sm rounded-xl shadow-lg border-0 dark:bg-slate-800/70"
                        >
                          <Avatar className="h-12 w-12 ring-2 ring-violet-100 dark:ring-violet-900">
                            <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-400 dark:from-gray-900 dark:to-gray-900 text-white font-semibold">
                              {comment.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-slate-900 dark:text-slate-100">{comment.name}</span>
                              <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                                {comment.time}
                              </span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{comment.text}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40 text-slate-500">
                      Sign in to see live comments
                    </div>
                  )}
                </TabsContent>

                {/* Quick Links Tab */}
                <TabsContent value="links" className="space-y-4 mt-0">
                  <div className="grid gap-3">
                    {[
                      { title: "Website", url: "https://christembassy.org", icon: "🌐" },
                      { title: "Facebook", url: "https://facebook.com", icon: "f" },
                      { title: "YouTube", url: "https://youtube.com", icon: "▶" },
                      { title: "WhatsApp", url: "https://whatsapp.com", icon: "💬" },
                    ].map((link, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="justify-between border-slate-200 dark:border-slate-700 h-auto p-4"
                      >
                        <span>{link.title}</span>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} preload="auto">
        <source src="https://radio.ifastekpanel.com:1765/stream" type="audio/mpeg" />
      </audio>
    </div>
  )
}
