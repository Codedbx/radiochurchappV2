"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Marquee from "react-fast-marquee";
import { Star } from "lucide-react";

const upcomingPrograms = [
  { id: 1, title: "Sunday Service", date: "Mar 17, 2024", image: "/images/house-exterior.jpg" },
  { id: 2, title: "Midweek Communion", date: "Mar 20, 2024", image: "/images/house-exterior.jpg" },
  { id: 3, title: "Prayer Vigil", date: "Mar 24, 2024", image: "/images/house-exterior.jpg" },
  { id: 4, title: "Youth Fellowship", date: "Mar 23, 2024", image: "/images/house-exterior.jpg" },
];

const messages = [
  { id: 1, title: "Faith in Action", speaker: "Pastor John", duration: "45 min", image: "/images/house-exterior.jpg" },
  { id: 2, title: "The Power of Prayer", speaker: "Pastor Mary", duration: "38 min", image: "/images/house-exterior.jpg" },
  { id: 3, title: "Living in Grace", speaker: "Pastor Chris", duration: "52 min", image: "/images/house-exterior.jpg" },
];

const podcasts = [
  { id: 1, title: "Daily Devotion", host: "Pastor John", rating: 5, image: "/images/house-exterior.jpg" },
  { id: 2, title: "Bible Study Hour", host: "Pastor Mary", rating: 4, image: "/images/house-exterior.jpg" },
  { id: 3, title: "Worship Moments", host: "Worship Team", rating: 5, image: "/images/house-exterior.jpg" },
  { id: 4, title: "Ask the Pastor", host: "Pastor Chris", rating: 4, image: "/images/house-exterior.jpg" },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("programs");

  const marqueeContent = () => (
    <>
      <span>🎉 Healing Streams Live with Pastor Chris – Starts Tomorrow! </span>
      <span>🌟 Join us for Sunday Service at 7am WAT </span>
      <span>📖 New Messages Added Weekly </span>
      <span>💬 Share Your Testimonies in the Comments </span>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-900 shadow-lg">
        <img
          src="/images/house-exterior.jpg"
          alt="Hero Background"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-b from-transparent to-slate-800"></div>
        <div className="relative z-10 flex h-full flex-col justify-end p-4">
          <h2 className="mb-2 text-lg font-semibold text-white">Healing Streams live with Pastor Chris</h2>
          <p className="text-sm text-white/85">Experience divine healing and miracles</p>
        </div>
      </div>

      {/* Marquee Announcement */}
      <div className="overflow-hidden rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 p-3 text-sm text-slate-800 shadow-lg dark:from-violet-900/20 dark:to-purple-900/20 dark:text-slate-200">
        <Marquee gradient={false} speed={30} pauseOnHover>
          <div className="flex items-center gap-6 whitespace-nowrap">{marqueeContent()}</div>
        </Marquee>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="programs" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="programs">Upcoming Programs</TabsTrigger>
          <TabsTrigger value="messages">Latest Messages</TabsTrigger>
          <TabsTrigger value="podcasts">Featured Podcasts</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {upcomingPrograms.map((program) => (
              <Card key={program.id} className="overflow-hidden">
                <img src={program.image} alt={program.title} className="h-32 w-full object-cover" />
                <CardContent className="p-3">
                  <h3 className="font-semibold line-clamp-1">{program.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{program.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link to="/programs" className="text-sm text-primary hover:underline">
              See All Programs →
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <Card key={message.id} className="p-3">
                <div className="flex gap-3">
                  <img src={message.image} alt={message.title} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm line-clamp-2">{message.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{message.speaker}</p>
                    <p className="text-xs text-muted-foreground">{message.duration}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link to="/messages" className="text-sm text-primary hover:underline">
              Browse All Messages →
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="podcasts" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {podcasts.map((podcast) => (
              <Card key={podcast.id} className="p-3">
                <img src={podcast.image} alt={podcast.title} className="h-32 w-full rounded-lg object-cover mb-2" />
                <h3 className="font-semibold text-sm line-clamp-1">{podcast.title}</h3>
                <p className="text-xs text-muted-foreground">{podcast.host}</p>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < podcast.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}
                    />
                  ))}
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link to="/podcasts" className="text-sm text-primary hover:underline">
              View All Podcasts →
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}