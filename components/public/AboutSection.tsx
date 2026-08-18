"use client";

import React from "react";
import Link from "next/link";
import { AboutSection as AboutType, Feature } from "@/types/database";
import { ArrowRight } from "lucide-react";

interface AboutAndFeaturesProps {
  about: AboutType;
  features: Feature[];
}

export const AboutSection: React.FC<AboutAndFeaturesProps> = ({ about, features }) => {
  // Custom orange outline icons for the 4 pillars exactly as in the design
  const renderPillarIcon = (title: string) => {
    const t = (title || "").toLowerCase();
    if (t.includes("quality") || t.includes("premium")) {
      return (
        <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#FF5500]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      );
    }
    if (t.includes("brand") || t.includes("trust")) {
      return (
        <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#FF5500]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    }
    if (t.includes("support") || t.includes("expert")) {
      return (
        <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#FF5500]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#FF5500]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-5l-3-4h-5v10" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    );
  };

  const defaultPillars = [
    {
      title: "PREMIUM QUALITY",
      description: "Carefully selected products for the best performance.",
    },
    {
      title: "TRUSTED BRANDS",
      description: "We work with the world's leading RC brands.",
    },
    {
      title: "EXPERT SUPPORT",
      description: "Expert guidance whenever you need it.",
    },
    {
      title: "FAST & SAFE DELIVERY",
      description: "Secure packaging and reliable delivery.",
    },
  ];

  const pillarsToRender = features && features.length > 0 ? features : (defaultPillars as any);

  return (
    <section id="about" className="py-20 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: About RC Gadgets */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-black uppercase tracking-widest text-[#FF5500]">
              {about?.eyebrow || "ABOUT RC GADGETS"}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black italic uppercase text-white tracking-tight leading-tight">
              MORE THAN A STORE, IT&apos;S AN{" "}
              <span className="text-[#FF5500] rc-text-glow">EXPERIENCE!</span>
            </h2>

            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
              {about?.description ||
                "RC Gadgets is your ultimate destination for everything remote control. From high-performance RC cars to precision planes, powerful excavators to premium accessories, we bring the best of RC world to Kottakkal. Get ready for a whole new experience!"}
            </p>

            <div className="pt-2">
              <Link
                href={about?.button_url || "#contact"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider text-white bg-[#111111] border border-[#FF5500]/70 hover:bg-[#FF5500] transition-all duration-300 group shadow-lg"
              >
                <span>{about?.button_text || "READ MORE"}</span>
                <ArrowRight className="w-4 h-4 text-[#FF5500] group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>

          {/* Right Column: 2x2 Features Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10 pt-2 lg:pt-6">
            {pillarsToRender.map((pillar: any, idx: number) => (
              <div key={pillar.id || idx} className="flex items-start gap-4 group">
                <div className="shrink-0 transition-transform duration-300 group-hover:scale-110">
                  {renderPillarIcon(pillar.title)}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-black uppercase text-white tracking-wide">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
