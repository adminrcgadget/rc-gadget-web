"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { SiteSettings, NavigationItem } from "@/types/database";
import { Menu, X, ArrowRight, Search } from "lucide-react";

interface HeaderProps {
  settings: SiteSettings;
  navigation: NavigationItem[];
}

export const Header: React.FC<HeaderProps> = ({ settings, navigation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#hero");

  // Exact sequence: HOME -> OUR WORLD -> COMING SOON -> ABOUT -> FEATURES -> EXPERIENCE -> CONTACT
  // Explicitly hides any 'About Us' / 'AboutUs' item
  const uniqueNavigation = useMemo(() => {
    const seen = new Set<string>();
    const filtered = (navigation || []).filter((item) => {
      const cleanLabel = (item.label || "").trim().toLowerCase().replace(/[\s\-_]/g, "");
      // Hide "About Us" item
      if (cleanLabel === "aboutus") return false;

      const key = `${(item.label || "").trim().toUpperCase()}_${(item.href || "").trim().toLowerCase()}`;
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
      if (href.includes("feature") || label.includes("feature")) return 5;
      if (href.includes("experience") || label.includes("experience")) return 6;
      if (href.includes("contact") || label.includes("contact")) return 7;
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
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveHref(`#${sectionId}`);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-zinc-800/80 h-16 sm:h-18 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="#hero" className="flex items-center gap-2 group shrink-0">
            <div className="relative h-10 w-44 sm:h-11 sm:w-48 lg:h-12 lg:w-52 flex items-center transition-transform duration-300 group-hover:scale-105">
              <Image
                src={settings.logo_url || "/logo/Screenshot 2026-08-18 121555.png"}
                alt={settings.business_name || "RC Gadgets"}
                fill
                sizes="300px"
                className="object-contain object-left scale-130 sm:scale-135 origin-left"
                priority
              />
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {uniqueNavigation.map((item) => {
              const isActive = activeHref === item.href || (item.href === "#hero" && (activeHref === "" || activeHref === "#hero"));
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`relative py-1 text-[11px] font-bold uppercase tracking-wider transition-colors ${isActive ? "text-white" : "text-[#A5A5A5] hover:text-white"
                    }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#FF5A00] shadow-[0_0_8px_#FF5A00]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: CTA & Search */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="#contact"
              className="group px-4 py-2 rounded-lg bg-[#FF5A00] hover:bg-[#FF6A00] text-white transition-all duration-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#FF5A00]/25"
            >
              <span>GET IN TOUCH</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Link>

            <button
              type="button"
              className="text-[#A5A5A5] hover:text-white transition-colors p-1"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-[#14171C] border border-white/10 text-white rounded-lg hover:border-[#FF5A00]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black border-b border-zinc-800 px-6 py-6 mt-3 shadow-2xl">
          <div className="flex flex-col space-y-3">
            {uniqueNavigation.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-[#FF5A00] flex items-center justify-between border-b border-zinc-900"
              >
                <span>{item.label}</span>
                <ArrowRight className="w-3 h-3 text-zinc-600" />
              </Link>
            ))}
            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 py-2.5 text-center text-xs font-black uppercase tracking-wider text-white bg-[#FF5A00] rounded-lg shadow-md shadow-[#FF5A00]/25"
            >
              GET IN TOUCH →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
