"use client";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  Menu,
  X,
  Home,
  Radio,
  Search,
  MessageSquare,
  Heart,
  User,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuthStore } from "../stores/authStore";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { path: "/", label: "Home", icon: Home },
  { path: "/live", label: "Live", icon: Radio },
  { path: "/messages", label: "Messages", icon: MessageSquare },
  { path: "/search", label: "Search", icon: Search },
  { path: "/favorites", label: "Favorites", icon: Heart, authRequired: true },
  { path: "/profile", label: "Profile", icon: User, authRequired: true },
];

export default function MobileHeader() {
  const { isLoggedIn, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleNav = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/images/loveworld-logo.png"
              alt="logo"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Christ Embassy
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Online Radio Church
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isLoggedIn && (
              <button
                onClick={() => navigate("/profile")}
                className="w-8 h-8 rounded-full bg-linear-to-r from-violet-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold"
              >
                {user?.name?.charAt(0).toUpperCase()}
              </button>
            )}
            <button
              onClick={() => setOpen((v) => !v)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed top-14 left-0 right-0 z-39 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-xl"
          >
            <nav className="px-4 py-3 space-y-1">
              {navLinks.map(({ path, label, icon: Icon, authRequired }) => {
                if (authRequired && !isLoggedIn) return null;
                return (
                  <button
                    key={path}
                    onClick={() => handleNav(path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === path
                        ? "bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}

              {!isLoggedIn ? (
                <div className="flex gap-2 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleNav("/login")}
                    className="flex-1 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleNav("/signup")}
                    className="flex-1 py-2 text-sm font-medium rounded-lg bg-linear-to-r from-violet-600 to-purple-600 text-white"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-2 pt-3 border-t border-slate-100 dark:border-slate-800"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
