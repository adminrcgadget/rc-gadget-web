"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Image as ImageIcon,
  Sparkles,
  Flag,
  Info,
  CheckSquare,
  Settings,
  Share2,
  Menu as MenuIcon,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface NavGroup {
  groupLabel?: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    groupLabel: "MAIN MENU",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Products Catalog", href: "/admin/products", icon: Package },
      { label: "Our Categories", href: "/admin/categories", icon: Layers },
      { label: "3 Promo Banners", href: "/admin/banners", icon: ImageIcon, badge: "3 Slots" },
      { label: "Hero Banner", href: "/admin/hero", icon: Sparkles },
    ],
  },
  {
    groupLabel: "EXPERIENCE & CMS",
    items: [
      { label: "Tracks & Arena", href: "/admin/experiences", icon: Flag },
      { label: "About Section", href: "/admin/about", icon: Info },
      { label: "Why Choose Us", href: "/admin/features", icon: CheckSquare },
    ],
  },
  {
    groupLabel: "PREFERENCES",
    items: [
      { label: "Site & Contacts", href: "/admin/settings", icon: Settings },
      { label: "Social Platforms", href: "/admin/social", icon: Share2 },
      { label: "Navigation Menu", href: "/admin/navigation", icon: MenuIcon },
    ],
  },
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
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-black border-r border-[#18181B] flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden bg-black">
          {/* Logo Brand Header matching Reference Design */}
          <div className="p-6 border-b border-[#18181B] bg-black shrink-0">
            <Link href="/admin" className="block group">
              <div className="relative h-8 w-40 mb-1">
                <Image
                  src="/logo/Screenshot 2026-08-18 121555.png"
                  alt="RC GADGETS"
                  fill
                  sizes="160px"
                  className="object-contain object-left transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-[#FF5A00] transition-colors">
                SEE BEYOND LIMITS • CMS
              </p>
            </Link>
          </div>

          {/* Navigation Links with Active Pill Design */}
          <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto scrollbar-none bg-black">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1.5">
                {group.groupLabel && (
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-3 py-1">
                    {group.groupLabel}
                  </div>
                )}

                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 group ${
                        isActive
                          ? "bg-[#18181C] text-white shadow-sm font-bold border border-[#27272A]"
                          : "text-zinc-400 hover:text-white hover:bg-[#121215]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? "text-[#FF5A00]"
                              : "text-zinc-500 group-hover:text-zinc-300"
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isActive
                              ? "bg-[#FF5A00]/20 text-[#FF5A00] border border-[#FF5A00]/30"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Bottom Action Footer */}
          <div className="p-4 border-t border-[#18181B] space-y-2 bg-black shrink-0">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-zinc-300 bg-[#121215] border border-[#27272A] hover:border-[#FF5A00]/40 hover:text-white transition-all group"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-[#FF5A00] group-hover:translate-x-0.5 transition-transform" />
                <span>Live Website</span>
              </span>
              <span className="text-[10px] text-zinc-500">↗</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-400/90 hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
