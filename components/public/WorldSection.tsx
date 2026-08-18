"use client";

import React from "react";
import Link from "next/link";
import { Category } from "@/types/database";

interface WorldSectionProps {
  categories: Category[];
}

export const WorldSection: React.FC<WorldSectionProps> = ({ categories }) => {
  // 5 custom crisp motorsport outline icons exactly as in the design reference
  const renderCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("car")) {
      return (
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#FF5A00]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.6C1.4 11.1 1 11.8 1 12.6V16c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      );
    }
    if (lower.includes("plane") || lower.includes("air")) {
      return (
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#FF5A00]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
      );
    }
    if (lower.includes("ship") || lower.includes("boat")) {
      return (
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#FF5A00]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 6.88" />
          <path d="M12 10V4" />
          <path d="m8 7 4-3 4 3" />
        </svg>
      );
    }
    if (lower.includes("excavator") || lower.includes("truck")) {
      return (
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#FF5A00]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 18h16" />
          <rect x="4" y="14" width="12" height="4" rx="2" />
          <path d="M7 14V8h6l3 6" />
          <path d="M14 8l5-4 3 3-4 5" />
          <circle cx="6" cy="18" r="1.5" />
          <circle cx="14" cy="18" r="1.5" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#FF5A00]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    );
  };

  const getCategorySubtext = (name: string, defaultSub?: string | null) => {
    if (defaultSub) return defaultSub;
    const lower = name.toLowerCase();
    if (lower.includes("car")) return "Speed • Power • Control";
    if (lower.includes("plane")) return "Soar Higher";
    if (lower.includes("ship") || lower.includes("boat")) return "Explore the Waters";
    if (lower.includes("excavator")) return "Build & Dig";
    return "Smart Add-ons";
  };

  const defaultItems = [
    { name: "RC CARS", short_description: "Speed • Power • Control" },
    { name: "RC PLANES", short_description: "Soar Higher" },
    { name: "RC SHIPS", short_description: "Explore the Waters" },
    { name: "RC EXCAVATORS", short_description: "Build & Dig" },
    { name: "RC GADGETS", short_description: "Smart Add-ons" },
  ];

  const itemsToRender = React.useMemo(() => {
    if (categories && categories.length > 0) {
      return categories;
    }
    return defaultItems;
  }, [categories]);

  return (
    <section id="our-world" className="py-4 sm:py-6 bg-transparent relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">

        {/* Section Heading Card */}
        <div className="flex items-center gap-3">
          <div className="h-0.5 w-6 bg-[#FF5A00]" />
          <span className="text-[11px] font-black uppercase tracking-widest text-[#FF5A00]">
            OUR WORLD
          </span>
        </div>

        {/* Sleek White Horizontal Strip Module */}
        <div className="rounded-2xl bg-white border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            {itemsToRender.map((item: any, idx: number) => (
              <Link
                key={item.id || idx}
                href="#contact"
                className="group py-5 px-4 flex flex-col items-center justify-center text-center space-y-2 hover:bg-gray-50/80 transition-all duration-300"
              >
                <div className="transition-transform duration-300 group-hover:scale-110">
                  {item.icon_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.icon_url} alt={item.name} className="w-7 h-7 object-contain" />
                  ) : (
                    renderCategoryIcon(item.name)
                  )}
                </div>
                <div className="space-y-0.5">
                  <span className="block text-xs font-black text-gray-900 uppercase tracking-wider group-hover:text-[#FF5A00] transition-colors">
                    {item.name}
                  </span>
                  <span className="block text-[10px] text-gray-500 font-medium tracking-normal">
                    {getCategorySubtext(item.name, item.short_description)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
