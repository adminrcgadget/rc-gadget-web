"use client";

import React from "react";
import Link from "next/link";
import { AboutSection as AboutType, Feature } from "@/types/database";
import { ArrowRight, ShieldCheck, Diamond, Headphones, Truck } from "lucide-react";

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
        <div className="w-11 h-11 rounded-xl bg-orange-50/80 border border-orange-100 flex items-center justify-center text-[#FF5A00] shrink-0 shadow-sm">
          <Diamond className="w-5 h-5 text-[#FF5A00]" />
        </div>
      );
    }
    if (t.includes("brand") || t.includes("trust")) {
      return (
        <div className="w-11 h-11 rounded-xl bg-orange-50/80 border border-orange-100 flex items-center justify-center text-[#FF5A00] shrink-0 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-[#FF5A00]" />
        </div>
      );
    }
    if (t.includes("support") || t.includes("expert")) {
      return (
        <div className="w-11 h-11 rounded-xl bg-orange-50/80 border border-orange-100 flex items-center justify-center text-[#FF5A00] shrink-0 shadow-sm">
          <Headphones className="w-5 h-5 text-[#FF5A00]" />
        </div>
      );
    }
    return (
      <div className="w-11 h-11 rounded-xl bg-orange-50/80 border border-orange-100 flex items-center justify-center text-[#FF5A00] shrink-0 shadow-sm">
        <Truck className="w-5 h-5 text-[#FF5A00]" />
      </div>
    );
  };

  const defaultPillars = [
    {
      id: "f-1",
      title: "PREMIUM QUALITY",
      description: "Uncompromising engineering, durable builds, and top global brands.",
    },
    {
      id: "f-2",
      title: "EXPERT SUPPORT",
      description: "Expert guidance whenever you need it.",
    },
    {
      id: "f-3",
      title: "EXTREME FUN",
      description: "Feel the adrenaline with high-speed performance and off-road adventures.",
    },
    {
      id: "f-4",
      title: "FAST & SAFE DELIVERY",
      description: "Carefully packaged, tested, and tracked delivery across Kerala and India.",
    },
  ];

  const pillarsToRender = React.useMemo(() => {
    if (features && features.length > 0) {
      return features;
    }
    return defaultPillars;
  }, [features]);

  return (
    <section id="about" className="py-12 sm:py-16 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: About RC Gadgets */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#FF5A00] select-none">
              {about?.eyebrow || "ABOUT RC GADGETS"}
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black italic uppercase text-[#111111] tracking-tight leading-[1.05] select-none">
              MORE THAN A STORE,
              <br />
              <span className="text-[#FF5A00]">IT&apos;S AN EXPERIENCE!</span>
            </h2>

            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-md">
              {about?.description ||
                "RC Gadgets is your ultimate destination for everything remote control. From high-performance RC cars to precision planes, powerful excavators to premium accessories, we bring the best of RC world to Kottakkal. Get ready for a whole new experience!"}
            </p>

            <div className="pt-2">
              <Link
                href={about?.button_url || "#contact"}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider text-[#FF5A00] bg-white border border-[#FF5A00] hover:bg-[#FF5A00] hover:text-white transition-all duration-300 group shadow-sm"
              >
                <span>{about?.button_text || "DISCOVER TRACKS"}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: 2x2 Features Grid */}
          <div className="lg:col-span-7 space-y-3">

            {/* Features Section Heading */}
            <div className="flex items-center gap-3">
              <div className="h-0.5 w-6 bg-[#FF5A00]" />
              <span className="text-[11px] font-black uppercase tracking-widest text-[#FF5A00]">
                FEATURES
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {pillarsToRender.map((pillar: any, idx: number) => (
              <div
                key={pillar.id || idx}
                className="bg-white border border-gray-200/80 hover:border-[#FF5A00]/50 rounded-2xl p-5 sm:p-6 flex items-start gap-4 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {renderPillarIcon(pillar.title)}
                <div className="space-y-1">
                  <h3 className="text-xs sm:text-sm font-black uppercase text-gray-900 tracking-wide">
                    {pillar.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
            </div>{/* end grid */}

          </div>{/* end right column */}

        </div>
      </div>
    </section>
  );
};
