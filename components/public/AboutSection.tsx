"use client";

import React from "react";
import Link from "next/link";
import { AboutSection as AboutType, Feature } from "@/types/database";
import { ArrowRight, ShieldCheck, Award, Headphones, Truck } from "lucide-react";

interface AboutAndFeaturesProps {
  about: AboutType;
  features: Feature[];
}

export const AboutSection: React.FC<AboutAndFeaturesProps> = ({ about, features }) => {
  const defaultPillars = [
    {
      id: "f-1",
      title: "PREMIUM QUALITY",
      description: "Carefully selected products for the best performance.",
    },
    {
      id: "f-2",
      title: "TRUSTED BRANDS",
      description: "We work with the world's leading hobby brands.",
    },
    {
      id: "f-3",
      title: "EXPERT SUPPORT",
      description: "Expert guidance whenever you need it.",
    },
    {
      id: "f-4",
      title: "FAST & SAFE DELIVERY",
      description: "Secure packaging and fast delivery across India.",
    },
  ];

  const renderPillarIcon = (title: string) => {
    const t = (title || "").toLowerCase();
    if (t.includes("quality") || t.includes("premium")) {
      return <ShieldCheck className="w-5 h-5 text-[#FF5A00]" />;
    }
    if (t.includes("brand") || t.includes("trust")) {
      return <Award className="w-5 h-5 text-[#FF5A00]" />;
    }
    if (t.includes("support") || t.includes("expert")) {
      return <Headphones className="w-5 h-5 text-[#FF5A00]" />;
    }
    return <Truck className="w-5 h-5 text-[#FF5A00]" />;
  };

  const pillarsToRender = React.useMemo(() => {
    if (features && features.length > 0) {
      return features;
    }
    return defaultPillars;
  }, [features]);

  return (
    <section id="about" className="py-8 sm:py-14 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. DESKTOP VIEW (>= lg): Left Story & Right 2x2 Features Grid */}
        <div className="hidden lg:grid grid-cols-12 gap-12 items-center">
          {/* Left Column: About RC Gadgets */}
          <div className="col-span-5 space-y-4">
            <div className="text-xs font-black uppercase tracking-widest text-[#FF5A00]">
              {about?.eyebrow || "ABOUT RC GADGETS"}
            </div>

            <h2 className="text-4xl xl:text-5xl font-black italic uppercase text-[#111111] tracking-tight leading-[1.05] select-none">
              MORE THAN A STORE,
              <br />
              <span className="text-[#FF5A00]">IT&apos;S AN EXPERIENCE!</span>
            </h2>

            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              {about?.description ||
                "RC Gadgets is your ultimate destination for everything remote control. From high-performance RC cars to precision planes, powerful excavators to premium accessories, we bring the best of RC world to Kottakkal. Get ready for a whole new experience!"}
            </p>

            <div className="pt-2">
              <Link
                href={about?.button_url || "#experience"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider text-[#FF5A00] bg-white border border-[#FF5A00] hover:bg-[#FF5A00] hover:text-white transition-all duration-300 group shadow-sm"
              >
                <span>{about?.button_text || "DISCOVER TRACKS"}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: 2x2 Features Grid */}
          <div className="col-span-7 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-0.5 w-6 bg-[#FF5A00]" />
              <span className="text-xs font-black uppercase tracking-widest text-[#FF5A00]">
                FEATURES
              </span>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {pillarsToRender.map((pillar: any, idx: number) => (
                <div
                  key={pillar.id || idx}
                  className="bg-white border border-gray-200/80 hover:border-[#FF5A00]/50 rounded-2xl p-5 xl:p-6 flex items-start gap-4 transition-all duration-300 shadow-sm hover:shadow-md group"
                >
                  <div className="w-11 h-11 rounded-xl bg-orange-50/80 border border-orange-100 flex items-center justify-center text-[#FF5A00] shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    {renderPillarIcon(pillar.title)}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-black uppercase text-gray-900 tracking-wide group-hover:text-[#FF5A00] transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. MOBILE VIEW (< lg): Stacked Reference Mobile Layout */}
        <div className="block lg:hidden space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-5 bg-[#FF5A00]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#FF5A00]">
                ABOUT RC GADGETS
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black italic uppercase text-[#111111] tracking-tight leading-[1.05] select-none">
              MORE THAN A STORE,
              <br />
              <span className="text-[#FF5A00]">IT&apos;S AN EXPERIENCE.</span>
            </h2>

            <p className="text-gray-500 text-xs leading-relaxed pt-1">
              {about?.description ||
                "RC Gadgets is your ultimate destination for everything remote control. From high-performance RC cars to precision planes, powerful excavators to premium accessories, we bring the best of RC world to Kottakkal. Get ready for a whole new experience!"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3.5 pt-1">
            {pillarsToRender.map((pillar: any, idx: number) => (
              <div
                key={pillar.id || idx}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center space-y-2 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50/70 border border-orange-100 flex items-center justify-center text-[#FF5A00]">
                  {renderPillarIcon(pillar.title)}
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-xs font-black uppercase text-gray-900 tracking-wide">
                    {pillar.title}
                  </h3>
                  <p className="text-[10px] text-gray-500 leading-snug">
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
