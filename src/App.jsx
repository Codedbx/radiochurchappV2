"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, Play, Phone, Pause, Volume2, VolumeX, Heart, ExternalLink } from "lucide-react"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer"
import { ThemeToggle } from "@/components/ThemeToggle"
import { ThemeProvider } from "@/components/theme-provider"
import { motion, AnimatePresence } from "framer-motion"
import DesktopRadioApp from "./components/DesktopRadioApp"
import CompactPlayer from "./components/CompactPlayer"
import { useIsMobile } from "./hooks/UseIsMobile"

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [listeners, setListeners] = useState(1247)
  const [likes, setLikes] = useState(89)
  const [isLiked, setIsLiked] = useState(false)
  const [isAnyDrawerOpen, setIsAnyDrawerOpen] = useState(false)
  const isMobile = useIsMobile()

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

  const playerProps = {
    isPlaying,
    isMuted,
    isLiked,
    togglePlayPause,
    toggleMute,
    toggleLike,
    listeners,
    likes,
  }

  // Show desktop version on larger screens
  if (!isMobile) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <DesktopRadioApp />
      </ThemeProvider>
    )
  }

  // Mobile version (original design)
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Main Header - Animates out when drawer opens */}
        <AnimatePresence>
          {!isAnyDrawerOpen && (
            <motion.div
              key="main-header"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-1">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-700 to-violet-700/70 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Online Radio Church</h2>
                  <p className="text-sm text-muted-foreground">Broadcasting now</p>
                </div>
              </div>
              <ThemeToggle />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div
          className={`relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center transition-all duration-300 ${
            isAnyDrawerOpen ? "pt-[72px]" : "" // Add padding when compact player is at top
          }`}
        >
          {/* Logo Container */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-2xl animate-pulse" />
            <div className="relative w-46 h-46 flex justify-center items-center bg-gradient-to-br from-card to-card/50 rounded-full p-4 shadow-2xl border-8 border-border/50 backdrop-blur-sm">
              <img src="/images/logo.png" alt="Christ Embassy Logo" className="w-32 h-32 object-contain" />
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

          {/* Main Play Controls - Conditionally rendered with animation */}
          <AnimatePresence>
            {!isAnyDrawerOpen && (
              <motion.div
                key="main-player"
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center gap-6 mb-4"
              >
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons (Comment, Call In) */}
          <div className="flex items-center justify-center gap-8">
            <Drawer onOpenChange={setIsAnyDrawerOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex flex-col items-center gap-2 h-auto py-3 px-6 rounded-2xl hover:bg-muted/50 transition-all"
                >
                  <MessageCircle className="h-6 w-6" />
                  <span className="text-sm">Comment</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-card/95 backdrop-blur-lg border-border/50 h-full">
                <AnimatePresence>
                  {isAnyDrawerOpen && (
                    <motion.div
                      key="compact-player-top"
                      initial={{ opacity: 0, y: -100 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -100 }}
                      transition={{ duration: 0.3 }}
                      className="fixed -translate-y-full -top-2 left-0 right-0 z-[500] px-4 py-2 mx-2 rounded-lg bg-card/90 backdrop-blur-md border-b border-border/50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CompactPlayer {...playerProps} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <DrawerHeader className="text-center">
                  <DrawerTitle className="text-xl font-bold">Comments</DrawerTitle>
                  <DrawerDescription>Share your thoughts and connect with others</DrawerDescription>
                </DrawerHeader>
                <div className="p-6 space-y-4 flex-1 overflow-auto">
                  <div className="bg-muted/50 rounded-lg p-4 text-muted-foreground text-center">
                    {"Comments section coming soon! Stay tuned."}
                  </div>
                  {/* Add more comment components here */}
                </div>
                <DrawerFooter>
                  <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    Post a Comment
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            <Drawer onOpenChange={setIsAnyDrawerOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex flex-col items-center gap-2 h-auto py-3 px-6 rounded-2xl hover:bg-muted/50 transition-all"
                >
                  <Phone className="h-6 w-6" />
                  <span className="text-sm">Call In</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-card/95 backdrop-blur-lg border-border/50 h-full">
                <AnimatePresence>
                  {isAnyDrawerOpen && (
                    <motion.div
                      key="compact-player-top"
                      initial={{ opacity: 0, y: -100 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -100 }}
                      transition={{ duration: 0.3 }}
                      className="fixed -translate-y-full -top-2 left-0 right-0 z-[500] px-4 py-2 mx-2 rounded-lg bg-card/90 backdrop-blur-md border-b border-border/50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CompactPlayer {...playerProps} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <DrawerHeader className="text-center">
                  <DrawerTitle className="text-xl font-bold">Call In</DrawerTitle>
                  <DrawerDescription>Connect with us live!</DrawerDescription>
                </DrawerHeader>
                <div className="p-6 space-y-4 flex-1 overflow-auto">
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-lg font-semibold mb-2">{"Click here to call us:"}</p>
                    <a href="tel:+2347042066472" className="text-primary text-2xl font-bold hover:underline">
                      +2347042066472
                    </a>
                    <p className="text-sm text-muted-foreground mt-2">{"(Standard call rates may apply)"}</p>
                  </div>
                </div>
                <DrawerFooter>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    <a href="tel:+2347042066472">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="relative z-10 bg-card/80 backdrop-blur-lg border-t border-border/50 rounded-t-3xl shadow-2xl">
          <div className="grid grid-cols-3 items-center justify-around">
            <Drawer onOpenChange={setIsAnyDrawerOpen}>
              <DrawerTrigger asChild>
                <button className="flex flex-col items-center gap-2 w-full h-auto py-8 hover:bg-muted/50 transition-all">
                  <span className="font-medium">Services</span>
                </button>
              </DrawerTrigger>
              <DrawerContent className="bg-card/95 backdrop-blur-lg border-border/50 h-full">
                <AnimatePresence>
                  {isAnyDrawerOpen && (
                    <motion.div
                      key="compact-player-top"
                      initial={{ opacity: 0, y: -100 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -100 }}
                      transition={{ duration: 0.3 }}
                      className="fixed -translate-y-full -top-2 left-0 right-0 z-[500] px-4 py-2 mx-2 rounded-lg bg-card/90 backdrop-blur-md border-b border-border/50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CompactPlayer {...playerProps} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <DrawerHeader className="text-center">
                  <DrawerTitle className="text-xl font-bold">Service & Programs</DrawerTitle>
                  <DrawerDescription>Join us for worship and fellowship</DrawerDescription>
                </DrawerHeader>
                <div className="p-6 space-y-4 flex-1 overflow-auto">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Sunday Service</h3>
                    <p className="text-sm text-muted-foreground">Every Sunday 7am to 8am (WAT)</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Mid-Week Service</h3>
                    <p className="text-sm text-muted-foreground">Every Wednesday 6pm to 7pm (WAT)</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Youth Service</h3>
                    <p className="text-sm text-muted-foreground">Every Saturday at 4:00 PM</p>
                  </div>
                </div>
                <DrawerFooter>
                  <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Calendar
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            <Drawer onOpenChange={setIsAnyDrawerOpen}>
              <DrawerTrigger asChild>
                <button className="flex flex-col items-center gap-2 w-full h-auto py-8 hover:bg-muted/50 transition-all">
                  <span className="font-medium">Give</span>
                </button>
              </DrawerTrigger>
              <DrawerContent className="bg-card/95 backdrop-blur-lg border-border/50 h-full">
                <AnimatePresence>
                  {isAnyDrawerOpen && (
                    <motion.div
                      key="compact-player-top"
                      initial={{ opacity: 0, y: -100 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -100 }}
                      transition={{ duration: 0.3 }}
                      className="fixed -translate-y-full -top-2 left-0 right-0 z-[500] px-4 py-2 mx-2 rounded-lg bg-card/90 backdrop-blur-md border-b border-border/50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CompactPlayer {...playerProps} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <DrawerHeader className="text-center">
                  <DrawerTitle className="text-xl font-bold">Support Our Ministry</DrawerTitle>
                  <DrawerDescription>Your generosity helps us spread God's love</DrawerDescription>
                </DrawerHeader>
                <div className="p-6 space-y-4 flex-1 overflow-auto">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      {"To Give, Kindly text the word GIVE to +2347042066472"}
                    </p>
                    <p className="text-sm text-muted-foreground">- Luke 6:38</p>
                  </div>
                </div>
                <DrawerFooter>
                  <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                    <Heart className="w-4 h-4 mr-2" />
                    Give Now
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            <Drawer onOpenChange={setIsAnyDrawerOpen}>
              <DrawerTrigger asChild>
                <button className="flex flex-col items-center gap-2 w-full h-auto py-8 hover:bg-muted/50 transition-all">
                  <span className="font-medium">Quick Links</span>
                </button>
              </DrawerTrigger>
              <DrawerContent className="bg-card/95 backdrop-blur-lg border-border/50 h-full">
                <AnimatePresence>
                  {isAnyDrawerOpen && (
                    <motion.div
                      key="compact-player-top"
                      initial={{ opacity: 0, y: -100 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -100 }}
                      transition={{ duration: 0.3 }}
                      className="fixed -translate-y-full -top-2 left-0 right-0 z-[500] px-4 py-2 mx-2 rounded-lg bg-card/90 backdrop-blur-md border-b border-border/50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CompactPlayer {...playerProps} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <DrawerHeader className="text-center">
                  <DrawerTitle className="text-xl font-bold">Quick Links</DrawerTitle>
                  <DrawerDescription>Access important resources</DrawerDescription>
                </DrawerHeader>
                <div className="p-6 space-y-3 flex-1 overflow-auto">
                  <a
                    href="#"
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <span className="font-medium">Join the Impact Bayelsa Online Prayer Rally</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <span className="font-medium">Join the Pastor Chris Live Prayer Network</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <span className="font-medium">Rhapsody of Realities (Read and Earn)</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <span className="font-medium">Reachout World with Rhapsody Of Realities</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <span className="font-medium">Healing School</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <span className="font-medium">Healing Streams TV</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <span className="font-medium">Listen to exciting Messages by Pastor Chris</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <span className="font-medium">Unending Praise 24/7</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                </div>
                <DrawerFooter>
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/10 bg-transparent">
                    View All Resources
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
