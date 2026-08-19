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
  const mobileImg = "/assets/all-vehicles-clean.webp";

  return (
    <section id="coming-soon" className="py-4 sm:py-6 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-4">
        
        {/* Section Heading */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="h-0.5 w-5 sm:w-6 bg-[#FF5A00]" />
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#FF5A00]">
            COMING SOON
          </span>
        </div>

        {/* 1. DESKTOP VIEW (>= lg): 2-Column Split Card */}
        <div className="hidden lg:block relative rounded-3xl bg-white border border-gray-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="grid grid-cols-12 items-center p-12 gap-8">
            {/* Left Column: Headlines & CTA */}
            <div className="col-span-6 space-y-4 relative z-10">
              <div className="inline-block text-xs font-black uppercase tracking-widest text-[#FF5A00] select-none bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                COMING SOON
              </div>

              <div className="space-y-0.5 font-black italic uppercase tracking-tight select-none">
                <div className="text-5xl xl:text-6xl text-[#111111] font-black leading-none">
                  {(banner?.title || "SOMETHING").replace(/coming\s*soon/gi, "").trim() || "SOMETHING"}
                </div>
                <div className="text-5xl xl:text-6xl font-black text-[#FF5A00] leading-none">
                  BIG IS COMING
                </div>
                <div className="text-3xl xl:text-4xl text-[#111111] font-black leading-tight pt-1">
                  {banner?.subtitle || "INTO NEW IN KOTTAKKAL"}
                </div>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed max-w-md pt-0.5">
                {banner?.description ||
                  "FIRST IN MALAPPURAM — Where passion meets performance. Experience high-octane RC motorsport and professional racing tracks right here in Kottakkal."}
              </p>

              <div className="pt-2">
                <Link
                  href={banner?.button_url || "#contact"}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-[#FF5A00] bg-white border-2 border-[#FF5A00] hover:bg-[#FF5A00] hover:text-white transition-all duration-300 group shadow-sm text-center"
                >
                  <span>{banner?.button_text || "STAY TUNED"}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Column: Banner Image */}
            <div className="col-span-6 relative w-full h-80 xl:h-96 flex items-center justify-center">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
                <Image
                  src={bannerImg}
                  alt={banner?.title || "RC Gadgets Fleet Showcase"}
                  fill
                  sizes="650px"
                  className="object-cover object-right transition-transform duration-700 hover:scale-[1.02]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. MOBILE VIEW (< lg): Stacked Reference Mobile Layout */}
        <div className="block lg:hidden relative rounded-3xl bg-white border border-gray-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.06)] overflow-hidden p-6 sm:p-8 text-center space-y-4">
          {/* Headlines */}
          <div className="font-black italic uppercase tracking-tight select-none space-y-0 leading-[0.95]">
            <div className="text-3xl sm:text-5xl text-[#111111] font-black leading-[0.95]">
              THE NEXT
            </div>
            <div className="text-3xl sm:text-5xl font-black text-[#FF5A00] leading-[0.95]">
              RC EXPERIENCE
            </div>
            <div className="text-3xl sm:text-5xl text-[#111111] font-black leading-[0.95]">
              IS ARRIVING.
            </div>
          </div>

          <div className="space-y-0.5 select-none pt-1">
            <div className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-gray-400">
              KOTTAKKAL
            </div>
            <div className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#111111]">
              FIRST IN MALAPPURAM
            </div>
          </div>

          {/* Clean 5-Vehicle Action Showcase */}
          <div className="relative w-full aspect-[16/7] sm:aspect-[16/6] rounded-2xl overflow-hidden shadow-md border border-zinc-200 bg-black mt-2">
            <Image
              src="/assets/coming-soon-perfect-strip.webp"
              alt="The Next RC Experience Fleet"
              fill
              sizes="(max-width: 640px) 100vw, 600px"
              className="object-cover object-center"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
};
