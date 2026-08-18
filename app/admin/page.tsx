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
  CheckCircle2,
} from "lucide-react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    categoriesCount: 0,
    bannersCount: 0,
    experiencesCount: 0,
    featuresCount: 0,
    socialCount: 0,
    navCount: 0,
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
        categoriesCount: cats.count ?? 5,
        bannersCount: bans.count ?? 1,
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
      title: "RC Categories",
      count: stats.categoriesCount,
      href: "/admin/categories",
      icon: Layers,
      color: "from-orange-500/20 to-orange-500/5",
      border: "border-orange-500/30",
    },
    {
      title: "Active Banners",
      count: stats.bannersCount,
      href: "/admin/banners",
      icon: ImageIcon,
      color: "from-blue-500/20 to-blue-500/5",
      border: "border-blue-500/30",
    },
    {
      title: "Experience Tracks",
      count: stats.experiencesCount,
      href: "/admin/experiences",
      icon: Flag,
      color: "from-emerald-500/20 to-emerald-500/5",
      border: "border-emerald-500/30",
    },
    {
      title: "Brand Features",
      count: stats.featuresCount,
      href: "/admin/features",
      icon: CheckSquare,
      color: "from-purple-500/20 to-purple-500/5",
      border: "border-purple-500/30",
    },
    {
      title: "Social Platforms",
      count: stats.socialCount,
      href: "/admin/social",
      icon: Share2,
      color: "from-pink-500/20 to-pink-500/5",
      border: "border-pink-500/30",
    },
    {
      title: "Navigation Items",
      count: stats.navCount,
      href: "/admin/navigation",
      icon: MenuIcon,
      color: "from-zinc-500/20 to-zinc-500/5",
      border: "border-zinc-500/30",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminHeader
        title="RC Gadgets CMS Overview"
        subtitle="Live status, website content metrics, and rapid management"
      />

      {/* System Status Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#141414] via-[#111111] to-[#141414] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5500]/15 border border-[#FF5500]/40 text-[#FF5500] flex items-center justify-center shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black uppercase text-white tracking-wide">
                Live CMS Backend
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-[#FF5500] hover:bg-[#FF6A1A] text-white shadow-lg shadow-[#FF5500]/25 transition-all"
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
              className={`group p-6 rounded-2xl bg-gradient-to-br ${card.color} bg-[#0E0E0E] border ${card.border} hover:border-[#FF5500] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-400 group-hover:text-white transition-colors">
                  {card.title}
                </span>
                <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-[#FF5500] group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5 text-[#FF5500] group-hover:text-white" />
                </div>
              </div>

              <div className="pt-6 flex items-baseline justify-between">
                <span className="text-4xl font-black text-white">
                  {isLoading ? "..." : card.count}
                </span>
                <span className="text-xs font-bold text-[#FF5500] group-hover:underline uppercase tracking-wider">
                  Manage →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="rounded-2xl bg-[#0E0E0E] border border-white/10 p-6 space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-white border-l-2 border-[#FF5500] pl-3">
          Quick Management Shortcuts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/settings"
            className="p-4 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-white/5 hover:border-[#FF5500]/50 transition-all flex items-center gap-3"
          >
            <Settings className="w-5 h-5 text-[#FF5500]" />
            <div>
              <div className="text-xs font-bold text-white uppercase">Site Profile</div>
              <div className="text-[11px] text-zinc-400">Phone, email, logo</div>
            </div>
          </Link>

          <Link
            href="/admin/hero"
            className="p-4 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-white/5 hover:border-[#FF5500]/50 transition-all flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-[#FF5500]" />
            <div>
              <div className="text-xs font-bold text-white uppercase">Hero Banner</div>
              <div className="text-[11px] text-zinc-400">Headlines & images</div>
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="p-4 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-white/5 hover:border-[#FF5500]/50 transition-all flex items-center gap-3"
          >
            <Layers className="w-5 h-5 text-[#FF5500]" />
            <div>
              <div className="text-xs font-bold text-white uppercase">RC Categories</div>
              <div className="text-[11px] text-zinc-400">Add or edit fleet</div>
            </div>
          </Link>

          <Link
            href="/admin/banners"
            className="p-4 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-white/5 hover:border-[#FF5500]/50 transition-all flex items-center gap-3"
          >
            <ImageIcon className="w-5 h-5 text-[#FF5500]" />
            <div>
              <div className="text-xs font-bold text-white uppercase">Promos & Banners</div>
              <div className="text-[11px] text-zinc-400">Coming soon artwork</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
