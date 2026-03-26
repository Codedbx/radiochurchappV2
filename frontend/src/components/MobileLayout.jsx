"use client";
import { Outlet } from "react-router-dom";
import MobileBottomNav from "./MobileBottomNav";
import MobileCompactPlayer from "./MobileCompactPlayer";

export default function MobileLayout({ audioProps, children }) {
  return (
    <div className="relative min-h-screen pb-16">
      <main className="px-4 py-6 pb-24">
        <Outlet />
      </main>
      <MobileCompactPlayer audioProps={audioProps} />
      <MobileBottomNav />
    </div>
  );
}