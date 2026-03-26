"use client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useIsMobile } from "./hooks/useIsMobile";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavoritesPage";
import LivePage from "./pages/LivePage";
import MessagesPage from "./pages/MessagesPage";
import SearchPage from "./pages/SearchPage";
import AuthModal from "./components/AuthModal";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import ProfileDashboard from "./pages/ProfileDashboard";
import MobileLayout from "./components/MobileLayout";
import DesktopLayout from "./components/DesktopLayout";

export default function App() {
  const isMobile = useIsMobile();
  const audioProps = useAudioPlayer();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <BrowserRouter>
        <div className="min-h-screen bg-linear-to-br from-slate-100 via-white to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-900/10">
          {!isMobile && <Navbar />}
          
          <main>
            <Routes>
              {/* Parent Route handles the Layout logic */}
              <Route 
                element={
                  isMobile ? (
                    <MobileLayout audioProps={audioProps} />
                  ) : (
                    <DesktopLayout audioProps={audioProps} />
                  )
                }
              >
                {/* Child Routes render inside the <Outlet /> of the layouts */}
                <Route path="/" element={<HomePage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/live" element={<LivePage />} />
                <Route path="/profile" element={<ProfileDashboard />} />
                <Route path="/search" element={<SearchPage />} />
              </Route>
            </Routes>
          </main>

          <AuthModal />

          {/* Hidden Audio Element */}
          <audio ref={audioProps.audioRef} preload="auto">
            <source src={audioProps.audioSrc} type="audio/mpeg" />
          </audio>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}