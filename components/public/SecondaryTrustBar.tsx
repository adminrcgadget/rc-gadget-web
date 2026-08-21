"use client";

import React from "react";
import { RotateCcw, ShieldCheck, Lock, Headphones } from "lucide-react";

export const SecondaryTrustBar: React.FC = () => {
  const items = [
    {
      icon: RotateCcw,
      title: "7 DAYS",
      subtitle: "Easy Returns",
    },
    {
      icon: ShieldCheck,
      title: "100% ORIGINAL",
      subtitle: "Genuine Products",
    },
    {
      icon: Lock,
      title: "SECURE CHECKOUT",
      subtitle: "Multiple Payment Options",
    },
    {
      icon: Headphones,
      title: "DEDICATED SUPPORT",
      subtitle: "Expert Help & Advice",
    },
  ];

  return (
    <section className="py-6 sm:py-8 bg-transparent select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 rounded-3xl bg-white border border-gray-200/80 p-6 sm:p-8 shadow-xs">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 sm:gap-4 group"
              >
                <div className="w-11 h-11 rounded-2xl bg-gray-50 group-hover:bg-orange-50 border border-gray-200/80 group-hover:border-[#FF5A00]/40 flex items-center justify-center text-gray-700 group-hover:text-[#FF5A00] transition-all duration-300 shrink-0">
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-900 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium leading-tight mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
