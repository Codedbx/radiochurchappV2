import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Disc3, Pause, Headphones } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useAppStore } from "@/stores/appStore";

const categories = [
  "All", "Faith", "Spirituality", "Life", "Theology",
  "Deliverance", "Prayer", "Worship", "Healing", "Prophecy",
];

const messages = [
  {
    id: 1, title: "Faith in Action", category: "Faith", speaker: "Pastor John",
    date: "Mar 12, 2024", duration: "45:30", image: "/images/house-exterior.jpg",
    audioUrl: "https://example.com/faith-in-action.mp3",
    description: "Discover how to put your faith into action in everyday life.",
  },
  {
    id: 2, title: "The Power of Prayer", category: "Spirituality", speaker: "Pastor Mary",
    date: "Mar 10, 2024", duration: "52:15", image: "/images/house-exterior.jpg",
    audioUrl: "https://example.com/power-of-prayer.mp3",
    description: "Learn about the transformative power of prayer.",
  },
  {
    id: 3, title: "Living in Grace", category: "Life", speaker: "Pastor Chris",
    date: "Mar 8, 2024", duration: "41:20", image: "/images/house-exterior.jpg",
    audioUrl: "https://example.com/living-in-grace.mp3",
    description: "Explore what it means to live in God's grace.",
  },
  {
    id: 4, title: "God's Love Revealed", category: "Theology", speaker: "Pastor John",
    date: "Mar 5, 2024", duration: "38:45", image: "/images/house-exterior.jpg",
    audioUrl: "https://example.com/gods-love.mp3",
    description: "A deep dive into understanding the depth of God's love.",
  },
  {
    id: 5, title: "Breaking Free", category: "Deliverance", speaker: "Pastor Sarah",
    date: "Mar 1, 2024", duration: "55:10", image: "/images/house-exterior.jpg",
    audioUrl: "https://example.com/breaking-free.mp3",
    description: "Find freedom from bondage and discover liberty.",
  },
];

// ─── MessageCard Component ────────────────────────────────────────────────────
function MessageCard({ message }) {
  const navigate = useNavigate();
  const { currentMessage, isPlaying, setCurrentMessage, setIsPlaying } = usePlayerStore();
  const { isLoggedIn } = useAuthStore();
  const { openAuthModal } = useAppStore();

  const isCurrentlyPlaying =
    (currentMessage?.episodeId === message.id || currentMessage?.id === message.id) && isPlaying;

  const handlePlay = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) { openAuthModal("login"); return; }
    if (isCurrentlyPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentMessage({ ...message, episodes: messages, episodeId: message.id });
    }
  };

  return (
    <div
      onClick={() => navigate(`/message/${message.id}`, { state: { message } })}
      className="group cursor-pointer flex flex-col gap-3 shrink-0 w-[160px] sm:w-auto snap-start"
    >
      {/* Square Thumbnail */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg bg-slate-800 ring-1 ring-white/10 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-violet-500/20">
        <img
          src={message.image}
          alt="cover"
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isCurrentlyPlaying ? "opacity-40 blur-[2px]" : ""}`}
        />

        {/* Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isCurrentlyPlaying ? "bg-black/20" : "bg-black/0 group-hover:bg-black/40"}`}>
          {isCurrentlyPlaying ? (
            <>
              {/* Animated equalizer */}
              <div className="flex items-end gap-[3px] h-8">
                <div className="w-[3px] bg-violet-400 h-3 animate-[bounce_0.8s_ease-in-out_infinite]" style={{ animationDelay: "0ms" }} />
                <div className="w-[3px] bg-violet-400 h-8 animate-[bounce_0.8s_ease-in-out_infinite]" style={{ animationDelay: "150ms" }} />
                <div className="w-[3px] bg-violet-400 h-5 animate-[bounce_0.8s_ease-in-out_infinite]" style={{ animationDelay: "300ms" }} />
                <div className="w-[3px] bg-violet-400 h-7 animate-[bounce_0.8s_ease-in-out_infinite]" style={{ animationDelay: "100ms" }} />
              </div>
              {/* Pause on hover */}
              <button
                onClick={handlePlay}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Pause className="h-10 w-10 text-white fill-current" />
              </button>
            </>
          ) : (
            <button
              onClick={handlePlay}
              className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:scale-110 active:scale-95"
            >
              <Play className="h-6 w-6 fill-current ml-1" />
            </button>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-col min-w-0">
        <h3 className={`text-sm sm:text-base font-extrabold truncate leading-tight mb-0.5 tracking-tight ${isCurrentlyPlaying ? "text-violet-600 dark:text-violet-400" : "text-slate-900 dark:text-white"}`}>
          {message.title}
        </h3>
        <p className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
          <span>{message.date.split(",")[1]?.trim() || message.date}</span>
          <span className="opacity-30">•</span>
          <span className="truncate">{message.speaker}</span>
        </p>
      </div>
    </div>
  );
}

// ─── Carousel Row ─────────────────────────────────────────────────────────────
function CarouselRow({ title, items }) {
  return (
    <div className="px-2">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          {title}
        </h2>
        <button className="text-[10px] sm:text-xs font-bold text-slate-500 hover:text-violet-600 uppercase tracking-widest transition-colors">
          Show all
        </button>
      </div>

      {/* Mobile: horizontal swipe carousel | Desktop: grid */}
      <div className="flex sm:grid overflow-x-auto sm:overflow-visible gap-4 sm:gap-y-8 scrollbar-hide snap-x snap-mandatory sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 pb-2">
        {items.length > 0 ? (
          items.map((msg) => <MessageCard key={msg.id} message={msg} />)
        ) : (
          <div className="col-span-full py-16 text-center">
            <Headphones className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No messages in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MessagesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? messages
      : messages.filter((m) => m.category === activeCategory);

  return (
    <div className="bg-transparent">

      {/* ── Hero Banner ── */}
      <div className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 md:px-8 overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-3xl w-screen left-1/2 -ml-[50vw] -mt-8 [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[100%] rounded-full bg-violet-400/10 dark:bg-violet-600/10 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[80%] rounded-full bg-purple-300/10 dark:bg-purple-800/10 blur-[100px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-[90rem] mx-auto flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-10 px-6">
          <div className="w-32 h-32 sm:w-48 sm:h-48 shrink-0 bg-gradient-to-br from-violet-500 to-purple-700 rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-500">
            <Disc3 className="w-16 h-16 sm:w-24 sm:h-24 text-white opacity-90" />
          </div>

          <div className="text-center sm:text-left">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300 mb-2 sm:mb-4 block">
              Official Archive
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 sm:mb-6 leading-none">
              All Messages
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-lg font-medium max-w-xl mx-auto sm:mx-0">
              The complete collection of weekly broadcasts, teachings, and podcasts. Listen natively.
            </p>
          </div>
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="relative max-w-7xl mx-auto px-2 sm:px-8 -mt-8 sm:-mt-12 z-20">

        {/* Category Tabs */}
        <div className="sticky top-16 z-30 mb-8 pb-4">
          <div
            className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory pt-2 px-4 sm:px-0 -mx-4 sm:mx-0"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap snap-start ${
                  activeCategory === cat
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30 scale-105"
                    : "bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 border border-slate-200/50 dark:border-white/5 backdrop-blur-sm"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel Sections */}
        <div className="w-full space-y-12 pb-24">
          <CarouselRow title="Popular Releases" items={messages} />
          <CarouselRow
            title={activeCategory === "All" ? "Trending Today" : `Top in ${activeCategory}`}
            items={filtered}
          />
        </div>

      </div>
    </div>
  );
}
