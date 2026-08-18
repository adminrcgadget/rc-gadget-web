"use client";

import React from "react";
import Image from "next/image";
import { Banner } from "@/types/database";
import { MapPin } from "lucide-react";

interface ComingSoonBannerProps {
  banners: Banner[];
}

export const ComingSoonBanner: React.FC<ComingSoonBannerProps> = ({ banners }) => {
  const banner = banners?.[0];

  return (
    <section id="coming-soon" className="py-10 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Panoramic Card Container with rich carbon-dark background & glowing orange borders */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0D0D0D] via-[#121212] to-[#0A0A0A] border-2 border-[#FF5500]/40 overflow-hidden shadow-2xl shadow-[#FF5500]/10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Left Column: Coming Soon Headlines */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 space-y-4 relative z-10">
              <div className="font-black italic uppercase tracking-tight leading-none select-none">
                <span className="text-4xl sm:text-6xl lg:text-7xl text-white font-black">
                  COMING{" "}
                </span>
                <span className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#FF5500] rc-text-glow">
                  SOON
                </span>
              </div>

              <h3 className="text-xl sm:text-3xl font-black italic uppercase text-white tracking-wide">
                {banner?.subtitle || "INTO NEW IN KOTTAKKAL"}
              </h3>

              <div className="inline-flex items-center gap-2 pt-2 text-xs sm:text-sm font-black uppercase tracking-wider text-orange-400">
                <MapPin className="w-4 h-4 text-[#FF5500] shrink-0" />
                <span>{banner?.description || "FIRST IN MALAPPURAM"}</span>
              </div>
            </div>

            {/* Right Column: Clean Diagonal Artwork (Plane, Boat, Excavator) */}
            <div className="lg:col-span-6 relative w-full h-56 sm:h-72 lg:h-80 p-4 lg:p-6 flex items-center justify-center">
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                <Image
                  src={
                    banner?.image_url && !banner.image_url.includes("WhatsApp")
                      ? banner.image_url
                      : "/assets/coming-soon-composite.webp"
                  }
                  alt={banner?.title || "RC Gadgets Fleet Showcase"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                  priority
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
