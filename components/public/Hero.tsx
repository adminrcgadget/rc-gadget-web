"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroSection, SiteSettings } from "@/types/database";
import { ArrowRight, Phone } from "lucide-react";

interface HeroProps {
  hero: HeroSection;
  settings: SiteSettings;
}

export const Hero: React.FC<HeroProps> = ({ hero, settings }) => {
  // Content normalization logic
  let line1 = hero.eyebrow || hero.heading_line_1 || "YOUR WORLD OF";
  let line2 = hero.heading_line_2 || "REMOTE";
  let line3 = hero.heading_line_3 || "CONTROL";

  if (/remote\s*control/i.test(line1)) {
    line1 = line1.replace(/remote\s*control/gi, "").trim();
    if (!line1) line1 = "YOUR WORLD OF";
  } else if (/remote/i.test(line1) && /remote/i.test(line2)) {
    line1 = line1.replace(/remote/gi, "").trim();
    if (!line1) line1 = "YOUR WORLD OF";
  }

  if (/control/i.test(line2) && /control/i.test(line3)) {
    line2 = line2.replace(/control/gi, "").trim();
    if (!line2) line2 = "REMOTE";
  }

  const bannerImg =
    hero?.background_image_url ||
    hero?.foreground_image_url ||
    null;

  return (
    <section id="hero" className="pt-20 sm:pt-24 pb-4 sm:pb-6 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Exact Panoramic Floating White Card Container */}
        <div className="relative rounded-3xl bg-white border border-gray-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.06)] overflow-hidden min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] flex items-center">
          
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center p-6 sm:p-10 lg:p-12 xl:p-14 relative z-10">
            
            {/* Left Column: Typography & CTAs (Col 5) */}
            <div className="lg:col-span-5 space-y-3.5 sm:space-y-4">
              
              {/* Tag / Eyebrow */}
              <div className="text-xs font-black uppercase tracking-wider text-[#FF5A00]">
                {line1}
              </div>

              {/* Main Headline */}
              <div className="space-y-0 font-black italic uppercase tracking-tight select-none">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black italic text-[#111111] leading-[0.9]">
                  {line2}
                </h1>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black italic text-[#FF5A00] leading-[0.9]">
                  {line3}
                </div>
              </div>

              {/* Narrative Description */}
              <p className="text-xs sm:text-sm text-gray-500 max-w-sm sm:max-w-md leading-relaxed pt-1">
                {hero.description ||
                  "Where passion meets performance. Experience high-octane RC motorsport, scale engineering marvels, and professional racing tracks right here in Kottakkal."}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={hero.primary_button_url || "#our-world"}
                  className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-lg text-xs font-black uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-[#FF6A00] shadow-sm shadow-[#FF5A00]/25 transition-all duration-300 group"
                >
                  <span>{hero.primary_button_text || "LEARN MORE"}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href={hero.secondary_button_url || "#contact"}
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-lg text-xs font-black uppercase tracking-wider text-gray-800 bg-white border border-gray-200 hover:border-[#FF5A00] hover:text-[#FF5A00] transition-all duration-300 shadow-sm group"
                >
                  <Phone className="w-3.5 h-3.5 text-[#FF5A00]" />
                  <span>{hero.secondary_button_text || "CONTACT US"}</span>
                </Link>
              </div>

            </div>

          </div>

          {/* Right Column: Hero Banner Artwork — spans full right area */}
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[60%] h-full flex items-center justify-end z-0 pointer-events-none lg:pointer-events-auto">
            {bannerImg ? (
              <div className="relative w-full h-full">
                <Image
                  src={bannerImg}
                  alt={hero.heading_line_1 || "RC Gadgets Showcase"}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 850px"
                  className="object-contain object-right transition-transform duration-700"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Hero Banner Artwork (Upload in Admin)
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};