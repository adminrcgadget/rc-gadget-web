"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Menu, ExternalLink } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If on /admin/login, don't show the dashboard shell
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-black text-white">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">
      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden h-16 bg-black border-b border-zinc-800/90 px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:text-[#FF5A00] transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative h-7 w-32">
            <Image
              src="/logo/Screenshot 2026-08-18 121555.png"
              alt="RC GADGETS"
              fill
              sizes="150px"
              className="object-contain object-left"
              priority
            />
          </div>
        </div>

        <Link
          href="/"
          target="_blank"
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[#FF5A00] text-xs font-bold flex items-center gap-1"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <AdminSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen bg-black">
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto bg-black">
          {children}
        </main>
      </div>
    </div>
  );
}
