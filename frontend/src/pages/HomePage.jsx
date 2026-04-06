"use client";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageCircle,
  Play,
  Phone,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  ExternalLink,
  Clock,
  Send,
  MapPin,
  Loader2,
  Copy,
  Calendar,
  Mic,
  BookOpen,
  Tag,
  ArrowRight,
  ListMusic,
  Star,
  Gift,
  Sparkles,
  Home,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import Marquee from "react-fast-marquee";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion"; // eslint-disable-line
import { useAuthStore } from "../stores/authStore";

const upcomingPrograms = [
  {
    id: 1,
    title: "Global Communion Service",
    date: "August 4, 2025",
    time: "5:00 PM WAT",
    description: "Join Pastor Chris for a special time of communion.",
    image: "/images/house-exterior.jpg",
  },
  {
    id: 2,
    title: "Your LoveWorld Specials",
    date: "August 10-14, 2025",
    time: "7:00 PM WAT Daily",
    description: "A series of profound teachings and revelations.",
    image: "/images/house-exterior.jpg",
  },
  {
    id: 3,
    title: "Healing School Summer Session",
    date: "September 1, 2025",
    time: "Ongoing",
    description: "Register now to experience God's healing power.",
    image: "/images/house-exterior.jpg",
  },
];

const messages = [
  {
    id: 1,
    title: "The Power of Your Mind",
    speaker: "Pastor Chris Oyakhilome",
    duration: "1:15:30",
    image: "/images/house-exterior.jpg",
  },
  {
    id: 2,
    title: "Recreating Your World",
    speaker: "Pastor Chris Oyakhilome",
    duration: "0:58:10",
    image: "/images/house-exterior.jpg",
  },
  {
    id: 3,
    title: "The Holy Spirit and You",
    speaker: "Pastor Chris Oyakhilome",
    duration: "1:05:00",
    image: "/images/house-exterior.jpg",
  },
];

const podcasts = [
  {
    id: 1,
    title: "Faith Foundations",
    host: "Pastor Sarah",
    rating: 4,
    image: "/images/house-exterior.jpg",
  },
  {
    id: 2,
    title: "Spiritual Growth",
    host: "Pastor Michael",
    rating: 5,
    image: "/images/house-exterior.jpg",
  },
  {
    id: 3,
    title: "Kingdom Living",
    host: "Pastor Grace",
    rating: 4,
    image: "/images/house-exterior.jpg",
  },
  {
    id: 4,
    title: "Divine Wisdom",
    host: "Pastor David",
    rating: 5,
    image: "/images/house-exterior.jpg",
  },
];

const playlists = [
  {
    id: 1,
    title: "Worship Anthems",
    count: 15,
    image: "/images/house-exterior.jpg",
  },
  {
    id: 2,
    title: "Healing Declarations",
    count: 10,
    image: "/images/house-exterior.jpg",
  },
  {
    id: 3,
    title: "Prosperity Teachings",
    count: 8,
    image: "/images/house-exterior.jpg",
  },
  {
    id: 4,
    title: "Youth Empowerment",
    count: 12,
    image: "/images/house-exterior.jpg",
  },
];

const categories = [
  { id: 1, name: "Faith", icon: <Heart className="h-5 w-5" /> },
  { id: 2, name: "Healing", icon: <Volume2 className="h-5 w-5" /> },
  { id: 3, name: "Prayer", icon: <MessageCircle className="h-5 w-5" /> },
  { id: 4, name: "Prosperity", icon: <Copy className="h-5 w-5" /> },
  { id: 5, name: "Salvation", icon: <Home className="h-5 w-5" /> },
];

const quickLinksList = [
  "Join the Impact Bayelsa Online Prayer Rally",
  "Join the Pastor Chris Live Prayer Network",
  "Rhapsody of Realities (Read and Earn)",
  "Reachout World with Rhapsody Of Realities",
  "Healing School",
  "Healing Streams TV",
  "Listen to exciting Messages by Pastor Chris",
  "Unending Praise 24/7",
];

