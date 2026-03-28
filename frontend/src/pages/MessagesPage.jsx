import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useAppStore } from "@/stores/appStore";

const categories = [
  "All",
  "Faith",
  "Spirituality",
  "Life",
  "Theology",
  "Deliverance",
  "Prayer",
  "Worship",
  "Healing",
  "Prophecy",
];

const messages = [
  {
    id: 1,
    title: "Faith in Action",
    category: "Faith",
    speaker: "Pastor John",
    date: "Mar 12, 2024",
    image: "/images/house-exterior.jpg",
    audioUrl: "https://example.com/faith-in-action.mp3",
  },
  {
    id: 2,
    title: "The Power of Prayer",
    category: "Spirituality",
    speaker: "Pastor Mary",
    date: "Mar 10, 2024",
    image: "/images/house-exterior.jpg",
    audioUrl: "https://example.com/power-of-prayer.mp3",
  },
  {
    id: 3,
    title: "Living in Grace",
    category: "Life",
    speaker: "Pastor Chris",
    date: "Mar 8, 2024",
    image: "/images/house-exterior.jpg",
    audioUrl: "https://example.com/living-in-grace.mp3",
  },
  {
    id: 4,
    title: "God's Love Revealed",
    category: "Theology",
    speaker: "Pastor John",
    date: "Mar 5, 2024",
    image: "/images/house-exterior.jpg",
    audioUrl: "https://example.com/gods-love.mp3",
  },
  {
    id: 5,
    title: "Breaking Free",
    category: "Deliverance",
    speaker: "Pastor Sarah",
    date: "Mar 1, 2024",
    image: "/images/house-exterior.jpg",
    audioUrl: "https://example.com/breaking-free.mp3",
  },
];

export default function MessagesPage() {
  const { isLoggedIn } = useAuthStore();
  const { setCurrentMessage } = usePlayerStore();
  const { openAuthModal } = useAppStore();
  const [activeCategory, setActiveCategory] = useState("All");

  const handlePlayMessage = (message) => {
    if (!isLoggedIn) {
      openAuthModal("login");
      return;
    }
    setCurrentMessage(message);
  };

  const filtered =
    activeCategory === "All"
      ? messages
      : messages.filter((m) => m.category === activeCategory);

  return (
    <div className="space-y-4">
      {/* Category Filter Tabs */}
      <div
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between p-4 bg-white backdrop-blur-sm rounded-xl shadow-lg border-0 dark:bg-slate-800/70 hover:shadow-xl transition"
        >
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <img
              src={message.image}
              alt={message.title}
              className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {message.title}
              </h3>
              <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Badge
                  variant="outline"
                  className="bg-violet-50 dark:bg-violet-900/30 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-400"
                >
                  {message.category}
                </Badge>
                <span>{message.speaker}</span>
                <span>{message.date}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            {isLoggedIn ? (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handlePlayMessage(message)}
                className="text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-900/20"
              >
                <Play className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => openAuthModal("login")}
                className="text-xs border-violet-200 text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-400 dark:hover:bg-violet-900/20"
              >
                Sign in to play
              </Button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
