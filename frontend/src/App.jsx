"use client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useIsMobile } from "./hooks/useIsMobile";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "./components/Navbar";
import DesktopLayout from "./components/DesktopLayout";
import MobileLayout from "./components/MobileLayout";
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavoritesPage";
import LivePage from "./pages/LivePage";
import MessagesPage from "./pages/MessagesPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import AuthModal from "./components/AuthModal";
import { useAudioPlayer } from "./hooks/useAudioPlayer";

export default function App() {
  const isMobile = useIsMobile();
  const audioProps = useAudioPlayer();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <BrowserRouter>
        <div className="min-h-screen bg-linear-to-br from-slate-100 via-white to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-900/10">
          {!isMobile && <Navbar />}
          <main>
            {isMobile ? (
              <MobileLayout audioProps={audioProps}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/messages" element={<MessagesPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/live" element={<LivePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/search" element={<SearchPage />} />
                </Routes>
              </MobileLayout>
            ) : (
              <DesktopLayout audioProps={audioProps}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/messages" element={<MessagesPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/live" element={<LivePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/search" element={<SearchPage />} />
                </Routes>
              </DesktopLayout>
            )}
          </main>
          <AuthModal />
          <audio ref={audioProps.audioRef} preload="auto">
            <source src={audioProps.audioSrc} type="audio/mpeg" />
          </audio>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}