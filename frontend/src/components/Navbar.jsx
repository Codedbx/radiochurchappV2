"use client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, LogOut, User, Heart, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuthStore } from "../stores/authStore";
import { useAppStore } from "../stores/appStore";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuthStore();
  const { openAuthModal } = useAppStore();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/50 bg-white/95 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/80">
      <div className="container mx-auto px-4 py-4 max-w-[90rem]">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition min-w-0"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
              <img
                src="/images/loveworld-logo.png"
                className="rounded-full"
                alt="logo"
              />
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                Christ Embassy Kaduna
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                Online Radio Church
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links + Search */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (window.location.pathname !== "/") {
                  navigate("/");
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }, 100);
                } else {
                  // Trigger custom event to switch to home tab
                  window.dispatchEvent(new CustomEvent("switchToHomeTab"));
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }, 50);
                }
              }}
              className="text-slate-700 dark:text-slate-300 hover:text-violet-600 transition cursor-pointer"
            >
              Home
            </button>
            <Link
              to="/messages"
              className="text-slate-700 dark:text-slate-300 hover:text-violet-600 transition"
            >
              Messages
            </Link>
            {isLoggedIn && (
              <Link
                to="/favorites"
                className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-violet-600 transition"
              >
                <Heart className="h-4 w-4" /> Favorites
              </Link>
            )}
            <form onSubmit={handleSearch} className="relative w-64">
              <Input
                type="search"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-2 py-1 text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            </form>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {user?.email}
                  </p>
                </div>
                <Link
                  to="/profile"
                  className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:shadow-lg transition"
                >
                  <User className="h-4 w-4" />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-4">
                <Button
                  onClick={() => openAuthModal("login")}
                  variant="secondary"
                  className="dark:bg-slate-800"
                >
                  Login
                </Button>
                <Button
                  onClick={() => openAuthModal("signup")}
                  className="bg-gradient-to-r from-violet-600 to-purple-600"
                >
                  Sign Up
                </Button>
              </div>
            )}
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
            >
              <div className="space-y-3">
                <button
                  onClick={() => {
                    if (window.location.pathname !== "/") {
                      navigate("/");
                      setTimeout(
                        () => window.scrollTo({ top: 0, behavior: "smooth" }),
                        100,
                      );
                    } else {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-2 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                >
                  Home
                </button>
                <Link
                  to="/messages"
                  className="block px-2 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Messages
                </Link>
                {isLoggedIn && (
                  <Link
                    to="/favorites"
                    className="block px-2 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Favorites
                  </Link>
                )}
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="search"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-2 py-1 text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                </form>
                {!isLoggedIn ? (
                  <>
                    <Button
                      onClick={() => {
                        openAuthModal("login");
                        setIsMobileMenuOpen(false);
                      }}
                      variant="secondary"
                      className="w-full"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => {
                        openAuthModal("signup");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-violet-600 to-purple-600"
                    >
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      className="block px-2 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      variant="ghost"
                      className="w-full justify-start text-red-600"
                    >
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
