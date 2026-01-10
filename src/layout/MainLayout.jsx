import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      
      {/* Top Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1">
        {children ?? <Outlet />}
      </main>

      {/* Global Footer (Public Pages Only) */}
      <Footer />
    </div>
  );
}
