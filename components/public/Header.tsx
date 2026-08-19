"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { SiteSettings, NavigationItem } from "@/types/database";
import { Menu, X, ArrowRight, Phone } from "lucide-react";

interface HeaderProps {
  settings: SiteSettings;
  navigation: NavigationItem[];
}

export const Header: React.FC<HeaderProps> = ({ settings, navigation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#hero");

  // Exact sequence: HOME -> OUR WORLD -> COMING SOON -> ABOUT -> EXPERIENCE -> CONTACT
  // Explicitly hides any 'About Us' / 'AboutUs' and 'Features' items
  const uniqueNavigation = useMemo(() => {
    const seen = new Set<string>();
    const filtered = (navigation || []).filter((item) => {
      const cleanLabel = (item.label || "").trim().toLowerCase().replace(/[\s\-_]/g, "");
      const cleanHref = (item.href || "").trim().toLowerCase();
      // Hide "About Us" item and "Features"
      if (cleanLabel === "aboutus") return false;
      if (cleanLabel === "features" || cleanHref === "#features") return false;

      const key = `${(item.label || "").trim().toUpperCase()}_${cleanHref}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const getOrderWeight = (item: NavigationItem) => {
      const href = (item.href || "").toLowerCase();
      const label = (item.label || "").toLowerCase();

      if (href.includes("hero") || label === "home") return 1;
      if (href.includes("world") || label.includes("world")) return 2;
      if (href.includes("coming") || label.includes("coming")) return 3;
      if (href.includes("about") || label === "about") return 4;
      if (href.includes("experience") || label.includes("experience")) return 5;
      if (href.includes("contact") || label.includes("contact")) return 6;
      return item.sort_order ? item.sort_order + 10 : 99;
    };

    return filtered.sort((a, b) => getOrderWeight(a) - getOrderWeight(b));
  }, [navigation]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Exact page order: hero → our-world → coming-soon → about → experience → contact
      const sections = ["contact", "experience", "about", "coming-soon", "our-world", "hero"];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveHref(`#${sectionId}`);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/95 backdrop-blur-md border-b border-zinc-800/90 shadow-lg shadow-black/20 h-16 sm:h-18"
          : "bg-black border-b border-zinc-800/80 h-16 sm:h-18"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 group shrink-0"
          >
            <div className="relative h-9 w-36 sm:h-10 sm:w-44 lg:h-11 lg:w-48 flex items-center transition-transform duration-300 group-hover:scale-105">
              <Image
                src={settings.logo_url || "/logo/Screenshot 2026-08-18 121555.png"}
                alt={settings.business_name || "RC Gadgets"}
                fill
                sizes="(max-width: 640px) 150px, (max-width: 1024px) 180px, 220px"
                className="object-contain object-left scale-125 sm:scale-130 origin-left"
                priority
              />
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {uniqueNavigation.map((item) => {
              const isActive =
                activeHref === item.href ||
                (item.href === "#hero" && (activeHref === "" || activeHref === "#hero"));
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`relative py-1 text-[11px] font-bold uppercase tracking-wider transition-colors duration-200 ${
                    isActive ? "text-white" : "text-[#A5A5A5] hover:text-white"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[#FF5A00] shadow-[0_0_8px_#FF5A00] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-3.5">
            <a
              href={`tel:${(settings.phone || "7510110155").replace(/\s+/g, "")}`}
              className="p-2 text-zinc-400 hover:text-[#FF5A00] transition-colors rounded-lg hover:bg-zinc-900 flex items-center gap-1.5 text-xs font-semibold"
              title="Call Us"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span className="text-[11px] text-zinc-300">
                {settings.phone ? `+91 ${settings.phone.replace(/^\+?91\s*/, "")}` : "+91 75 101 101 55"}
              </span>
            </a>

            <Link
              href="#contact"
              className="group px-4 py-2 rounded-lg bg-[#FF5A00] hover:bg-[#FF6A00] text-white transition-all duration-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#FF5A00]/25 hover:shadow-[#FF5A00]/40"
            >
              <span>GET IN TOUCH</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={`tel:${(settings.phone || "7510110155").replace(/\s+/g, "")}`}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[#FF5A00] hover:border-[#FF5A00]/50 transition-colors"
              aria-label="Call store"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-zinc-900 border border-zinc-800 text-white rounded-lg hover:border-[#FF5A00] transition-colors active:scale-95"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#FF5A00]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/98 backdrop-blur-xl border-b border-zinc-800 shadow-2xl shadow-black/80 px-5 py-5 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1">
            {uniqueNavigation.map((item) => {
              const isActive = activeHref === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-3 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors ${
                    isActive
                      ? "text-[#FF5A00] bg-zinc-900/80 font-black"
                      : "text-zinc-300 hover:text-white hover:bg-zinc-900/50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />}
                    {item.label}
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 ${isActive ? "text-[#FF5A00]" : "text-zinc-600"}`}
                  />
                </Link>
              );
            })}

            <div className="pt-3 border-t border-zinc-800/80 mt-2 space-y-2.5">
              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center text-xs font-black uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-[#FF6A00] rounded-xl shadow-lg shadow-[#FF5A00]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>GET IN TOUCH</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

