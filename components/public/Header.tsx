"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SiteSettings, NavigationItem } from "@/types/database";
import { Menu, X, ArrowRight } from "lucide-react";

interface HeaderProps {
  settings: SiteSettings;
  navigation: NavigationItem[];
}

export const Header: React.FC<HeaderProps> = ({ settings, navigation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = ["hero", "about", "our-world", "experience", "contact"];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveHref(`#${sectionId}`);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#050505]/95 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="#hero" className="flex items-center gap-2 group">
            {settings.logo_url ? (
              <div className="relative h-9 w-36 sm:h-11 sm:w-44 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={settings.logo_url}
                  alt={settings.business_name || "RC Gadgets"}
                  fill
                  sizes="200px"
                  className="object-contain object-left"
                  priority
                />
              </div>
            ) : (
              <div className="flex items-center gap-1.5 font-black italic tracking-wider text-xl">
                <span className="text-[#FF5500]">RC</span>
                <span className="text-white">GADGETS</span>
              </div>
            )}
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = activeHref === item.href || (item.href === "#hero" && activeHref === "");
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`relative py-1 text-xs font-extrabold uppercase tracking-widest transition-colors ${
                    isActive ? "text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5500] shadow-[0_0_8px_#FF5500]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right CTA */}
          <div className="hidden lg:flex items-center">
            <Link
              href="#contact"
              className="group px-5 py-2 rounded-lg bg-black/40 border border-[#FF5500]/70 text-[#FF5500] hover:bg-[#FF5500] hover:text-white transition-all duration-300 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#FF5500]/10 hover:shadow-[#FF5500]/30 hover:-translate-y-0.5"
            >
              <span>GET IN TOUCH</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-[#111111] border border-white/10 text-white rounded-lg hover:border-[#FF5500]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0A0A]/95 border-b border-white/10 px-6 py-6 mt-3 backdrop-blur-xl">
          <div className="flex flex-col space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-[#FF5500] flex items-center justify-between border-b border-white/5"
              >
                <span>{item.label}</span>
                <ArrowRight className="w-3 h-3 text-zinc-600" />
              </Link>
            ))}
            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 py-3 text-center text-xs font-black uppercase tracking-wider text-white bg-[#FF5500] rounded-lg shadow-lg shadow-[#FF5500]/30"
            >
              GET IN TOUCH →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
