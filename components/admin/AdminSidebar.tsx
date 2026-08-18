"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Sparkles,
  Image as ImageIcon,
  Layers,
  Info,
  CheckSquare,
  Flag,
  Share2,
  Menu as MenuIcon,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
  { label: "Hero Section", href: "/admin/hero", icon: Sparkles },
  { label: "Banners & Promos", href: "/admin/banners", icon: ImageIcon },
  { label: "Categories", href: "/admin/categories", icon: Layers },
  { label: "About Section", href: "/admin/about", icon: Info },
  { label: "Features", href: "/admin/features", icon: CheckSquare },
  { label: "Experiences", href: "/admin/experiences", icon: Flag },
  { label: "Social Links", href: "/admin/social", icon: Share2 },
  { label: "Navigation Menu", href: "/admin/navigation", icon: MenuIcon },
];

export const AdminSidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen = false,
  onClose,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0D0D0D] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-white/10">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-xl font-black italic tracking-wider text-[#FF5500]">
                RC
              </span>
              <span className="text-xl font-extrabold tracking-widest text-white">
                ADMIN
              </span>
            </Link>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/40">
              CMS
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-3 py-2">
              CMS Management
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[#FF5500] text-white shadow-lg shadow-[#FF5500]/20 font-bold"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-zinc-300 bg-[#141414] hover:bg-white/10 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>Live Website</span>
            </span>
            <span className="text-[10px] text-zinc-500">↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
