import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Play, Search as SearchIcon, Mic2, ListMusic, Clock, Calendar, ChevronRight } from "lucide-react";
import { usePlayerStore } from "../stores/playerStore";
import { useAuthStore } from "../stores/authStore";
import { useAppStore } from "../stores/appStore";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [messageResults, setMessageResults] = useState([]);
  const [playlistResults, setPlaylistResults] = useState([]);

  const { isLoggedIn } = useAuthStore();
  const { setCurrentMessage } = usePlayerStore();
  const { openAuthModal } = useAppStore();

  // Unified application mock records
  const mockMessages = [
    { id: 1, type: 'message', title: "Faith in Action", category: "Faith", speaker: "Pastor John", date: "Mar 12, 2024", duration: "45:00", audioUrl: "https://example.com/faith-in-action.mp3", image: "/images/house-exterior.jpg" },
    { id: 2, type: 'message', title: "The Power of Prayer", category: "Spirituality", speaker: "Pastor Mary", date: "Mar 10, 2024", duration: "32:15", audioUrl: "https://example.com/power-of-prayer.mp3", image: "/images/house-exterior.jpg" },
    { id: 3, type: 'message', title: "Living in Grace", category: "Life", speaker: "Pastor Chris", date: "Mar 8, 2024", duration: "50:20", audioUrl: "https://example.com/living-in-grace.mp3", image: "/images/house-exterior.jpg" },
    { id: 4, type: 'message', title: "God's Love Revealed", category: "Theology", speaker: "Pastor John", date: "Mar 5, 2024", duration: "41:10", audioUrl: "https://example.com/gods-love.mp3", image: "/images/house-exterior.jpg" },
    { id: 5, type: 'message', title: "Breaking Free", category: "Deliverance", speaker: "Pastor Sarah", date: "Mar 1, 2024", duration: "38:45", audioUrl: "https://example.com/breaking-free.mp3", image: "/images/house-exterior.jpg" },
  ];

  const mockPlaylists = [
    { id: 1, type: 'playlist', title: "Worship Anthems", count: 15, duration: "1h 23m", image: "/images/house-exterior.jpg", description: "Powerful worship songs to lift your spirit" },
    { id: 2, type: 'playlist', title: "Healing Declarations", count: 10, duration: "2h 15m", image: "/images/house-exterior.jpg", description: "Messages of healing and restoration" },
    { id: 3, type: 'playlist', title: "Prosperity Teachings", count: 8, duration: "1h 45m", image: "/images/house-exterior.jpg", description: "Learn about God's plan for your prosperity" },
    { id: 4, type: 'playlist', title: "Youth Empowerment", count: 12, duration: "2h 30m", image: "/images/house-exterior.jpg", description: "Inspiring messages for young believers" },
  ];

  // Dynamic filter processing
  useEffect(() => { 
    if (query) {
      const qLower = query.toLowerCase();
      setMessageResults(mockMessages.filter(msg =>
        msg.title.toLowerCase().includes(qLower) ||
        msg.speaker.toLowerCase().includes(qLower) ||
        msg.category.toLowerCase().includes(qLower)
      ));

      setPlaylistResults(mockPlaylists.filter(pl =>
        pl.title.toLowerCase().includes(qLower) ||
        pl.description.toLowerCase().includes(qLower)
      ));
    } else {
      setMessageResults([]);
      setPlaylistResults([]);
    }
  }, [query]);

  // Handle playing individual messages
  const handlePlayMessage = (message, e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      openAuthModal("login");
      return;
    }
    setCurrentMessage(message);
  };

  // Nav to playlist
  const handlePlaylistClick = (playlist) => {
    navigate(`/playlist/${playlist.id}`, { state: { playlist } });
  };

  if (!query) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mb-6">
          <SearchIcon className="h-10 w-10 text-violet-500" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Search Library</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          Type above to search across our entire library of inspirational messages, teachings, and dynamic playlists.
        </p>
      </div>
    );
  }

  const hasResults = messageResults.length > 0 || playlistResults.length > 0;

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header Result Context */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          Results for <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">"{query}"</span>
        </h1>
        {hasResults && (
           <p className="text-slate-500 font-medium mt-2">
             Found {messageResults.length} messages and {playlistResults.length} playlists
           </p>
        )}
      </div>

      {!hasResults ? (
        <div className="w-full flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-slate-800/30 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed backdrop-blur-sm">
           <SearchIcon className="h-12 w-12 text-slate-400 mb-4 opacity-50" />
           <p className="text-xl font-semibold text-slate-700 dark:text-slate-300">We couldn't find anything matching your search.</p>
           <p className="text-sm text-slate-500 mt-2">Try double-checking your spelling or using different keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 md:gap-12 items-start">
          
          {/* Messages Column */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
              <Mic2 className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              <h2 className="text-2xl font-bold bg-clip-text text-slate-900 dark:text-white">
                Messages ({messageResults.length})
              </h2>
            </div>
            
            {messageResults.length === 0 ? (
               <div className="text-slate-500 italic py-4">No messages match your search.</div>
            ) : (
               <div className="space-y-4">
                 {messageResults.map(msg => (
                   <div 
                     key={msg.id} 
                     className="group flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 cursor-pointer"
                     onClick={(e) => handlePlayMessage(msg, e)}
                   >
                     {/* Thumbnail */}
                     <div className="relative shrink-0 w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                       <img src={msg.image} alt={msg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                         <div className="h-10 w-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                           <Play className="h-4 w-4 text-violet-700 ml-0.5" />
                         </div>
                       </div>
                       <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-xs text-white font-medium">
                         {msg.duration}
                       </div>
                     </div>
                     
                     {/* Data */}
                     <div className="flex-1 flex flex-col justify-center min-w-0">
                       <div className="inline-flex items-center w-fit px-2.5 py-1 uppercase text-[10px] font-extrabold tracking-wider bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 rounded-full mb-2">
                         {msg.category}
                       </div>
                       <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate mb-1 group-hover:text-violet-600 transition-colors">
                         {msg.title}
                       </h3>
                       <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-3">
                         {msg.speaker}
                       </p>
                       <div className="flex items-center gap-4 text-xs text-slate-500">
                         <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {msg.date}</span>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            )}
          </section>

          {/* Playlists Column */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
              <ListMusic className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-2xl font-bold bg-clip-text text-slate-900 dark:text-white">
                Playlists ({playlistResults.length})
              </h2>
            </div>
            
            {playlistResults.length === 0 ? (
               <div className="text-slate-500 italic py-4">No playlists match your search.</div>
            ) : (
               <div className="grid grid-cols-1 gap-4">
                 {playlistResults.map(pl => (
                   <div 
                     key={pl.id} 
                     className="group flex flex-row items-center gap-4 p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 dark:border-slate-800 cursor-pointer overflow-hidden"
                     onClick={() => handlePlaylistClick(pl)}
                   >
                     {/* Cinematic Slice Thumbnail Effect mini */}
                     <div className="relative shrink-0 w-24 h-24 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden">
                       <img src={pl.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={pl.title} />
                       <div className="absolute left-0 bottom-0 top-0 w-1 bg-violet-500" />
                     </div>
                     
                     {/* Data */}
                     <div className="flex-1 min-w-0 pr-4">
                       <h3 className="text-base font-bold text-slate-900 dark:text-white truncate mb-1">
                         {pl.title}
                       </h3>
                       <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 font-medium">
                         <span>{pl.count} items</span>
                         <span>•</span>
                         <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {pl.duration}</span>
                       </div>
                       <p className="text-xs text-slate-400 truncate max-w-[200px]">{pl.description}</p>
                     </div>
                     
                     <div className="mr-2 opacity-0 group-hover:opacity-100 transition duration-300 -translate-x-2 group-hover:translate-x-0">
                       <ChevronRight className="h-5 w-5 text-violet-500" />
                     </div>
                   </div>
                 ))}
               </div>
            )}
          </section>

        </div>
      )}
    </div>
  );
}