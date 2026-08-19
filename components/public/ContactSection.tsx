"use client";

import React from "react";
import Image from "next/image";
import { SiteSettings, SocialLink } from "@/types/database";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import { renderSocialBrandIcon } from "@/components/ui/SocialIcons";

interface ContactSectionProps {
  settings: SiteSettings;
  socialLinks?: SocialLink[];
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings, socialLinks }) => {
  const defaultSocials = [
    { id: "soc-1", platform: "Instagram", url: settings.instagram_url || "https://www.instagram.com/rc_gadgetsstore/" },
    { id: "soc-2", platform: "Facebook", url: settings.facebook_url || "https://www.facebook.com/share/19FeP3z6KV/" },
    { id: "soc-3", platform: "YouTube", url: settings.youtube_url || "https://www.youtube.com" },
    { id: "soc-4", platform: "WhatsApp", url: settings.whatsapp_number ? `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}` : "https://wa.me/917510110155" },
  ];

  const phoneNum = settings.phone ? settings.phone.replace(/^\+?91\s*/, "") : "75 101 101 55";
  const rawPhone = (settings.phone || "7510110155").replace(/[^0-9]/g, "");

  return (
    <section id="contact" className="py-6 sm:py-10 bg-transparent relative z-20 space-y-6 sm:space-y-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* 1. Dark Hero Callout Panel */}
        <div className="relative rounded-3xl bg-[#0D0F12] border border-zinc-800 p-6 sm:p-10 lg:p-12 shadow-2xl shadow-black/80 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 relative z-10">
            
            {/* Left Column: Headlines, Subtext & Action Buttons */}
            <div className="lg:col-span-7 space-y-4">
              {/* Headline */}
              <div className="space-y-0.5 font-black italic uppercase tracking-tight select-none">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black italic text-white leading-[0.95]">
                  READY TO
                </h2>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black italic text-white leading-[0.95]">
                  EXPERIENCE RC
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black italic text-[#FF5A00] leading-[0.95]">
                  LIKE NEVER BEFORE?
                </div>
              </div>

              {/* Orange bar */}
              <div className="h-0.5 w-10 bg-[#FF5A00]" />

              {/* Subtext */}
              <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed pt-1 max-w-lg">
                Visit our track and showroom in Kottakkal or connect with our team for consultations, custom builds & test drives.
              </p>

              {/* 2 Big Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 max-w-md">
                <a
                  href={`tel:${rawPhone}`}
                  className="px-6 py-3.5 rounded-2xl bg-[#FF5A00] hover:bg-[#FF6A00] text-white transition-all duration-300 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg shadow-[#FF5A00]/30 active:scale-[0.98]"
                >
                  <Phone className="w-4 h-4 fill-white" />
                  <span>CALL NOW {phoneNum}</span>
                </a>

                <a
                  href={
                    settings.whatsapp_number
                      ? `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}`
                      : "https://wa.me/917510110155"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 transition-all duration-300 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-md active:scale-[0.98]"
                >
                  <MessageSquare className="w-4 h-4 text-zinc-900 fill-zinc-900" />
                  <span>WHATSAPP US</span>
                </a>
              </div>
            </div>

            {/* Right Column (Desktop Only): High-Impact Vehicle Fleet Artwork Showcase */}
            <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center relative w-full h-64 xl:h-72">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-r from-black/40 to-transparent border border-zinc-800/60 p-2 group">
                <Image
                  src="/assets/coming-soon-perfect-strip.webp"
                  alt="RC Gadgets Fleet"
                  fill
                  sizes="500px"
                  className="object-cover object-center rounded-xl transition-transform duration-700 group-hover:scale-105"
                />
                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                
                {/* Bottom Badge */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-zinc-300 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                  <span>Kottakkal Track & Store</span>
                  <span className="text-[#FF5A00]">Open Today</span>
                </div>
              </div>
            </div>

          </div>

          {/* Ambient Background Glow */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#FF5A00]/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* 2. White Contact Info Items Panel matching reference */}
        <div className="rounded-3xl bg-white border border-gray-200/80 p-6 sm:p-8 lg:p-10 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Item 1: Visit Us */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5A00] shrink-0 shadow-sm">
                <MapPin className="w-5 h-5 text-[#FF5A00]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#FF5A00] block">
                  VISIT US
                </span>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug">
                  {settings.address && settings.city && settings.state
                    ? `${settings.city}, ${settings.address}, ${settings.state}, India`
                    : "Kottakkal, Parambilangadi, Malappuram, Kerala, India"}
                </p>
              </div>
            </div>

            {/* Item 2: Call Us */}
            <a
              href={`tel:${rawPhone}`}
              className="flex items-start gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5A00] shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5 text-[#FF5A00]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#FF5A00] block">
                  CALL US
                </span>
                <p className="text-xs sm:text-sm font-black text-gray-900 group-hover:text-[#FF5A00] transition-colors">
                  {settings.phone ? `+91 ${settings.phone.replace(/^\+?91\s*/, "")}` : "+91 75 101 101 55"}
                </p>
              </div>
            </a>

            {/* Item 3: Email Us */}
            <a
              href={`mailto:${settings.email || "rcgadgetsstore@gmail.com"}`}
              className="flex items-start gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5A00] shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5 text-[#FF5A00]" />
              </div>
              <div className="space-y-0.5 truncate">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#FF5A00] block">
                  EMAIL US
                </span>
                <p className="text-xs sm:text-sm font-black text-gray-900 group-hover:text-[#FF5A00] transition-colors truncate">
                  {settings.email || "rcgadgetsstore@gmail.com"}
                </p>
              </div>
            </a>

          </div>

          {/* Social Strip: FOLLOW US */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-4 select-none">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-900">
                FOLLOW US
              </span>
              <div className="w-8 h-0.5 bg-[#FF5A00]" />
            </div>

            <div className="flex items-center gap-3">
              {defaultSocials.map((soc: any) => (
                <a
                  key={soc.id}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-[#FF5A00] text-gray-700 hover:text-[#FF5A00] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm"
                  aria-label={soc.platform}
                >
                  {renderSocialBrandIcon(soc.platform, "w-4 h-4")}
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
