"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Banner } from "@/types/database";
import { ArrowRight } from "lucide-react";

interface ComingSoonBannerProps {
  banners: Banner[];
}

export const ComingSoonBanner: React.FC<ComingSoonBannerProps> = ({ banners }) => {
  const banner = banners?.[0] || {
    id: "banner-default",
    title: "SOMETHING",
    subtitle: "INTO NEW IN KOTTAKKAL",
    description: "FIRST IN MALAPPURAM — Where passion meets performance. Experience high-octane RC motorsport and professional racing tracks right here in Kottakkal.",
    image_url: "/assets/coming-soon-banner.webp",
    button_text: "STAY TUNED",
    button_url: "#contact",
    is_active: true,
    sort_order: 1,
    created_at: "",
    updated_at: "",
  };

  const bannerImg = banner.image_url || "/assets/coming-soon-banner.webp";

  return (
    <section id="coming-soon" className="py-4 sm:py-6 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">

        {/* Section Heading */}
        <div className="flex items-center gap-3">
          <div className="h-0.5 w-6 bg-[#FF5A00]" />
          <span className="text-[11px] font-black uppercase tracking-widest text-[#FF5A00]">
            COMING SOON
          </span>
        </div>

        {/* Floating White Card Container */}
        <div className="relative rounded-3xl bg-white border border-gray-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.05)] overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center p-6 sm:p-10 lg:p-12 gap-8">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-6 space-y-4 relative z-10">
              
              {/* Tag */}
              <div className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#FF5A00] select-none">
                COMING SOON
              </div>

              {/* Huge Headlines */}
              <div className="space-y-0.5 font-black italic uppercase tracking-tight select-none">
                <div className="text-3xl sm:text-5xl lg:text-6xl text-[#111111] font-black leading-none">
                  {(banner?.title || "SOMETHING").replace(/coming\s*soon/gi, "").trim() || "SOMETHING"}
                </div>
                <div className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#FF5A00] leading-none">
                  BIG IS COMING
                </div>
                <div className="text-xl sm:text-3xl lg:text-4xl text-[#111111] font-black leading-tight pt-1">
                  {banner?.subtitle || "INTO NEW IN KOTTAKKAL"}
                </div>
              </div>

              {/* Subtext */}
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-md pt-1">
                {banner?.description ||
                  "FIRST IN MALAPPURAM — Where passion meets performance. Experience high-octane RC motorsport and professional racing tracks right here in Kottakkal."}
              </p>

              {/* CTA Button */}
              <div className="pt-2">
                <Link
                  href={banner?.button_url || "#contact"}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider text-[#FF5A00] bg-white border border-[#FF5A00] hover:bg-[#FF5A00] hover:text-white transition-all duration-300 group shadow-sm"
                >
                  <span>{banner?.button_text || "STAY TUNED"}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

            </div>

            {/* Right Column: Banner Image */}
            <div className="lg:col-span-6 relative w-full h-64 sm:h-80 lg:h-96 flex items-center justify-center">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-50">
                <Image
                  src={bannerImg}
                  alt={banner?.title || "RC Gadgets Fleet Showcase"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 650px"
                  className="object-cover object-center lg:object-right transition-transform duration-700 hover:scale-[1.02]"
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
