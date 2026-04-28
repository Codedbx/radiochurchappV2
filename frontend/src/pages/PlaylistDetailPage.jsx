import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/playerStore";
import { useAuthStore } from "@/stores/authStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useAppStore } from "@/stores/appStore";
import {
  ArrowLeft,
  MoreVertical,
  Play,
  Heart,
  Clock,
  Music,
  Pause,
} from "lucide-react";

export default function PlaylistDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { setCurrentMessage, isPlaying, setIsPlaying } = usePlayerStore();
  const { isLoggedIn } = useAuthStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { openAuthModal } = useAppStore();

  // Get playlist from navigation state
  const passedPlaylist = location.state?.playlist;

  // If no playlist passed, redirect back to playlists page
  useEffect(() => {
    if (!passedPlaylist) {
      navigate("/playlists");
    }
  }, [passedPlaylist, navigate]);

  // Show loading or null while redirecting
  if (!passedPlaylist) {
    return null;
  }

  const playlist = {
    ...passedPlaylist,
    id: id || passedPlaylist.id,
  };

  // Base sample tracks for the playlist
  const baseTracks = [
    {
      id: 1,
      title: "Faith in Action",
      speaker: "Pastor John",
      duration: "25:30",
      date: "Mar 12, 2024",
      audioUrl: "https://example.com/faith-in-action.mp3",
      image: "/images/house-exterior.jpg",
      category: "Faith",
      description: "Discover how to put your faith into action in everyday life.",
    },
    {
      id: 2,
      title: "The Power of Prayer",
      speaker: "Pastor Mary",
      duration: "22:45",
      date: "Mar 10, 2024",
      audioUrl: "https://example.com/power-of-prayer.mp3",
      image: "/images/house-exterior.jpg",
      category: "Spirituality",
      description: "Learn about the transformative power of prayer.",
    },
    {
      id: 3,
      title: "Living in Grace",
      speaker: "Pastor Chris",
      duration: "24:20",
      date: "Mar 8, 2024",
      audioUrl: "https://example.com/living-in-grace.mp3",
      image: "/images/house-exterior.jpg",
      category: "Life",
      description: "Explore what it means to live in God's grace.",
    },
    {
      id: 4,
      title: "God's Love Revealed",
      speaker: "Pastor John",
      duration: "30:15",
      date: "Mar 5, 2024",
      audioUrl: "https://example.com/gods-love.mp3",
      image: "/images/house-exterior.jpg",
      category: "Theology",
      description: "A deep dive into understanding God's love.",
    },
    {
      id: 5,
      title: "Breaking Free",
      speaker: "Pastor Sarah",
      duration: "26:50",
      date: "Mar 1, 2024",
      audioUrl: "https://example.com/breaking-free.mp3",
      image: "/images/house-exterior.jpg",
      category: "Deliverance",
      description: "Find freedom and discover liberty through Christ.",
    },
  ];

  // Dynamically generate the exact number of messages to match playlist.count
  const tracks = Array.from({ length: playlist.count || baseTracks.length }).map((_, i) => {
    const base = baseTracks[i % baseTracks.length];
    return {
      ...base,
      id: `${playlist.id}-track-${i + 1}`,
      title: `${base.title} ${i >= baseTracks.length ? `(Pt. ${Math.floor(i / baseTracks.length) + 1})` : ""}`,
    };
  });

  const isLiked = isFavorite(playlist.id);

  const handleToggleFavorite = () => {
    if (!isLoggedIn) {
      openAuthModal("login");
      return;
    }
    if (isLiked) {
      removeFavorite(playlist.id);
    } else {
      addFavorite(playlist.id, playlist);
    }
  };

  const handlePlayTrack = (track) => {
    if (!isLoggedIn) {
      openAuthModal("login");
      return;
    }

    // Toggle play/pause if clicking the same track
    const currentMsg = usePlayerStore.getState().currentMessage;
    if (currentMsg?.episodeId === track.id) {
      setIsPlaying(!isPlaying);
      return;
    }

    const trackMessage = {
      id: playlist.id, // Keep playlist ID for context
      title: track.title,
      speaker: track.speaker,
      audioUrl: track.audioUrl,
      image: playlist.image,
      category: "Playlist Track",
      description: `From ${playlist.title}`,
      episodes: tracks, // Attach the full playlist for navigation
      episodeId: track.id // Mark the current track so we know where we are in the list
    };
    setCurrentMessage(trackMessage);
  };

  const handlePlayAll = () => {
    if (!isLoggedIn) {
      openAuthModal("login");
      return;
    }

    if (tracks.length > 0) {
      const currentMsg = usePlayerStore.getState().currentMessage;
      // Check if any track from THIS playlist is currently loaded
      const isThisPlaylistPlaying = tracks.some(t => t.id === currentMsg?.episodeId);
      
      if (!isThisPlaylistPlaying) {
        handlePlayTrack(tracks[0]);
      } else {
        setIsPlaying(!isPlaying);
      }
    }
  };

  return (
    <div className="bg-transparent">
      {/* Immersive Hero Header */}
      <div className="relative pt-8 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-8 overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-3xl w-screen left-1/2 -ml-[50vw] -mt-8 [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 left-0 w-full h-[150%] bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.1),transparent_50%)]" />
        </div>
        
        <div className="relative z-10 max-w-[90rem] mx-auto flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-10 px-4 mt-2 sm:mt-4">
          <button 
            onClick={() => navigate(-1)}
            className="absolute -top-8 sm:-top-12 left-4 sm:left-6 p-2 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-white/5 shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* Playlist Cover Art - Premium Shadow */}
          <div className="w-40 h-40 sm:w-64 sm:h-64 shrink-0 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 bg-slate-800">
             <img src={playlist.image} alt={playlist.title} className="w-full h-full object-cover" />
          </div>
          
          <div className="text-center sm:text-left flex-1 min-w-0 w-full">
            <span className="text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300 mb-2 sm:mb-4 block">
              Official Playlist
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-3 sm:mb-6 leading-none truncate px-2 sm:px-0">
              {playlist.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg font-medium max-w-2xl mb-6 sm:mb-8 line-clamp-2 px-4 sm:px-0">
              {playlist.description}
            </p>

            {/* Action Row - Elevated Premium Controls */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6">
               <Button 
                onClick={handlePlayAll}
                className="bg-violet-600 hover:bg-violet-700 text-white h-12 sm:h-16 px-6 sm:px-12 rounded-full shadow-lg shadow-violet-500/25 font-black text-sm sm:text-lg transition-all duration-300 hover:scale-105 active:scale-95 group/play flex-1 sm:flex-none"
               >
                 <div className="flex items-center gap-2 sm:gap-3">
                   {isPlaying ? (
                     <Pause className="h-5 w-5 sm:h-7 sm:w-7 transition-transform group-hover/play:scale-110" />
                   ) : (
                     <Play className="h-5 w-5 sm:h-7 sm:w-7 fill-current transition-transform group-hover/play:scale-110" />
                   )}
                   <span className="uppercase tracking-wider">{isPlaying ? 'Pause' : 'Play All'}</span>
                 </div>
               </Button>

               <button 
                onClick={handleToggleFavorite}
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-500 transform hover:scale-110 active:scale-90 relative overflow-hidden shrink-0 ${
                  isLiked 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                  : 'bg-white/40 dark:bg-slate-800/40 backdrop-blur-md text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-white/10 hover:bg-white/60 dark:hover:bg-slate-700/60'
                }`}
               >
                 <Heart className={`h-5 w-5 sm:h-7 sm:w-7 transition-all duration-300 ${isLiked ? 'fill-current animate-pulse' : 'group-hover:scale-110'}`} />
               </button>

               <div className="flex flex-col gap-1 sm:ml-4 py-1 sm:py-2 border-l border-slate-300/50 dark:border-white/10 pl-4 sm:pl-6">
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest">
                    <Music className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {playlist.count} Messages
                  </div>
                  <div className="flex items-center gap-2 text-[9px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {playlist.duration} Total Time
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tracklist Area */}
      <div className="relative max-w-7xl mx-auto px-2 sm:px-8 -mt-8 sm:-mt-12 z-20 pb-12">
        <div className="w-full mt-8 sm:mt-12">
          {/* Header Row */}
          <div className="hidden sm:flex items-center px-4 py-2 border-b border-slate-200 dark:border-white/10 mb-4 opacity-50">
            <div className="w-12 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">#</div>
            <div className="flex-1 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Title</div>
            <div className="w-24 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</div>
          </div>

          <div className="space-y-1 sm:space-y-0.5">
            {tracks.map((track, index) => {
              const currentMsg = usePlayerStore.getState().currentMessage;
              const isCurrentlyPlaying = currentMsg?.episodeId === track.id && isPlaying;

              return (
                <div
                  key={track.id}
                  className="group relative flex items-center justify-between p-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-lg hover:bg-slate-200/40 dark:hover:bg-white/5 transition-all cursor-pointer border border-transparent active:scale-[0.98] sm:active:scale-100"
                  onClick={() => handlePlayTrack(track)}
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-5 sm:w-12 flex justify-center items-center shrink-0">
                      {isCurrentlyPlaying ? (
                         <div className="flex items-end gap-[2px] h-3 sm:h-4">
                            <div className="w-[2px] sm:w-[3px] bg-violet-600 dark:bg-violet-400 h-2 animate-[pulse_1s_ease-in-out_infinite]" />
                            <div className="w-[2px] sm:w-[3px] bg-violet-600 dark:bg-violet-400 h-4 animate-[pulse_1.2s_ease-in-out_infinite]" />
                            <div className="w-[2px] sm:w-[3px] bg-violet-600 dark:bg-violet-400 h-3 animate-[pulse_0.8s_ease-in-out_infinite]" />
                         </div>
                      ) : (
                        <>
                          <span className="text-[13px] sm:text-sm font-bold text-slate-400 dark:text-slate-500 group-hover:hidden">{index + 1}</span>
                          <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-current hidden group-hover:block text-slate-900 dark:text-white" />
                        </>
                      )}
                    </div>
                    
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded bg-slate-800 shrink-0 overflow-hidden shadow-sm">
                       <img src={track.image} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <h3 className={`text-[15px] sm:text-base font-bold truncate tracking-tight ${isCurrentlyPlaying ? 'text-violet-600 dark:text-violet-400' : 'text-slate-900 dark:text-white'}`}>
                        {track.title}
                      </h3>
                      <p className="text-[12px] sm:text-sm text-slate-500 dark:text-slate-400 truncate font-medium">{track.speaker}</p>
                    </div>
                  </div>

                  <div className="w-20 sm:w-24 flex justify-center items-center">
                    <div className="text-[12px] sm:text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:opacity-0 transition-opacity">
                      {track.duration}
                    </div>

                    <div className="absolute right-2 sm:right-4 opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center">
                       <button className="p-2 sm:p-2.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400">
                          <MoreVertical className="h-5 w-5" />
                       </button>
                    </div>

                    {/* Always visible more button on mobile */}
                    <div className="sm:hidden ml-2">
                       <button className="p-1 text-slate-400">
                          <MoreVertical className="h-5 w-5" />
                       </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