export default function HomePage() {
  const { user, isLoggedIn } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [commentPostError, setCommentPostError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // Mobile tab routing
  const activeSection = new URLSearchParams(location.search).get("tab") || null;

  // Determine live service times in WAT
  const watDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" }),
  );
  const day = watDate.getDay();
  const hour = watDate.getHours();
  const isMidWeekService = day === 3 && hour >= 18 && hour < 19;
  const isSundayService = day === 0 && hour >= 7 && hour < 8;

  useEffect(() => {
    setComments([
      {
        id: 1,
        name: "Sarah Johnson",
        text: "Beautiful service today! God bless",
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
        text: "Listening from Lagos. God bless everyone",
        time: "8 minutes ago",
        avatar: "GE",
      },
    ]);
  }, []);

  // Listen for home tab switch event from navbar
  useEffect(() => {
    const handleSwitchToHome = () => {
      setActiveTab("home");
    };
    window.addEventListener("switchToHomeTab", handleSwitchToHome);
    return () =>
      window.removeEventListener("switchToHomeTab", handleSwitchToHome);
  }, []);

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    setIsPostingComment(true);
    setCommentPostError(null);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setComments((prev) => [
        {
          id: Date.now(),
          name: isLoggedIn ? user.name : "Guest",
          text: commentText,
          time: "Just now",
          avatar: isLoggedIn ? user.name.charAt(0).toUpperCase() : "G",
        },
        ...prev,
      ]);
      setCommentText("");
    } catch {
      setCommentPostError("Failed to post comment. Please try again.");
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("+2347042066472");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const marqueeContent = () => {
    if (isSundayService)
      return (
        <span className="flex items-center gap-2 mr-8 text-slate-800 dark:text-slate-100">
          <Clock className="h-4 w-4 text-primary dark:text-violet-400" />
          <span className="font-semibold text-primary dark:text-violet-400">
            Live Sunday Service:
          </span>{" "}
          Join us now for a powerful time in God's presence!
        </span>
      );
    if (isMidWeekService)
      return (
        <span className="flex items-center gap-2 mr-8 text-slate-800 dark:text-slate-100">
          <Clock className="h-4 w-4 text-primary dark:text-violet-400" />
          <span className="font-semibold text-primary dark:text-violet-400">
            Live Mid-Week Service:
          </span>{" "}
          Tune in for an inspiring session of prayer and teaching!
        </span>
      );
    return (
      <span className="flex items-center gap-2 mr-8 text-slate-800 dark:text-slate-100">
        <MapPin className="h-4 w-4 text-primary dark:text-violet-400" />
        <span className="font-semibold text-primary dark:text-violet-400">
          Welcome to Online Radio Church!
        </span>{" "}
        Stay connected for daily inspirations and live programs. God bless you!
      </span>
    );
  };

  const HeroSection = () => (
    <div className="relative h-64 w-full overflow-hidden rounded-xl bg-slate-900 shadow-lg md:h-80 lg:h-96">
      <img
        src="/images/house-exterior.jpg"
        alt="Hero Background"
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-full bg-linear-to-b from-transparent to-slate-800" />
      <div className="relative z-10 flex h-full flex-col justify-end p-6 md:max-w-2xl">
        <h2 className="mb-2 text-3xl font-semibold text-white leading-snug">
          Healing Streams live and Healing Streams Special with the man of God
          Pastor Chris...
        </h2>
        <p className="text-lg text-white/85">
          Experience divine healing and miracles as Pastor Chris ministers with
          power and demonstration of the Spirit.
        </p>
        <div className="mt-4 flex gap-2">
          <span className="h-2 w-4 rounded-full bg-primary" />
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="h-2 w-2 rounded-full bg-slate-500" />
          ))}
        </div>
      </div>
    </div>
  );

  const MarqueeBar = ({ className = "" }) => (
    <div
      className={`overflow-hidden rounded-xl bg-linear-to-r from-violet-50 to-purple-50 p-3 text-sm text-slate-800 shadow-lg dark:from-violet-900/20 dark:to-purple-900/20 dark:text-slate-200 ${className}`}
    >
      <Marquee gradient={false} speed={40} pauseOnHover>
        <div className="flex items-center gap-8 whitespace-nowrap">
          {marqueeContent()}
          <span className="flex items-center gap-2 mr-8 text-slate-800 dark:text-slate-100">
            <Clock className="h-4 w-4 text-primary dark:text-violet-400" />
            <span className="font-semibold text-primary dark:text-violet-400">
              Sunday Service:
            </span>{" "}
            Every Sunday 7am to 8am WAT
          </span>
          <span className="flex items-center gap-2 mr-8 text-slate-800 dark:text-slate-100">
            <Clock className="h-4 w-4 text-primary dark:text-violet-400" />
            <span className="font-semibold text-primary dark:text-violet-400">
              Mid-Week Service:
            </span>{" "}
            Every Wednesday 6pm to 7pm WAT
          </span>
          <span className="flex items-center gap-2 mr-8 text-slate-800 dark:text-slate-100">
            <Heart className="h-4 w-4 text-primary dark:text-violet-400" />
            <span className="font-semibold text-primary dark:text-violet-400">
              Thank you for your support!
            </span>{" "}
            Your giving helps us reach more souls.
          </span>
        </div>
      </Marquee>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP ── */}
      <div className="hidden lg:block -mx-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-slate-200 dark:border-slate-700/40 rounded-sm">
            <TabsList className="grid h-14 w-full grid-cols-4 rounded-none border-0 bg-transparent p-0">
              {[
                { value: "comments", label: "Comments", icon: MessageCircle },
                { value: "give", label: "Give", icon: Gift },
                { value: "program", label: "Program", icon: Calendar },
                { value: "links", label: "Quick Links", icon: ExternalLink },
              ].map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="relative rounded-none px-4 py-3 text-center text-slate-600 transition-colors duration-200 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-b-slate-700 hover:text-primary/80 dark:text-slate-400 dark:border-0 dark:data-[state=active]:border-0 data-[state=active]:bg-transparent"
                  >
                    {TabIcon && <TabIcon className="mr-2 h-4 w-4 inline" />}
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Home Tab */}
          <TabsContent value="home" className="mt-4 space-y-8">
            <HeroSection />
            <MarqueeBar />

            {/* Upcoming Programs */}
            <Card className="bg-white shadow-lg dark:bg-[#0f172b]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Upcoming Programs</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Don't miss out!
                    </p>
                  </div>
                </div>
                <Link
                  to="/upcoming-programs"
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  See More <ArrowRight className="h-4 w-4" />
                </Link>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Carousel className="w-full">
                  <CarouselContent className="-ml-4">
                    {upcomingPrograms.map((p) => (
                      <CarouselItem
                        key={p.id}
                        className="basis-1/2 pl-4 md:basis-1/3 lg:basis-1/4"
                      >
                        <Card className="h-full gap-0 overflow-hidden py-0 dark:bg-[#0f172b]">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="h-24 w-full object-cover"
                          />
                          <CardContent className="flex flex-col gap-2 p-4">
                            <h3 className="text-base font-semibold">
                              {p.title}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              <Clock className="mr-1 inline-block h-3 w-3" />
                              {p.date} at {p.time}
                            </p>
                            <p className="line-clamp-2 text-xs text-slate-700 dark:text-slate-300">
                              {p.description}
                            </p>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="translate-x-8" />
                  <CarouselNext className="-translate-x-8" />
                </Carousel>
              </CardContent>
            </Card>

            {/* Messages */}
            <Card className="bg-white shadow-lg dark:bg-[#0f172b]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      Messages & Teachings
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Grow in the Word
                    </p>
                  </div>
                </div>
                <Link
                  to="/messages"
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  See More <ArrowRight className="h-4 w-4" />
                </Link>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Carousel className="w-full">
                  <CarouselContent className="-ml-4">
                    {messages.map((m) => (
                      <CarouselItem
                        key={m.id}
                        className="basis-1/2 pl-4 md:basis-1/3 lg:basis-1/4"
                      >
                        <Card className="h-full overflow-hidden p-0 gap-0 rounded-lg shadow-md hover:shadow-lg transition-all dark:bg-[#0f172b]">
                          <img
                            src={m.image}
                            alt={m.title}
                            className="h-32 w-full rounded-t-lg object-cover"
                          />
                          <CardContent className="flex flex-col gap-2 p-4">
                            <h3 className="line-clamp-2 text-base font-semibold">
                              {m.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {m.speaker}
                            </p>
                            <p className="text-xs text-slate-500">
                              {m.duration}
                            </p>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="translate-x-8" />
                  <CarouselNext className="-translate-x-8" />
                </Carousel>
              </CardContent>
            </Card>

            {/* Podcasts */}
            <Card className="bg-white shadow-lg dark:bg-[#0f172b]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
                    <Mic className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Featured Podcasts</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Listen on the go
                    </p>
                  </div>
                </div>
                <Link
                  to="/podcasts"
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Carousel className="w-full">
                  <CarouselContent className="-ml-4">
                    {podcasts.map((p) => (
                      <CarouselItem
                        key={p.id}
                        className="basis-1/2 pl-4 md:basis-1/3 lg:basis-1/3"
                      >
                        <Card className="relative h-48 p-4 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all dark:bg-[#0f172b]">
                          <Mic className="absolute top-3 right-3 h-4 w-4 text-slate-800 dark:text-white" />
                          <div className="flex items-center gap-4 h-full">
                            <img
                              src={p.image}
                              alt={p.title}
                              className="h-full w-28 shrink-0 rounded-md object-cover shadow-lg"
                            />
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={
                                      i < p.rating
                                        ? "fill-yellow-500 text-yellow-500"
                                        : "text-gray-300"
                                    }
                                  />
                                ))}
                              </div>
                              <h3 className="line-clamp-1 font-medium dark:text-slate-200">
                                {p.title}
                              </h3>
                              <p className="text-sm text-slate-700 dark:text-slate-300">
                                {p.host}
                              </p>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="mt-2 w-fit rounded-full text-xs"
                              >
                                Listen Now
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="translate-x-8" />
                  <CarouselNext className="-translate-x-8" />
                </Carousel>
              </CardContent>
            </Card>

            {/* Playlists */}
            <Card className="bg-white shadow-lg dark:bg-[#0f172b]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
                    <ListMusic className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Playlists</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Curated collections for you
                    </p>
                  </div>
                </div>
                <Link
                  to="/playlists"
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  See More <ArrowRight className="h-4 w-4" />
                </Link>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Carousel className="w-full">
                  <CarouselContent className="-ml-2">
                    {playlists.map((pl) => (
                      <CarouselItem
                        key={pl.id}
                        className="basis-1/2 pl-2 md:basis-1/3 lg:basis-1/4"
                      >
                        <div className="pr-4">
                          <div className="relative h-32 w-full">
                            <div className="absolute inset-x-0 top-0 h-full translate-x-4 translate-y-2 rounded-md bg-slate-300 dark:bg-slate-700 shadow-lg" />
                            <div className="absolute inset-x-0 top-0 h-full translate-x-2 translate-y-1 rounded-md bg-slate-400 dark:bg-slate-800 shadow-lg" />
                            <img
                              src={pl.image}
                              alt={pl.title}
                              className="relative z-10 h-full w-full rounded-md object-cover shadow-md hover:shadow-lg transition-all"
                            />
                          </div>
                          <div className="mt-4">
                            <h3 className="line-clamp-1 text-lg font-semibold">
                              {pl.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {pl.count} messages
                            </p>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="translate-x-8" />
                  <CarouselNext className="-translate-x-8" />
                </Carousel>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="bg-white shadow-lg dark:bg-[#0f172b]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
                    <Tag className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      Message Categories
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Explore by topic
                    </p>
                  </div>
                </div>
                <Link
                  to="/categories"
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  See All <ArrowRight className="h-4 w-4" />
                </Link>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Carousel className="w-full">
                  <CarouselContent className="-ml-4">
                    {categories.map((cat) => (
                      <CarouselItem
                        key={cat.id}
                        className="basis-1/2 pl-4 md:basis-1/3 lg:basis-1/5"
                      >
                        <Card className="h-full rounded-lg shadow-md hover:shadow-lg transition-all dark:bg-[#0f172b]">
                          <CardContent className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-violet-50 to-purple-50 shadow-md dark:from-violet-900/30 dark:to-purple-900/30">
                              {cat.icon}
                            </div>
                            <h3 className="font-semibold">{cat.name}</h3>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="translate-x-8" />
                  <CarouselNext className="-translate-x-8" />
                </Carousel>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="mt-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Live Comments</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Join the conversation
                </p>
              </div>
            </div>
            <Card className="border-0 bg-white shadow-lg dark:bg-[#1c293d]">
              <CardContent className="p-6 space-y-4">
                <Textarea
                  placeholder="Share your thoughts, prayer requests, or testimonies..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[100px] resize-none rounded-xl border-0 bg-slate-50/50 focus:ring-2 focus:ring-violet-500 dark:bg-[#0f172b] dark:text-slate-200 dark:placeholder-slate-500"
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim() || isPostingComment}
                  className={`w-full rounded-lg transition-all ${
                    commentText.trim()
                      ? "bg-violet-600 hover:bg-violet-700 text-white"
                      : "bg-violet-500 text-white cursor-not-allowed"
                  }`}
                >
                  {isPostingComment ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  {isPostingComment ? "Posting..." : "Post Comment"}
                </Button>
                {commentPostError && (
                  <p className="text-sm text-red-500">{commentPostError}</p>
                )}
              </CardContent>
            </Card>
            <Card className="border-0 bg-transparent shadow-none dark:bg-[#1c253b] dark:border dark:border-slate-700/50 dark:shadow-xl">
              <CardContent className="p-6">
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {comments.map((c) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 p-4 bg-slate-100 rounded-xl dark:bg-[#151f34]"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{c.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {c.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {c.time}
                            </span>
                          </div>
                          <p className="text-sm">{c.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Give Tab */}
          <TabsContent value="give" className="mt-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold">Give</h2>
            </div>
            <Card className="border-violet-200/50 bg-linear-to-br from-violet-50 to-purple-50 shadow-lg dark:border-slate-700 dark:bg-[#27254f] dark:from-[#27254f] dark:to-[#27254f]">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-600">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Give with Joy</h3>
                <p className="mb-6 leading-relaxed text-slate-600 dark:text-slate-400">
                  "Give, and it will be given to you. A good measure, pressed
                  down, shaken together and running over, will be poured into
                  your lap." - Luke 6:38
                </p>
                <div className="flex flex-col items-center rounded-xl bg-white p-6 dark:bg-slate-800/70">
                  <p className="mb-4 text-lg">
                    To Give, Kindly text the word{" "}
                    <span className="font-bold text-violet-600 dark:text-violet-400">
                      GIVE
                    </span>{" "}
                    to
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-xl border border-primary/30 dark:border-violet-500 px-8 py-3 text-lg">
                      <MessageCircle className="h-5 w-5" />
                      +234 704 206 6472
                    </div>
                    <button
                      onClick={handleCopy}
                      className="p-2 text-slate-400 hover:text-violet-600 transition"
                    >
                      {copied ? (
                        <span className="text-xs text-violet-600 font-medium">
                          Copied!
                        </span>
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Program Tab */}
          <TabsContent value="program" className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Upcoming Programs</h2>
                <p className="text-sm text-slate-500">What's coming up</p>
              </div>
            </div>
            <div className="space-y-3">
              {upcomingPrograms.map((p) => (
                <Card key={p.id} className="overflow-hidden dark:bg-[#0f172b]">
                  <div
                    className="flex gap-3 p-3md:gap-4 
                    pl-4 pr-4 py-4 
                    md:pl-6 md:pr-5 
                    lg:pl-8 "
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-16 w-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{p.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {p.date} at {p.time}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Quick Links Tab */}
          <TabsContent value="links" className="mt-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
                <ExternalLink className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold">Quick Links</h2>
            </div>
            <div className="grid gap-3">
              {quickLinksList.map((link, i) => (
                <Card
                  key={i}
                  className="group cursor-pointer border-0 bg-gray-100 transition-all duration-200 hover:shadow-xl dark:bg-slate-800/70"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900 transition-colors group-hover:text-primary/70 dark:text-slate-100">
                        {link}
                      </span>
                      <ExternalLink className="h-4 w-4 text-slate-400 transition-colors group-hover:text-primary/80" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── MOBILE ── */}
      <div className="lg:hidden">
        {/* Mobile tab bar */}
        <div className="border-b border-slate-200 dark:border-slate-700 -mx-4">
          <div className="grid grid-cols-4">
            {[
              { key: "comments", label: "Comments", icon: MessageCircle },
              { key: "give", label: "Give", icon: Gift },
              { key: "program", label: "Program", icon: Calendar },
              { key: "quicklinks", label: "Quick Links", icon: ExternalLink },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() =>
                    navigate(
                      activeSection === tab.key ? "/" : `?tab=${tab.key}`,
                      { replace: true },
                    )
                  }
                  className={`flex flex-col items-center gap-1 py-3 text-xs font-medium border-b-2 transition-all ${
                    activeSection === tab.key
                      ? "border-violet-600 text-violet-600 dark:text-violet-400 dark:border-violet-400 bg-white dark:bg-slate-800 shadow-md rounded-t-lg"
                      : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile: Comments */}
        {activeSection === "comments" && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold">Live Comments</h3>
                <p className="text-xs text-slate-500">Join the conversation</p>
              </div>
            </div>
            <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 p-4 space-y-3">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts, prayer requests, or testimonies..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-sm placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
              <button
                onClick={handleSubmitComment}
                disabled={!commentText.trim() || isPostingComment}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${commentText.trim() ? "bg-violet-600 hover:bg-violet-700 text-white" : "bg-violet-400 text-white cursor-not-allowed"}`}
              >
                {isPostingComment ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isPostingComment ? "Posting..." : "Post Comment"}
              </button>
            </div>
            <div className="space-y-4">
              {comments.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="text-xs bg-slate-200 dark:bg-slate-700">
                      {c.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold">{c.name}</span>
                      <span className="text-xs text-slate-400">{c.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                      {c.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile: Give */}
        {activeSection === "give" && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold">Give</h3>
            </div>
            <div className="rounded-2xl bg-violet-50 dark:bg-violet-900/20 p-6 space-y-5">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-violet-600 flex items-center justify-center">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <h4 className="text-lg font-bold">Give with Joy</h4>
                <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                  "Give, and it will be given to you. A good measure, pressed
                  down, shaken together and running over, will be poured into
                  your lap."
                  <br />
                  <span className="font-medium">- Luke 6:38</span>
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 space-y-2 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  To Give, Kindly text the word{" "}
                  <span className="text-violet-600 font-bold">GIVE</span> to
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2">
                    <MessageCircle className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium">
                      +234 704 206 6472
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-2 text-slate-400 hover:text-violet-600 transition"
                  >
                    {copied ? (
                      <span className="text-xs text-violet-600 font-medium">
                        Copied!
                      </span>
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile: Program */}
        {activeSection === "program" && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold">Upcoming Programs</h3>
                <p className="text-xs text-slate-500">What's coming up</p>
              </div>
            </div>
            <div className="space-y-3">
              {upcomingPrograms.map((p) => (
                <Card key={p.id} className="overflow-hidden">
                  <div className="flex gap-3 p-3">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-16 w-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{p.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {p.date}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Mobile: Quick Links */}
        {activeSection === "quicklinks" && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
                <ExternalLink className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold">Quick Links</h3>
            </div>
            <div className="space-y-3">
              {quickLinksList.map((link) => (
                <a
                  key={link}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center justify-between px-5 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800 group transition-colors"
                >
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">
                    {link}
                  </span>
                  <ExternalLink className="h-4 w-4 shrink-0 ml-3 text-slate-400 group-hover:text-violet-500" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Mobile: Home (default) */}
        {activeSection === null && (
          <div className="space-y-6 mt-4">
            <HeroSection />
            <MarqueeBar />
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Upcoming Programs</h2>
                <Link
                  to="/programs"
                  className="text-sm text-primary hover:underline"
                >
                  See More
                </Link>
              </div>
              <Carousel className="w-full">
                <CarouselContent className="-ml-4">
                  {upcomingPrograms.map((p) => (
                    <CarouselItem key={p.id} className="basis-1/2 pl-4">
                      <Card className="gap-0 overflow-hidden p-0">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="h-20 w-full object-cover"
                        />
                        <CardContent className="p-3">
                          <h3 className="text-sm font-semibold line-clamp-1">
                            {p.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {p.date}
                          </p>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Latest Messages</h2>
                <Link
                  to="/messages"
                  className="text-sm text-primary hover:underline"
                >
                  See More
                </Link>
              </div>
              <div className="space-y-3">
                {messages.map((m) => (
                  <Card key={m.id} className="p-3">
                    <div className="flex gap-3">
                      <img
                        src={m.image}
                        alt={m.title}
                        className="h-16 w-16 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm line-clamp-2">
                          {m.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {m.speaker}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {m.duration}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Featured Podcasts</h2>
                <Link
                  to="/podcasts"
                  className="text-sm text-primary hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {podcasts.map((p) => (
                  <Card key={p.id} className="p-3 gap-0">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-20 w-full rounded-lg object-cover mb-2"
                    />
                    <h3 className="font-semibold text-sm line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{p.host}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < p.rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
