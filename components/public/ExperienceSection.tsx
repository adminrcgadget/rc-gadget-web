"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Experience } from "@/types/database";
import { ArrowRight } from "lucide-react";

interface ExperienceSectionProps {
  experiences: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  const defaultExps = [
    {
      id: "exp-1",
      title: "RC CAR TRACK",
      subtitle: "FOR SPEED LOVERS",
      image_url: "/assets/rc-car-track.webp",
      button_url: "#contact",
    },
    {
      id: "exp-2",
      title: "RC ADVENTURE TRACK",
      subtitle: "BUILT FOR EXTREME FUN",
      image_url: "/assets/rc-adventure-track.webp",
      button_url: "#contact",
    },
  ];

  const uniqueItems = React.useMemo(() => {
    if (experiences && experiences.length > 0) {
      return experiences;
    }
    return defaultExps;
  }, [experiences]);

  return (
    <section id="experience" className="py-10 sm:py-14 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Section Header with Orange Flanking Lines */}
        <div className="flex flex-col items-center justify-center mb-8 select-none">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <div className="w-8 sm:w-16 h-0.5 bg-gradient-to-r from-transparent to-[#FF5A00]" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black italic uppercase text-[#111111] tracking-widest text-center">
              EXPERIENCE <span className="text-[#FF5A00]">THE THRILL</span>
            </h2>
            <div className="w-8 sm:w-16 h-0.5 bg-gradient-to-l from-transparent to-[#FF5A00]" />
          </div>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-1.5 font-medium">
            Explore Our Premium RC Collection
          </p>
        </div>

        {/* 2 Big Cinematic Track Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {uniqueItems.map((exp: any, idx: number) => {
            const trackImg =
              exp.image_url && !exp.image_url.includes("WhatsApp")
                ? exp.image_url
                : idx === 0
                ? "/assets/rc-car-track.webp"
                : "/assets/rc-adventure-track.webp";

            return (
              <Link
                key={exp.id || idx}
                href={exp.button_url || "#contact"}
                className="group relative rounded-2xl bg-[#0D0F12] border border-[#FF5A00]/40 hover:border-[#FF5A00] p-2.5 sm:p-3 shadow-2xl shadow-black/80 transition-all duration-500 overflow-hidden block"
              >
                {/* Photo Showcase Container */}
                <div className="relative w-full aspect-[16/9] sm:aspect-[16/8.5] rounded-xl overflow-hidden bg-black">
                  <Image
                    src={trackImg}
                    alt={exp.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Dark gradient overlay for bottom text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Top-Left Orange Badge */}
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-[#FF5A00]/70 flex items-center justify-center text-[#FF5A00] shadow-md">
                    {idx === 0 ? (
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#FF5A00]" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.6C1.4 11.1 1 11.8 1 12.6V16c0 .6.4 1 1 1h2" />
                        <circle cx="7" cy="17" r="2" />
                        <circle cx="17" cy="17" r="2" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#FF5A00]" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 18h16" />
                        <rect x="4" y="14" width="12" height="4" rx="2" />
                        <path d="M7 14V8h6l3 6" />
                        <path d="M14 8l5-4 3 3-4 5" />
                        <circle cx="6" cy="18" r="1.5" />
                        <circle cx="14" cy="18" r="1.5" />
                      </svg>
                    )}
                  </div>

                  {/* Bottom Text & Circular Arrow Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-black italic uppercase text-[#F5F5F5] tracking-wide">
                        {exp.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs font-bold italic uppercase text-[#A5A5A5] tracking-wider mt-0.5">
                        {exp.subtitle}
                      </p>
                    </div>

                    <div className="w-7 h-7 rounded-full border border-[#FF5A00] flex items-center justify-center text-[#FF5A00] group-hover:bg-[#FF5A00] group-hover:text-white transition-all shadow-md">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};
