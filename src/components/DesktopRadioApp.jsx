import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  MessageCircle, 
  Play, 
  Phone, 
  Pause, 
  Volume2, 
  VolumeX, 
  Heart, 
  ExternalLink,
  Users,
  Clock,
  Send,
  Calendar,
  MapPin,
  Mail
} from "lucide-react"
import { motion } from "framer-motion"
import { ThemeToggle } from "./ThemeToggle"

export default function DesktopRadioApp() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [listeners, setListeners] = useState(1247)
  const [likes, setLikes] = useState(89)
  const [isLiked, setIsLiked] = useState(false)
  const [volume, setVolume] = useState(75)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      text: "Beautiful service today! God bless 🙏",
      time: "2 minutes ago",
      avatar: "SJ"
    },
    {
      id: 2,
      name: "Michael David",
      text: "Powerful message from Pastor. Thank you for this ministry!",
      time: "5 minutes ago",
      avatar: "MD"
    },
    {
      id: 3,
      name: "Grace Emmanuel",
      text: "Listening from Lagos. God bless everyone here ❤️",
      time: "8 minutes ago",
      avatar: "GE"
    }
  ])

  // Simulate live listener count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setListeners((prev) => prev + Math.floor(Math.random() * 3) - 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (commentText.trim()) {
      const newComment = {
        id: comments.length + 1,
        name: "You",
        text: commentText,
        time: "Just now",
        avatar: "YO"
      }
      setComments([newComment, ...comments])
      setCommentText("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-700 to-violet-700/70 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Christ Embassy Nigeria</h1>
              <p className="text-sm text-muted-foreground">South South Zone 1 - Online Radio</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
              Live Broadcasting
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row items-start gap-8 h-[calc(100vh-140px)]">
          {/* Left Sidebar - Radio Player */}
          <div className="flex-[1.3]">
            <Card className="h-full bg-gradient-to-br from-card to-card/50 border-border/50 shadow-2xl">
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-xl animate-pulse" />
                  <div className="relative w-32 h-32 flex justify-center items-center bg-gradient-to-br from-background to-muted/30 rounded-full p-4 shadow-lg border-4 border-border/50">
                    <img src="/images/logo.png" alt="Christ Embassy Logo" className="w-20 h-20 object-contain" />
                  </div>
                </div>
                <CardTitle className="text-lg">Now Playing</CardTitle>
                <p className="text-muted-foreground">Sunday Service - Live</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Play Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleLike}
                    className={`h-12 w-12 rounded-full ${isLiked ? "text-red-500" : "text-muted-foreground"} hover:scale-110 transition-all`}
                  >
                    <Heart className={`h-6 w-6 ${isLiked ? "fill-red-500" : ""}`} />
                  </Button>
                  
                  <Button
                    onClick={togglePlayPause}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-primary to-primary/80 shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
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

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      Listeners
                    </div>
                    <p className="text-xl font-bold">{listeners.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      Likes
                    </div>
                    <p className="text-xl font-bold">{likes}</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3 pt-4 border-t border-border/50">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="tel:+2347042066472">
                      <Phone className="w-4 h-4 mr-2" />
                      Call In: +2347042066472
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="flex-2">
            <Tabs defaultValue="comments" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="comments">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Comments
                </TabsTrigger>
                <TabsTrigger value="services">
                  <Clock className="w-4 h-4 mr-2" />
                  Services
                </TabsTrigger>
                <TabsTrigger value="give">
                  <Heart className="w-4 h-4 mr-2" />
                  Give
                </TabsTrigger>
                <TabsTrigger value="links">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Quick Links
                </TabsTrigger>
              </TabsList>

              {/* Comments Tab */}
              <TabsContent value="comments" className="flex-1 flex flex-col">
                <Card className="flex-1 flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Live Comments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {/* Comment Form */}
                    <form onSubmit={handleSubmitComment} className="space-y-4 mb-6 p-4 bg-muted/30 rounded-lg">
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Share your thoughts, prayer requests, or testimonies..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="min-h-[80px] resize-none"
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={!commentText.trim()}>
                        <Send className="w-4 h-4 mr-2" />
                        Post Comment
                      </Button>
                    </form>

                    {/* Comments List */}
                    <ScrollArea className="flex-1">
                      <div className="space-y-4">
                        {comments.map((comment) => (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3 p-4 bg-card/50 rounded-lg border border-border/50"
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{comment.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{comment.name}</span>
                                <span className="text-xs text-muted-foreground">{comment.time}</span>
                              </div>
                              <p className="text-sm">{comment.text}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="flex-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Service Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">Sunday Service</h3>
                              <p className="text-muted-foreground mb-2">Every Sunday 7:00 AM - 8:00 AM (WAT)</p>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4" />
                                <span>Live Broadcast</span>
                              </div>
                            </div>
                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                          <h3 className="font-semibold text-lg">Mid-Week Service</h3>
                          <p className="text-muted-foreground mb-2">Every Wednesday 6:00 PM - 7:00 PM (WAT)</p>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4" />
                            <span>Live Broadcast</span>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                          <h3 className="font-semibold text-lg">Youth Service</h3>
                          <p className="text-muted-foreground mb-2">Every Saturday 4:00 PM - 5:00 PM (WAT)</p>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4" />
                            <span>Live Broadcast</span>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Give Tab */}
              <TabsContent value="give" className="flex-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Support Our Ministry
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                        <h3 className="text-xl font-semibold mb-2">Give with Joy</h3>
                        <p className="text-muted-foreground mb-4">
                          "Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap." - Luke 6:38
                        </p>
                        <p className="text-lg font-medium">
                          To Give, Kindly text the word <span className="font-bold text-primary">GIVE</span> to{" "}
                          <a href="tel:+2347042066472" className="font-bold text-primary hover:underline">
                            +2347042066472
                          </a>
                        </p>
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                        <Heart className="w-4 h-4 mr-2" />
                        Give Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Quick Links Tab */}
              <TabsContent value="links" className="flex-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="h-5 w-5" />
                      Quick Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {[
                          "Join the Impact Bayelsa Online Prayer Rally",
                          "Join the Pastor Chris Live Prayer Network",
                          "Rhapsody of Realities (Read and Earn)",
                          "Reachout World with Rhapsody Of Realities",
                          "Healing School",
                          "Healing Streams TV",
                          "Listen to exciting Messages by Pastor Chris",
                          "Unending Praise 24/7"
                        ].map((link, index) => (
                          <a
                            key={index}
                            href="#"
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors border border-border/50"
                          >
                            <span className="font-medium">{link}</span>
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          </a>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}