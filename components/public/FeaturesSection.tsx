"use client";

import React from "react";
import Image from "next/image";
import { Feature } from "@/types/database";
import { Award, ShieldCheck, Wrench, Truck, Zap } from "lucide-react";

interface FeaturesSectionProps {
  features: Feature[];
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
  if (!features || features.length === 0) {
    return null;
  }

  const getFeatureIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes("quality") || lower.includes("premium"))
      return <Award className="w-7 h-7 text-[#FF5500]" />;
    if (lower.includes("brand") || lower.includes("trust"))
      return <ShieldCheck className="w-7 h-7 text-[#FF5500]" />;
    if (lower.includes("support") || lower.includes("expert") || lower.includes("service"))
      return <Wrench className="w-7 h-7 text-[#FF5500]" />;
    if (lower.includes("delivery") || lower.includes("ship") || lower.includes("fast"))
      return <Truck className="w-7 h-7 text-[#FF5500]" />;
    return <Zap className="w-7 h-7 text-[#FF5500]" />;
  };

  return (
    <section id="features" className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/5">
      {/* Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#FF5500]/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] border border-[#FF5500]/30 text-[#FF5500] text-xs font-black tracking-widest uppercase">
            <Zap className="w-3.5 h-3.5" />
            <span>THE RC GADGETS STANDARD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
            WHY CHOOSE <span className="text-[#FF5500] rc-text-glow">RC GADGETS</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Built for enthusiasts who demand championship-grade durability, precision handling, and unmatched technical mastery.
          </p>
        </div>

        {/* Features 4-Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="group relative p-7 rounded-2xl bg-[#111111] border border-white/10 hover:border-[#FF5500]/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#FF5500]/10 flex flex-col justify-between"
            >
              <div>
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-xl bg-[#080808] border border-white/10 group-hover:border-[#FF5500]/40 flex items-center justify-center mb-6 transition-colors group-hover:bg-[#FF5500]/10">
                  {feature.icon_url ? (
                    <div className="relative w-7 h-7">
                      <Image src={feature.icon_url} alt="" fill className="object-contain" />
                    </div>
                  ) : (
                    getFeatureIcon(feature.title)
                  )}
                </div>

                {/* Index Pill */}
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-2">
                  PILLAR 0{index + 1}
                </span>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-wide group-hover:text-[#FF5500] transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Accent bottom line */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Guaranteed
                </span>
                <div className="w-2 h-2 rounded-full bg-[#FF5500]/40 group-hover:bg-[#FF5500] group-hover:scale-125 transition-all" />
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
