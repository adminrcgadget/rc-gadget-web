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
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#FF5500]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.6C1.4 11.1 1 11.8 1 12.6V16c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      );
    }
    if (lower.includes("plane") || lower.includes("air")) {
      return (
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#FF5500]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
      );
    }
    if (lower.includes("ship") || lower.includes("boat")) {
      return (
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#FF5500]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 6.88" />
          <path d="M12 10V4" />
          <path d="m8 7 4-3 4 3" />
        </svg>
      );
    }
    if (lower.includes("excavator") || lower.includes("truck")) {
      return (
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#FF5500]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#FF5500]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="6" />
        <path d="M6 12h4" />
        <path d="M8 10v4" />
        <circle cx="15" cy="11" r="1" />
        <circle cx="18" cy="13" r="1" />
      </svg>
    );
  };

  const defaultItems = [
    { name: "RC CARS" },
    { name: "RC PLANES" },
    { name: "RC SHIPS" },
    { name: "RC EXCAVATORS" },
    { name: "AND ALL RC GADGETS" },
  ];

  const itemsToRender = categories.length > 0 ? categories : defaultItems;

  return (
    <section id="our-world" className="py-8 bg-[#050505] relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sleek Horizontal Strip Card */}
        <div className="rounded-2xl bg-[#0E0E0E]/90 border border-[#FF5500]/40 backdrop-blur-md shadow-2xl shadow-[#FF5500]/10 overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {itemsToRender.map((item, idx) => (
              <Link
                key={idx}
                href="#contact"
                className="group p-6 flex flex-col items-center justify-center text-center space-y-3 hover:bg-[#141414] transition-all duration-300"
              >
                <div className="transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_#FF5500]">
                  {renderCategoryIcon(item.name)}
                </div>
                <span className="text-xs font-black text-white uppercase tracking-wider group-hover:text-[#FF5500] transition-colors">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
