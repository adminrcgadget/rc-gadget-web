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
  Package,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  ShoppingBag,
  DollarSign,
  Users,
} from "lucide-react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    categoriesCount: 8,
    bannersCount: 3,
    experiencesCount: 2,
    featuresCount: 4,
    socialCount: 4,
    navCount: 7,
    productsCount: 6,
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      const [cats, bans, exps, feats, socs, navs, prods] = await Promise.all([
        supabase.from("categories").select("id", { count: "exact" }),
        supabase.from("banners").select("id", { count: "exact" }),
        supabase.from("experiences").select("id", { count: "exact" }),
        supabase.from("features").select("id", { count: "exact" }),
        supabase.from("social_links").select("id", { count: "exact" }),
        supabase.from("navigation_items").select("id", { count: "exact" }),
        supabase.from("products").select("id", { count: "exact" }),
      ]);

      setStats({
        categoriesCount: cats.count ?? 8,
        bannersCount: bans.count ?? 3,
        experiencesCount: exps.count ?? 2,
        featuresCount: feats.count ?? 4,
        socialCount: socs.count ?? 4,
        navCount: navs.count ?? 7,
        productsCount: prods.count ?? 6,
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

  return (
    <div className="space-y-8 animate-in fade-in">
      <AdminHeader
        title="Dashboard"
        subtitle="Welcome back, Admin! Here's your live store overview and quick management."
      />

      {/* 4 Executive Metric Cards matching Reference Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Revenue / Catalog Value */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
          <div className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 block">
              CATALOG REVENUE
            </span>
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              ₹12,45,800
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>↑ 24.5% vs last month</span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF5A00] flex items-center justify-center shrink-0 border border-orange-100/80">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Store Products */}
        <Link
          href="/admin/products"
          className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-between gap-4 hover:border-[#FF5A00]/50 hover:shadow-md transition-all group"
        >
          <div className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 block">
              ACTIVE PRODUCTS
            </span>
            <div className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-[#FF5A00] transition-colors">
              {isLoading ? "..." : `${stats.productsCount} Models`}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>↑ 12% live catalog</span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/80 group-hover:scale-105 transition-transform">
            <Package className="w-6 h-6" />
          </div>
        </Link>

        {/* Card 3: RC Categories */}
        <Link
          href="/admin/categories"
          className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-between gap-4 hover:border-[#FF5A00]/50 hover:shadow-md transition-all group"
        >
          <div className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 block">
              RC CATEGORIES
            </span>
            <div className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-[#FF5A00] transition-colors">
              {isLoading ? "..." : `${stats.categoriesCount} Fleet Types`}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600">
              <span>All 8 Categories Live</span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/80 group-hover:scale-105 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
        </Link>

        {/* Card 4: Promo Banners */}
        <Link
          href="/admin/banners"
          className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-between gap-4 hover:border-[#FF5A00]/50 hover:shadow-md transition-all group"
        >
          <div className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 block">
              PROMO BANNERS
            </span>
            <div className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-[#FF5A00] transition-colors">
              {isLoading ? "..." : `${stats.bannersCount} Slots`}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <span>Active &amp; Running</span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/80 group-hover:scale-105 transition-transform">
            <ImageIcon className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* Main Visual Sales & Engagement Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Sales & Visitor Analytics Chart Card */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wide">
                Sales &amp; Inquiry Overview
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Weekly traffic and WhatsApp store orders growth
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 text-xs font-bold">
              <div className="flex items-center gap-2 text-gray-800">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A00]" />
                <span>This Week</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <span>Last Week</span>
              </div>
            </div>
          </div>

          {/* SVG Smooth Multi-Line Chart (Matching Reference Screenshot) */}
          <div className="relative w-full h-56 sm:h-64 pt-4">
            <svg
              viewBox="0 0 600 200"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="#F1F3F5" strokeWidth="1" />
              <line x1="0" y1="90" x2="600" y2="90" stroke="#F1F3F5" strokeWidth="1" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="#F1F3F5" strokeWidth="1" />
              <line x1="0" y1="190" x2="600" y2="190" stroke="#F1F3F5" strokeWidth="1" />

              {/* Last Week Line (Gray) */}
              <path
                d="M 0,160 Q 150,150 250,140 T 450,100 T 600,80"
                fill="none"
                stroke="#D1D5DB"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />

              {/* This Week Gradient Area (Orange) */}
              <defs>
                <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF5A00" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#FF5A00" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <path
                d="M 0,170 Q 120,150 220,110 T 420,60 T 600,30 L 600,200 L 0,200 Z"
                fill="url(#orangeGrad)"
              />

              {/* This Week Line (Orange) */}
              <path
                d="M 0,170 Q 120,150 220,110 T 420,60 T 600,30"
                fill="none"
                stroke="#FF5A00"
                strokeWidth="3.5"
              />

              {/* Interactive Dots */}
              <circle cx="220" cy="110" r="5" fill="#FF5A00" stroke="#FFF" strokeWidth="2" />
              <circle cx="420" cy="60" r="5" fill="#FF5A00" stroke="#FFF" strokeWidth="2" />
              <circle cx="600" cy="30" r="6" fill="#FF5A00" stroke="#FFF" strokeWidth="2" />
            </svg>

            {/* X-Axis Day Labels */}
            <div className="flex justify-between text-[11px] font-bold text-gray-400 mt-2 px-1">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Live System Status & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live System Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111113] to-[#1A1A22] text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  Supabase Live
                </span>
              </div>
              <span className="text-[10px] font-black uppercase bg-white/10 px-2 py-0.5 rounded text-zinc-300">
                v2.0
              </span>
            </div>

            <div>
              <h4 className="text-base font-black uppercase tracking-wide text-white">
                Live Storefront CMS
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                All changes made across Hero, Categories, Banners, and Products publish live immediately to your customers.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={loadMetrics}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#FF5A00]" : ""}`} />
                <span>Refresh Data</span>
              </button>

              <Link
                href="/"
                target="_blank"
                className="py-2.5 px-4 rounded-xl bg-[#FF5A00] hover:bg-[#FF6A00] text-xs font-black uppercase tracking-wider text-white transition-all shadow-md shadow-[#FF5A00]/30 flex items-center gap-1.5"
              >
                <span>Store</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Management Box */}
          <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
              QUICK EDIT SHORTCUTS
            </h4>

            <div className="space-y-2">
              <Link
                href="/admin/hero"
                className="p-3 rounded-xl bg-gray-50 hover:bg-orange-50/50 border border-gray-200/60 hover:border-[#FF5A00]/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#FF5A00]" />
                  <span className="text-xs font-bold text-gray-800 group-hover:text-[#FF5A00] transition-colors">
                    Hero 3-Banner Slider
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#FF5A00]" />
              </Link>

              <Link
                href="/admin/banners"
                className="p-3 rounded-xl bg-gray-50 hover:bg-orange-50/50 border border-gray-200/60 hover:border-[#FF5A00]/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <ImageIcon className="w-4 h-4 text-[#FF5A00]" />
                  <span className="text-xs font-bold text-gray-800 group-hover:text-[#FF5A00] transition-colors">
                    3 Promotional Banners
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#FF5A00]" />
              </Link>

              <Link
                href="/admin/categories"
                className="p-3 rounded-xl bg-gray-50 hover:bg-orange-50/50 border border-gray-200/60 hover:border-[#FF5A00]/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-[#FF5A00]" />
                  <span className="text-xs font-bold text-gray-800 group-hover:text-[#FF5A00] transition-colors">
                    8 RC Categories
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#FF5A00]" />
              </Link>

              <Link
                href="/admin/settings"
                className="p-3 rounded-xl bg-gray-50 hover:bg-orange-50/50 border border-gray-200/60 hover:border-[#FF5A00]/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-[#FF5A00]" />
                  <span className="text-xs font-bold text-gray-800 group-hover:text-[#FF5A00] transition-colors">
                    Store Phone &amp; Locations
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#FF5A00]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
