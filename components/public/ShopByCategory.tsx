"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/database";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";

interface ShopByCategoryProps {
  categories: Category[];
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({
  categories,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const defaultCategories = [
    { name: "RC Cars", image_url: "/assets/cat-car.webp" },
    { name: "RC Planes", image_url: "/assets/cat-plane.webp" },
    { name: "RC Boats", image_url: "/assets/cat-ship.webp" },
    { name: "RC Drones", image_url: null },
    { name: "RC Bikes", image_url: null },
    { name: "RC Parts", image_url: "/assets/cat-excavator.webp" },
    { name: "Batteries", image_url: null },
    { name: "Accessories", image_url: null },
  ];

  const categoryList =
    categories && categories.length > 0 ? categories : (defaultCategories as any);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="shop-by-category" className="py-6 sm:py-10 bg-transparent select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#111111] italic">
            SHOP BY CATEGORY
          </h2>

          <div className="flex items-center gap-3">
            <Link
              href="#featured-products"
              className="text-xs font-black uppercase tracking-wider text-gray-500 hover:text-[#FF5A00] transition-colors"
            >
              View all categories
            </Link>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-full border border-gray-200 hover:border-[#FF5A00] hover:text-[#FF5A00] flex items-center justify-center text-gray-600 transition-colors bg-white shadow-xs"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-full border border-gray-200 hover:border-[#FF5A00] hover:text-[#FF5A00] flex items-center justify-center text-gray-600 transition-colors bg-white shadow-xs"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Horizontal Carousel / Grid */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory"
        >
          {categoryList.map((cat: any, idx: number) => {
            const hasImg = Boolean(
              cat.image_url &&
                typeof cat.image_url === "string" &&
                cat.image_url.trim().length > 0
            );

            return (
              <Link
                key={cat.id || idx}
                href="#featured-products"
                className="group w-32 sm:w-36 md:w-40 shrink-0 rounded-2xl bg-white border border-gray-200/80 hover:border-[#FF5A00] p-4 text-center flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-xs snap-start"
              >
                {/* Vehicle Cutout or Placeholder */}
                <div className="relative w-full h-24 sm:h-28 flex items-center justify-center overflow-hidden mb-2">
                  {hasImg ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      sizes="160px"
                      className="object-contain p-1 transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-gray-400 group-hover:text-[#FF5A00] group-hover:bg-orange-50/50 transition-colors p-2">
                      <Layers className="w-6 h-6 mb-1" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 text-center">
                        Upload Image
                      </span>
                    </div>
                  )}
                </div>

                {/* Category Name */}
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#FF5A00] transition-colors leading-tight">
                  {cat.name}
                </h3>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};
