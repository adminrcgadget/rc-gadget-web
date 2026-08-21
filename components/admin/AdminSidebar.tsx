"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
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
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products Catalog", href: "/admin/products", icon: Package },
  { label: "3 Promo Banners", href: "/admin/banners", icon: ImageIcon },
  { label: "Our Categories", href: "/admin/categories", icon: Layers },
  { label: "Hero Banner", href: "/admin/hero", icon: Sparkles },
  { label: "Tracks & Experience", href: "/admin/experiences", icon: Flag },
  { label: "About Section", href: "/admin/about", icon: Info },
  { label: "Why Choose Us", href: "/admin/features", icon: CheckSquare },
  { label: "Site & Contacts", href: "/admin/settings", icon: Settings },
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
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-black border-r border-zinc-800/90 flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-zinc-800/90 bg-black">
            <Link href="/admin" className="flex items-center gap-2">
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
            </Link>
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#FF5A00]/20 text-[#FF5A00] border border-[#FF5A00]/40">
              CMS
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)]">
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-3 py-2">
              Store CMS Modules
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-[#FF5A00] text-white shadow-lg shadow-[#FF5A00]/25 font-black"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
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
        <div className="p-4 border-t border-zinc-800/90 space-y-2 bg-black">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-[#FF5A00]/50 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span>Live Website</span>
            </span>
            <span className="text-[10px] text-zinc-500">↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
