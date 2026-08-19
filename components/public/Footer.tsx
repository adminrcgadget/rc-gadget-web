"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteSettings, NavigationItem, SocialLink } from "@/types/database";
import { ChevronRight, ChevronDown, ArrowUp, Phone, Mail, MapPin } from "lucide-react";

interface FooterProps {
  settings: SiteSettings;
  navigation: NavigationItem[];
  socialLinks: SocialLink[];
}

export const Footer: React.FC<FooterProps> = ({
  settings,
}) => {
  const [openSection, setOpenSection] = useState<string | null>("quick-links");

  const toggleSection = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { label: "Home", href: "#hero" },
    { label: "Our World", href: "#our-world" },
    { label: "Coming Soon", href: "#coming-soon" },
    { label: "About RC Gadgets", href: "#about" },
    { label: "Experience Tracks", href: "#experience" },
    { label: "Contact Us", href: "#contact" },
  ];

  const ourWorldLinks = [
    { label: "RC Cars", href: "#our-world" },
    { label: "RC Planes", href: "#our-world" },
    { label: "RC Ships", href: "#our-world" },
    { label: "RC Excavators", href: "#our-world" },
    { label: "ALL RC Gadgets", href: "#our-world" },
  ];

  return (
    <footer className="bg-black text-gray-400 pt-12 pb-10 relative overflow-hidden border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Brand Section */}
        <div className="space-y-2">
          <Link href="#hero" className="inline-block group">
            <div className="relative h-10 w-48 sm:h-12 sm:w-52">
              <Image
                src={settings.logo_url || "/logo/Screenshot 2026-08-18 121555.png"}
                alt={settings.business_name || "RC Gadgets"}
                fill
                sizes="220px"
                className="object-contain object-left scale-125 origin-left"
              />
            </div>
          </Link>
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            {settings.tagline || "YOUR WORLD OF REMOTE CONTROL"}
          </p>
        </div>

        {/* 1. MOBILE VIEW (< md): Interactive Accordions */}
        <div className="block md:hidden space-y-3 pt-2">
          {/* Accordion 1: Quick Links */}
          <div className="border border-zinc-800/80 rounded-2xl overflow-hidden bg-[#0A0A0A]">
            <button
              onClick={() => toggleSection("quick-links")}
              className="w-full px-5 py-4 flex items-center justify-between text-left text-xs font-black uppercase tracking-wider text-white select-none active:bg-zinc-900/60"
            >
              <span>QUICK LINKS</span>
              <ChevronDown
                className={`w-4 h-4 text-[#FF5A00] transition-transform duration-300 ${
                  openSection === "quick-links" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSection === "quick-links" && (
              <div className="px-5 pb-4 pt-1 border-t border-zinc-900/80 space-y-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between py-1 text-xs text-zinc-400 hover:text-white"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-3 h-3 text-zinc-600" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Accordion 2: Our World */}
          <div className="border border-zinc-800/80 rounded-2xl overflow-hidden bg-[#0A0A0A]">
            <button
              onClick={() => toggleSection("our-world")}
              className="w-full px-5 py-4 flex items-center justify-between text-left text-xs font-black uppercase tracking-wider text-white select-none active:bg-zinc-900/60"
            >
              <span>OUR WORLD</span>
              <ChevronDown
                className={`w-4 h-4 text-[#FF5A00] transition-transform duration-300 ${
                  openSection === "our-world" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSection === "our-world" && (
              <div className="px-5 pb-4 pt-1 border-t border-zinc-900/80 space-y-2">
                {ourWorldLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between py-1 text-xs text-zinc-400 hover:text-white"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-3 h-3 text-zinc-600" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Accordion 3: Store & Contact Info */}
          <div className="border border-zinc-800/80 rounded-2xl overflow-hidden bg-[#0A0A0A]">
            <button
              onClick={() => toggleSection("contact-info")}
              className="w-full px-5 py-4 flex items-center justify-between text-left text-xs font-black uppercase tracking-wider text-white select-none active:bg-zinc-900/60"
            >
              <span>LOCATIONS & CONTACT</span>
              <ChevronDown
                className={`w-4 h-4 text-[#FF5A00] transition-transform duration-300 ${
                  openSection === "contact-info" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSection === "contact-info" && (
              <div className="px-5 pb-4 pt-2 border-t border-zinc-900/80 space-y-4 text-xs text-zinc-400">
                {/* Main Store */}
                <div className="space-y-1">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#FF5A00] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Main Hub — Kottakkal</span>
                      <span>Parambilangadi, Malappuram, Kerala</span>
                    </div>
                  </div>
                </div>

                {/* Upcoming Branches */}
                <div className="space-y-2 pt-2 border-t border-zinc-900">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5A00] block">
                    Upcoming Branches
                  </span>
                  
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="text-zinc-300 font-medium">HiLITE Mall, Calicut</span>
                    </div>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FF5A00]/20 text-[#FF5A00] border border-[#FF5A00]/30 shrink-0">
                      Coming Soon
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="text-zinc-300 font-medium">Mini Ooty, Vengara</span>
                    </div>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FF5A00]/20 text-[#FF5A00] border border-[#FF5A00]/30 shrink-0">
                      Coming Soon
                    </span>
                  </div>
                </div>

                {/* Contact links */}
                <div className="space-y-2 pt-2 border-t border-zinc-900">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#FF5A00] shrink-0" />
                    <a href="tel:+917510110155" className="hover:text-white font-semibold text-zinc-300">+91 75 101 101 55</a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#FF5A00] shrink-0" />
                    <a href="mailto:rcgadgetsstore@gmail.com" className="hover:text-white">rcgadgetsstore@gmail.com</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. DESKTOP VIEW (>= md): Clean 4-Column Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8 pt-4">
          
          {/* QUICK LINKS */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group text-xs text-zinc-400 hover:text-white flex items-center justify-between transition-colors py-0.5"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#FF5A00] transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* OUR WORLD */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">
              OUR WORLD
            </h4>
            <ul className="space-y-2.5">
              {ourWorldLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group text-xs text-zinc-400 hover:text-white flex items-center justify-between transition-colors py-0.5"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#FF5A00] transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* STORE LOCATIONS */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">
              OUR LOCATIONS
            </h4>
            <div className="space-y-3.5 text-xs text-zinc-400">
              {/* Active Kottakkal Store */}
              <div className="space-y-1">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#FF5A00] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Main Hub — Kottakkal</span>
                    <span className="text-[11px] text-zinc-400 leading-snug block">
                      Parambilangadi, Malappuram, Kerala
                    </span>
                  </div>
                </div>
              </div>

              {/* Upcoming Calicut */}
              <div className="space-y-1 pt-2 border-t border-zinc-900">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-zinc-300 block">HiLITE Mall</span>
                      <span className="text-[10px] text-zinc-500">Calicut, Kerala</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FF5A00]/20 text-[#FF5A00] border border-[#FF5A00]/30 shrink-0">
                    Coming Soon
                  </span>
                </div>
              </div>

              {/* Upcoming Mini Ooty Vengara */}
              <div className="space-y-1 pt-2 border-t border-zinc-900">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-zinc-300 block">Mini Ooty</span>
                      <span className="text-[10px] text-zinc-500">Vengara, Malappuram</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FF5A00]/20 text-[#FF5A00] border border-[#FF5A00]/30 shrink-0">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CONTACT & GET IN TOUCH */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">
              GET IN TOUCH
            </h4>
            <div className="space-y-3 text-xs text-zinc-400">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FF5A00] shrink-0" />
                <a href="tel:+917510110155" className="hover:text-white font-semibold text-zinc-300">+91 75 101 101 55</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FF5A00] shrink-0" />
                <a href="mailto:rcgadgetsstore@gmail.com" className="hover:text-white">rcgadgetsstore@gmail.com</a>
              </div>
              <p className="text-[11px] text-zinc-500 pt-1 leading-relaxed">
                First in Malappuram. Experience high-octane RC motorsport & hobby-grade vehicles.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Scroll to Top */}
        <div className="pt-6 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500">
          <p>© 2026 RC Gadgets. All Rights Reserved.</p>

          <button
            onClick={scrollToTop}
            className="w-9 h-9 rounded-full border border-zinc-800 hover:border-[#FF5A00] text-zinc-400 hover:text-[#FF5A00] flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-sm"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
