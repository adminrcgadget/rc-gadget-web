"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase/client";
import {
  Layers,
  Image as ImageIcon,
  Sparkles,
  Flag,
  CheckSquare,
  Share2,
  Settings,
  Menu as MenuIcon,
  ExternalLink,
  RefreshCw,
  Database,
} from "lucide-react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    categoriesCount: 8,
    bannersCount: 3,
    experiencesCount: 2,
    featuresCount: 4,
    socialCount: 4,
    navCount: 7,
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      const [cats, bans, exps, feats, socs, navs] = await Promise.all([
        supabase.from("categories").select("id", { count: "exact" }),
        supabase.from("banners").select("id", { count: "exact" }),
        supabase.from("experiences").select("id", { count: "exact" }),
        supabase.from("features").select("id", { count: "exact" }),
        supabase.from("social_links").select("id", { count: "exact" }),
        supabase.from("navigation_items").select("id", { count: "exact" }),
      ]);

      setStats({
        categoriesCount: cats.count ?? 8,
        bannersCount: bans.count ?? 3,
        experiencesCount: exps.count ?? 2,
        featuresCount: feats.count ?? 4,
        socialCount: socs.count ?? 4,
        navCount: navs.count ?? 7,
      });
    } catch (err) {
      console.error("Error loading metrics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const metricCards = [
    {
      title: "3 Promo Banners",
      count: stats.bannersCount,
      href: "/admin/banners",
      icon: ImageIcon,
      color: "from-[#FF5A00]/20 to-transparent",
      border: "border-zinc-800",
    },
    {
      title: "RC Categories",
      count: stats.categoriesCount,
      href: "/admin/categories",
      icon: Layers,
      color: "from-blue-500/10 to-transparent",
      border: "border-zinc-800",
    },
    {
      title: "Experience Tracks",
      count: stats.experiencesCount,
      href: "/admin/experiences",
      icon: Flag,
      color: "from-emerald-500/10 to-transparent",
      border: "border-zinc-800",
    },
    {
      title: "Brand Features",
      count: stats.featuresCount,
      href: "/admin/features",
      icon: CheckSquare,
      color: "from-purple-500/10 to-transparent",
      border: "border-zinc-800",
    },
    {
      title: "Social Platforms",
      count: stats.socialCount,
      href: "/admin/social",
      icon: Share2,
      color: "from-pink-500/10 to-transparent",
      border: "border-zinc-800",
    },
    {
      title: "Navigation Items",
      count: stats.navCount,
      href: "/admin/navigation",
      icon: MenuIcon,
      color: "from-zinc-500/10 to-transparent",
      border: "border-zinc-800",
    },
  ];

  return (
    <div className="space-y-8 bg-black">
      <AdminHeader
        title="Admin Control Center"
        subtitle="Live status, website content metrics, and rapid management"
      />

      {/* System Status Banner */}
      <div className="rounded-3xl bg-[#0A0A0A] border border-zinc-800/90 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5A00]/15 border border-[#FF5A00]/40 text-[#FF5A00] flex items-center justify-center shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black uppercase text-white tracking-wide">
                Live CMS Backend
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                Production Ready
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Changes made in this dashboard update the public website instantly with zero code redeploys.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={loadMetrics}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#FF5A00]" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#FF5A00] hover:bg-[#FF6A00] text-white shadow-lg shadow-[#FF5A00]/25 transition-all"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className={`group p-6 rounded-3xl bg-gradient-to-br ${card.color} bg-[#0A0A0A] border border-zinc-800 hover:border-[#FF5A00] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-400 group-hover:text-white transition-colors">
                  {card.title}
                </span>
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:bg-[#FF5A00] group-hover:text-white group-hover:border-[#FF5A00] transition-colors">
                  <Icon className="w-5 h-5 text-[#FF5A00] group-hover:text-white" />
                </div>
              </div>

              <div className="pt-6 flex items-baseline justify-between">
                <span className="text-4xl font-black text-white">
                  {isLoading ? "..." : card.count}
                </span>
                <span className="text-xs font-bold text-[#FF5A00] group-hover:underline uppercase tracking-wider">
                  Manage →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="rounded-3xl bg-[#0A0A0A] border border-zinc-800/90 p-6 space-y-4 shadow-xl">
        <h3 className="text-xs font-black uppercase tracking-widest text-white border-l-2 border-[#FF5A00] pl-3">
          Quick Management Shortcuts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/banners"
            className="p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-[#FF5A00]/50 transition-all flex items-center gap-3"
          >
            <ImageIcon className="w-5 h-5 text-[#FF5A00]" />
            <div>
              <div className="text-xs font-bold text-white uppercase">3 Promo Banners</div>
              <div className="text-[11px] text-zinc-400">Upload Slots 1, 2 &amp; 3</div>
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-[#FF5A00]/50 transition-all flex items-center gap-3"
          >
            <Layers className="w-5 h-5 text-[#FF5A00]" />
            <div>
              <div className="text-xs font-bold text-white uppercase">8 Categories</div>
              <div className="text-[11px] text-zinc-400">Photos &amp; Titles</div>
            </div>
          </Link>

          <Link
            href="/admin/hero"
            className="p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-[#FF5A00]/50 transition-all flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-[#FF5A00]" />
            <div>
              <div className="text-xs font-bold text-white uppercase">Hero Banner</div>
              <div className="text-[11px] text-zinc-400">Headlines &amp; Photos</div>
            </div>
          </Link>

          <Link
            href="/admin/experiences"
            className="p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-[#FF5A00]/50 transition-all flex items-center gap-3"
          >
            <Flag className="w-5 h-5 text-[#FF5A00]" />
            <div>
              <div className="text-xs font-bold text-white uppercase">Tracks &amp; Arena</div>
              <div className="text-[11px] text-zinc-400">Speed &amp; Adventure</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
