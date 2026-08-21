"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/database";
import { Layers } from "lucide-react";
import { useStore } from "@/components/context/StoreContext";

interface ShopByCategoryProps {
  categories: Category[];
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({
  categories,
}) => {
  const { setSearchQuery } = useStore();

  // Use only database categories — no hardcoded fallbacks
  const displayItems = categories && categories.length > 0 ? categories : [];

  const handleCategoryClick = (categoryName: string) => {
    setSearchQuery(categoryName);
  };

  // Nothing to show yet
  if (displayItems.length === 0) {
    return (
      <section id="shop-by-category" className="py-6 sm:py-10 bg-transparent select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="space-y-0.5">
            <p className="text-[11px] font-black uppercase tracking-widest text-[#FF5A00]">RC GADGETS CATEGORIES</p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">Shop by Category</h2>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
            <Layers className="w-10 h-10 mb-3 text-gray-300" />
            <p className="text-sm font-semibold text-gray-500">No categories yet</p>
            <p className="text-xs text-gray-400 mt-1">Add categories in the <Link href="/admin/categories" className="text-[#FF5A00] hover:underline">Admin Panel</Link></p>
          </div>
        </div>
      </section>
    );
  }



  return (
    <section id="shop-by-category" className="py-6 sm:py-10 bg-transparent select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

        {/* Section Header */}
        <div className="flex items-end justify-between">
          <div className="space-y-0.5">
            <p className="text-[11px] font-black uppercase tracking-widest text-[#FF5A00]">
              RC GADGETS CATEGORIES
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
              Shop by Category
            </h2>
          </div>

          <Link
            href="#featured-products"
            className="text-xs font-semibold text-gray-500 hover:text-[#FF5A00] transition-colors flex items-center gap-1"
          >
            View All →
          </Link>
        </div>

        {/* 6 × 2 Grid of Circular Category Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-4 gap-y-7 sm:gap-x-6 sm:gap-y-9">
          {displayItems.map((cat: any, idx: number) => {
            const hasImg = Boolean(
              cat.image_url &&
                typeof cat.image_url === "string" &&
                cat.image_url.trim().length > 0
            );

            return (
              <Link
                key={cat.id || `${cat.name}-${idx}`}
                href="#featured-products"
                onClick={() => handleCategoryClick(cat.name)}
                className="group flex flex-col items-center gap-3"
              >
                {/* Circle */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-white border-2 border-gray-200 group-hover:border-[#FF5A00] overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#FF5A00]/15 group-hover:-translate-y-1.5 mx-auto">
                  {hasImg ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, 144px"
                      className="object-contain p-3 sm:p-4 transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center text-gray-400 group-hover:text-[#FF5A00] transition-colors">
                      <Layers className="w-9 h-9 sm:w-10 sm:h-10" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <span className="text-[12px] sm:text-sm font-semibold text-gray-800 group-hover:text-[#FF5A00] transition-colors text-center leading-tight px-1">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};
