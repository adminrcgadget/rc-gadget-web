"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroSection, SiteSettings } from "@/types/database";
import { ArrowRight, Phone, ChevronDown, Sparkles } from "lucide-react";

interface HeroProps {
  hero: HeroSection;
  settings: SiteSettings;
}

export const Hero: React.FC<HeroProps> = ({ hero, settings }) => {
  // Content normalization logic
  let line1 = hero.eyebrow || hero.heading_line_1 || "YOUR WORLD OF";
  let line2 = hero.heading_line_2 || "REMOTE";
  let line3 = hero.heading_line_3 || "CONTROL";

  if (/control/i.test(line2) && /control/i.test(line3)) {
    line2 = line2.replace(/control/gi, "").trim();
    if (!line2) line2 = "REMOTE";
  }

  const bannerImg =
    hero?.background_image_url ||
    hero?.foreground_image_url ||
    "/assets/all-vehicles-clean.webp";

  return (
    <section id="hero" className="pt-20 sm:pt-24 pb-4 sm:pb-6 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. DESKTOP VIEW (>= lg): Panoramic Split Card */}
        <div className="hidden lg:flex relative rounded-3xl bg-white border border-gray-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.06)] overflow-hidden min-h-[560px] items-center">
          <div className="w-full grid grid-cols-12 items-center p-12 xl:p-16 relative z-10">
            {/* Left Column */}
            <div className="col-span-5 space-y-4">
              <div className="text-xs font-black uppercase tracking-wider text-[#FF5A00]">
                {line1}
              </div>

              <div className="space-y-0 font-black italic uppercase tracking-tight select-none">
                <h1 className="text-5xl xl:text-6xl font-black italic text-[#111111] leading-[0.9]">
                  {line2}
                </h1>
                <div className="text-5xl xl:text-6xl font-black italic text-[#FF5A00] leading-[0.9]">
                  {line3}
                </div>
              </div>

              <p className="text-sm text-gray-500 max-w-md leading-relaxed pt-1">
                {hero.description ||
                  "Where passion meets performance. Experience high-octane RC motorsport, scale engineering marvels, and professional racing tracks right here in Kottakkal."}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  href={hero.primary_button_url || "#our-world"}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-[#FF6A00] shadow-sm shadow-[#FF5A00]/25 transition-all duration-300 group"
                >
                  <span>{hero.primary_button_text || "LEARN MORE"}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href={hero.secondary_button_url || "#contact"}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-black uppercase tracking-wider text-gray-800 bg-white border border-gray-200 hover:border-[#FF5A00] hover:text-[#FF5A00] transition-all duration-300 shadow-sm group"
                >
                  <Phone className="w-3.5 h-3.5 text-[#FF5A00]" />
                  <span>{hero.secondary_button_text || "CONTACT US"}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Banner Image */}
          <div className="absolute right-0 top-0 bottom-0 w-[58%] h-full flex items-center justify-end z-0">
            <div className="relative w-full h-full">
              <Image
                src={bannerImg}
                alt={hero.heading_line_1 || "RC Gadgets Showcase"}
                fill
                priority
                sizes="850px"
                className="object-contain object-right transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* 2. MOBILE / TABLET VIEW (< lg): Stacked Responsive Layout */}
        <div className="flex lg:hidden relative rounded-2xl sm:rounded-3xl bg-white border border-gray-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.06)] overflow-hidden flex-col">
          
          {/* Top: Text Content */}
          <div className="flex flex-col items-center text-center px-5 pt-7 pb-4 sm:px-10 sm:pt-10">
            
            {/* Eyebrow tag */}
            <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full bg-[#FF5A00]/10 border border-[#FF5A00]/20">
              <span className="inline-block w-1.5 h-1.5 bg-[#FF5A00] rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5A00]">
                Kottakkal — First in Malappuram
              </span>
            </div>

            {/* Main Headline */}
            <div className="font-black italic uppercase tracking-tight select-none space-y-0 leading-[0.88]">
              <h1 className="text-[2.6rem] xs:text-5xl sm:text-6xl font-black italic text-[#111111] leading-[0.88]">
                {line2}
              </h1>
              <div className="text-[2.6rem] xs:text-5xl sm:text-6xl font-black italic text-[#FF5A00] leading-[0.88]">
                {line3}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-500 max-w-xs sm:max-w-md mx-auto leading-relaxed mt-4">
              {hero.description ||
                "Where passion meets performance. Premium RC cars, planes, boats & drones right here in Kottakkal, Malappuram."}
            </p>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-2.5 w-full max-w-xs sm:max-w-sm">
              <Link
                href={hero.primary_button_url || "#our-world"}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-[#FF6A00] shadow-md shadow-[#FF5A00]/25 transition-all duration-300 active:scale-[0.97]"
              >
                <span>{hero.primary_button_text || "EXPLORE NOW"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href={hero.secondary_button_url || "#contact"}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider text-gray-800 bg-white border border-gray-200 hover:border-[#FF5A00] hover:text-[#FF5A00] transition-all duration-300 shadow-sm active:scale-[0.97]"
              >
                <Phone className="w-3.5 h-3.5 text-[#FF5A00]" />
                <span>{hero.secondary_button_text || "CONTACT US"}</span>
              </Link>
            </div>
          </div>

          {/* Bottom: Fleet Image */}
          <div className="relative w-full h-52 xs:h-60 sm:h-80 mt-2">
            <Image
              src={bannerImg}
              alt={hero.heading_line_1 || "RC Gadgets Showcase Fleet"}
              fill
              priority
              sizes="100vw"
              className="object-contain object-center transition-transform duration-700"
            />
          </div>

          {/* Scroll indicator */}
          <div className="flex items-center justify-center pb-5">
            <Link
              href="#our-world"
              className="flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-[#FF5A00] transition-colors"
            >
              <div className="w-6 h-6 rounded-full border border-zinc-200 flex items-center justify-center animate-bounce">
                <ChevronDown className="w-3.5 h-3.5 text-[#FF5A00]" />
              </div>
              <span>Scroll to explore</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};