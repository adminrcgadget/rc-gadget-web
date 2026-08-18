"use client";

import React from "react";
import Image from "next/image";
import { Experience } from "@/types/database";

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
    },
    {
      id: "exp-2",
      title: "RC ADVENTURE TRACK",
      subtitle: "BUILT FOR EXTREME FUN",
      image_url: "/assets/rc-adventure-track.webp",
    },
  ];

  const items = experiences && experiences.length >= 2 ? experiences : (defaultExps as any);

  return (
    <section id="experience" className="py-16 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Section Header with Orange Flanking Lines */}
        <div className="flex items-center justify-center gap-4 mb-10 select-none">
          <div className="w-12 sm:w-20 h-0.5 bg-gradient-to-r from-transparent to-[#FF5500]" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black italic uppercase text-white tracking-widest text-center">
            EXPERIENCE <span className="text-[#FF5500] rc-text-glow">THE THRILL</span>
          </h2>
          <div className="w-12 sm:w-20 h-0.5 bg-gradient-to-l from-transparent to-[#FF5500]" />
        </div>

        {/* 2 Big Track Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {items.slice(0, 2).map((exp: any, idx: number) => {
            const trackImg =
              exp.image_url && !exp.image_url.includes("WhatsApp")
                ? exp.image_url
                : idx === 0
                ? "/assets/rc-car-track.webp"
                : "/assets/rc-adventure-track.webp";

            return (
              <div
                key={exp.id || idx}
                className="group relative rounded-3xl bg-[#0E0E0E] border-2 border-[#FF5500]/60 p-4 sm:p-5 shadow-2xl shadow-[#FF5500]/15 hover:border-[#FF5500] transition-all duration-500 overflow-hidden"
              >
                {/* Photo Showcase */}
                <div className="relative w-full aspect-[16/9] sm:aspect-[16/7.5] rounded-2xl overflow-hidden bg-black border border-white/10">
                  <Image
                    src={trackImg}
                    alt={exp.title || "RC Track"}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
