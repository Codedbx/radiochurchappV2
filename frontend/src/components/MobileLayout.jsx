"use client";
import { Outlet, useLocation } from "react-router-dom";
import MobileBottomNav from "./MobileBottomNav";
import MobileCompactPlayer from "./MobileCompactPlayer";
import MobileHeader from "./MobileHeader";

export default function MobileLayout({ audioProps }) {
  const location = useLocation();
  const hideHeader = location.pathname === "/now-playing";

  return (
    <div className="relative min-h-screen pb-16">
      {!hideHeader && <MobileHeader />}
      <main className="px-4 py-6 pb-24">
        <Outlet />
      </main>
      <MobileCompactPlayer audioProps={audioProps} />
      <MobileBottomNav />
    </div>
  );
}
