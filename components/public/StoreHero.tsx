"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { HeroSection } from "@/types/database";
import { ImageIcon } from "lucide-react";

interface StoreHeroProps {
  hero?: HeroSection;
  heroSlides?: HeroSection[];
}

function getValidUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export const StoreHero: React.FC<StoreHeroProps> = ({ hero, heroSlides }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Collect all slides from heroSlides or single hero prop
  const sourceSlides =
    heroSlides && heroSlides.length > 0
      ? heroSlides
      : hero
      ? [hero]
      : [];

  const slides = sourceSlides
    .map((slide, idx) => {
      const desktop = getValidUrl(slide.background_image_url);
      const mobile = getValidUrl(slide.foreground_image_url) || desktop;
      const target = getValidUrl(slide.primary_button_url) || "#shop-by-category";

      return {
        id: slide.id || `slide-${idx + 1}`,
        title: slide.heading_line_1 || `RC GADGETS Hero Slide ${idx + 1}`,
        desktopUrl: desktop,
        mobileUrl: mobile,
        targetUrl: target,
        hasImage: Boolean(desktop || mobile),
      };
    })
    .filter((s) => s.hasImage);

  const totalSlides = slides.length;

  // Silky Smooth Auto-Slide Timer (every 4.5 seconds when not hovered)
  useEffect(() => {
    if (totalSlides <= 1 || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSlides, isHovered]);

  return (
    <section id="hero" className="py-2 sm:py-4 bg-transparent select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/90 bg-white shadow-sm hover:shadow-md transition-all max-h-[500px] sm:max-h-[560px] md:max-h-[630px] lg:max-h-[660px]"
        >
          {totalSlides > 0 ? (
            <div className="relative w-full overflow-hidden bg-white">
              {/* Slides with Silky Smooth Crossfade Transition */}
              {slides.map((slide, idx) => {
                const isActive = activeSlide === idx;

                return (
                  <div
                    key={slide.id}
                    className={`w-full transition-opacity duration-1000 ease-in-out ${
                      idx === 0 ? "relative" : "absolute inset-0"
                    } ${
                      isActive
                        ? "opacity-100 z-10 pointer-events-auto"
                        : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <Link
                      href={slide.targetUrl}
                      className="relative block w-full bg-white"
                    >
                      {/* Desktop Banner */}
                      {slide.desktopUrl && (
                        <img
                          src={slide.desktopUrl}
                          alt={slide.title}
                          className={`w-full h-72 sm:h-[340px] md:h-[480px] lg:h-[600px] xl:h-[630px] object-cover object-center block ${
                            slide.mobileUrl !== slide.desktopUrl
                              ? "hidden sm:block"
                              : "block"
                          }`}
                          loading={idx === 0 ? "eager" : "lazy"}
                        />
                      )}

                      {/* Mobile Banner */}
                      {slide.mobileUrl && slide.mobileUrl !== slide.desktopUrl && (
                        <img
                          src={slide.mobileUrl}
                          alt={slide.title}
                          className="w-full h-64 sm:h-80 object-cover object-center block sm:hidden"
                          loading={idx === 0 ? "eager" : "lazy"}
                        />
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Clean Empty Banner Slot */
            <Link
              href="/admin/hero"
              className="relative block w-full py-16 sm:py-24 bg-gray-50/90 hover:bg-orange-50/30 transition-colors"
            >




              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 text-gray-400 group-hover:text-[#FF5A00] group-hover:border-[#FF5A00]/40 flex items-center justify-center transition-all shadow-xs">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-800 group-hover:text-[#FF5A00] transition-colors">
                    Hero 3-Slide Auto Banner Slot
                  </h2>
                  <p className="text-xs text-gray-500 max-w-md">
                    Upload your 3 hero banner slides in Admin Panel → Hero Banner
                  </p>
                </div>
                <span className="px-4 py-2 rounded-full bg-[#FF5A00] text-white text-[11px] font-black uppercase tracking-wider shadow-md shadow-[#FF5A00]/25">
                  Upload via Admin Panel
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};
