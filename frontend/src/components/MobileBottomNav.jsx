"use client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Radio, Search, MessageSquare, User } from "lucide-react";
import { useAuthStore } from "../stores/authStore";

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/live", icon: Radio, label: "Live" },
    { path: "/messages", icon: MessageSquare, label: "Messages" },
    { path: "/search", icon: Search, label: "Search" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const handleProfileClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      navigate("/login");
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={item.path === "/profile" ? handleProfileClick : undefined}
            className={`flex flex-col items-center gap-1 text-xs transition-colors ${
              location.pathname === item.path
                ? "text-primary"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
