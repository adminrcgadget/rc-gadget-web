"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/database";
import { ArrowRight } from "lucide-react";

interface WorldSectionProps {
  categories: Category[];
}

export const WorldSection: React.FC<WorldSectionProps> = ({ categories }) => {
  const defaultItems = [
    {
      id: "cat-1",
      name: "RC CARS",
      short_description: "High speed. High control. Built to dominate.",
      image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045166/rc-gadgets/assets/cat-car.webp",
    },
    {
      id: "cat-2",
      name: "RC PLANES",
      short_description: "Fly higher. Go farther. Experience freedom.",
      image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045169/rc-gadgets/assets/cat-plane.webp",
    },
    {
      id: "cat-3",
      name: "RC SHIPS",
      short_description: "Smooth on water. Power in every wave.",
      image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045170/rc-gadgets/assets/cat-ship.webp",
    },
    {
      id: "cat-4",
      name: "RC EXCAVATORS",
      short_description: "Heavy duty power. Built for real work.",
      image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045167/rc-gadgets/assets/cat-excavator.webp",
    },
    {
      id: "cat-5",
      name: "ALL RC GADGETS",
      short_description: "Controllers, batteries, parts & more.",
      image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045168/rc-gadgets/assets/cat-gadget.webp",
    },
  ];

  const getCategoryImage = (item: any, idx: number) => {
    if (item.image_url && !item.image_url.includes("placeholder") && !item.image_url.includes("WhatsApp")) {
      return item.image_url;
    }
    const defaults = [
      "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045166/rc-gadgets/assets/cat-car.webp",
      "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045169/rc-gadgets/assets/cat-plane.webp",
      "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045170/rc-gadgets/assets/cat-ship.webp",
      "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045167/rc-gadgets/assets/cat-excavator.webp",
      "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045168/rc-gadgets/assets/cat-gadget.webp",
    ];
    return defaults[idx % defaults.length];
  };

  const getCategorySub = (item: any, idx: number) => {
    if (item.short_description) return item.short_description;
    const subs = [
      "High speed. High control. Built to dominate.",
      "Fly higher. Go farther. Experience freedom.",
      "Smooth on water. Power in every wave.",
      "Heavy duty power. Built for real work.",
      "Controllers, batteries, parts & more.",
    ];
    return subs[idx % subs.length];
  };

  const itemsToRender = React.useMemo(() => {
    if (categories && categories.length > 0) {
      return categories;
    }
    return defaultItems;
  }, [categories]);

  return (
    <section id="our-world" className="py-6 sm:py-8 bg-transparent relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Section Heading matching reference */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-5 bg-[#FF5A00]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#FF5A00]">
              OUR WORLD
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium pl-7">
            Explore our RC collection
          </p>
        </div>

        {/* 5 Sleek Dark Motorsport Cards (1 col mobile, 2 col tablet, 5 col desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
          {itemsToRender.map((item: any, idx: number) => {
            const imgSrc = getCategoryImage(item, idx);
            const sub = getCategorySub(item, idx);

            return (
              <Link
                key={item.id || idx}
                href="#contact"
                className="group relative rounded-2xl bg-[#0D0F12] border border-zinc-800/90 hover:border-[#FF5A00]/80 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/70 overflow-hidden active:scale-[0.99]"
              >
                {/* 1. MOBILE LAYOUT (< md): Horizontal Row with Image & Arrow */}
                <div className="flex md:hidden items-center justify-between w-full">
                  <div className="space-y-1 z-10 max-w-[58%]">
                    <h3 className="text-sm font-black italic uppercase text-white tracking-wide group-hover:text-[#FF5A00] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-normal leading-snug">
                      {sub}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 z-10">
                    <div className="relative w-24 h-16 shrink-0">
                      <Image
                        src={imgSrc}
                        alt={item.name}
                        fill
                        sizes="150px"
                        className="object-contain object-center transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[#FF5A00] flex items-center justify-center text-white shadow-md shadow-[#FF5A00]/30 shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* 2. DESKTOP / TABLET LAYOUT (>= md): Top Title, Center Vehicle, Bottom Arrow */}
                <div className="hidden md:flex flex-col justify-between h-full w-full space-y-3 z-10">
                  <div className="space-y-1">
                    <h3 className="text-sm lg:text-base font-black italic uppercase text-white tracking-wide group-hover:text-[#FF5A00] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-normal leading-snug line-clamp-2">
                      {sub}
                    </p>
                  </div>

                  {/* Center Vehicle Cutout Image */}
                  <div className="relative w-full h-28 lg:h-32 flex items-center justify-center my-1">
                    <Image
                      src={imgSrc}
                      alt={item.name}
                      fill
                      sizes="(max-width: 1280px) 250px, 200px"
                      className="object-contain object-center transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 group-hover:text-[#FF5A00] transition-colors">
                      Explore Models
                    </span>

                    <div className="w-7 h-7 rounded-full bg-[#FF5A00] flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110 shadow-md shadow-[#FF5A00]/40 shrink-0">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Subtle dark ambient glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};
