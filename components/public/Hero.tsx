"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroSection, SiteSettings } from "@/types/database";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  hero: HeroSection;
  settings: SiteSettings;
}

export const Hero: React.FC<HeroProps> = ({ hero, settings }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] sm:min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-[#050505]"
    >
      {/* Background Atmosphere & Ambient Lighting */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#FF5500]/15 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-[#FF5500]/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Subtle Sparks & Smoke Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#FF5500_0.75px,transparent_0.75px)] [background-size:36px_36px] opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          
          {/* Left Column: Bold Motorsport Typography & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6 pt-4 sm:pt-0">
            
            {/* Headlines */}
            <div className="space-y-0 tracking-tight font-black uppercase italic select-none">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl text-white font-black tracking-tight leading-[1.05]">
                {hero.heading_line_1 || "YOUR WORLD OF"}
              </h1>
              <div className="text-5xl sm:text-7xl lg:text-8xl font-black text-[#FF5500] tracking-tight leading-[1.0] rc-text-glow drop-shadow-[0_0_35px_rgba(255,85,0,0.45)]">
                {hero.heading_line_2 || "REMOTE"}
              </div>
              <div className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]">
                {hero.heading_line_3 || "CONTROL"}
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-zinc-300 text-sm sm:text-base max-w-lg leading-relaxed font-medium">
              Premium RC Cars, Planes, Ships, Excavators and all{" "}
              <span className="text-[#FF5500] font-bold">RC Gadgets.</span>
            </p>

            {/* Tagline Highlight */}
            <div className="text-xs sm:text-sm font-black tracking-wider uppercase leading-relaxed text-zinc-100 border-l-2 border-[#FF5500] pl-3 py-0.5">
              <span>BUILT FOR </span>
              <span className="text-[#FF5500]">PASSION.</span>
              <br />
              <span>DRIVEN BY </span>
              <span className="text-[#FF5500]">PERFORMANCE.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <Link
                href={hero.primary_button_url || "#about"}
                className="px-7 py-3.5 rounded-lg font-black text-xs sm:text-sm tracking-wider uppercase text-white bg-[#FF5500] hover:bg-[#FF6A1A] shadow-lg shadow-[#FF5500]/30 hover:shadow-[#FF5500]/60 transition-all duration-300 flex items-center justify-center gap-2 group hover:-translate-y-0.5"
              >
                <span>{hero.primary_button_text || "LEARN MORE"}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href={hero.secondary_button_url || "#contact"}
                className="px-7 py-3.5 rounded-lg font-black text-xs sm:text-sm tracking-wider uppercase text-white bg-[#111111]/80 hover:bg-[#1A1A1A] border border-white/20 hover:border-[#FF5500]/70 transition-all duration-300 flex items-center justify-center gap-2 group hover:-translate-y-0.5"
              >
                <span>{hero.secondary_button_text || "CONTACT US"}</span>
                <ArrowRight className="w-4 h-4 text-[#FF5500] transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

          </div>

          {/* Right Column: Giant RC Buggy / Monster Truck Hero Art */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
            {/* Ambient Backlight Aura */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF5500]/20 to-transparent blur-3xl rounded-full scale-110 pointer-events-none" />

            <div className="relative w-full aspect-square max-w-[550px] lg:max-w-none transition-transform duration-700 hover:scale-105">
              <Image
                src={hero.background_image_url || "/assets/hero-main-banner.webp"}
                alt="RC Gadgets Monster Buggy"
                fill
                sizes="(max-width: 1024px) 100vw, 650px"
                className="object-contain object-center drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                priority
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
