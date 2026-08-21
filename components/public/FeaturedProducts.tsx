"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { StoreProduct, useStore } from "@/components/context/StoreContext";
import {
  Heart,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Check,
} from "lucide-react";

interface FeaturedProductsProps {
  products?: StoreProduct[];
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
}) => {
  const [activeTab, setActiveTab] = useState<
    "best_sellers" | "new_arrivals" | "top_rated"
  >("best_sellers");
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addToCart, toggleWishlist, isInWishlist, searchQuery } = useStore();

  const defaultProducts: StoreProduct[] = [
    {
      id: "p-1",
      title: "Traxxas X-Maxx 8S 4WD Brushless Monster Truck",
      category_name: "RC Cars",
      brand_name: "Traxxas",
      price: 79999,
      original_price: 89999,
      rating: 4.9,
      reviews_count: 128,
      badge: "HOT",
      image_url: null,
      is_bestseller: true,
      is_new_arrival: false,
      is_top_rated: true,
    },
    {
      id: "p-2",
      title: "DJI Mini 4 Pro Drone with RC-N2 Controller",
      category_name: "RC Drones",
      brand_name: "DJI",
      price: 84990,
      original_price: 92000,
      rating: 4.9,
      reviews_count: 96,
      badge: "NEW",
      image_url: null,
      is_bestseller: true,
      is_new_arrival: true,
      is_top_rated: true,
    },
    {
      id: "p-3",
      title: "FMS 1400mm P-51D Mustang V8 RC Plane",
      category_name: "RC Planes",
      brand_name: "FMS",
      price: 32999,
      original_price: 38000,
      rating: 4.8,
      reviews_count: 74,
      badge: "POPULAR",
      image_url: null,
      is_bestseller: true,
      is_new_arrival: false,
      is_top_rated: true,
    },
    {
      id: "p-4",
      title: "Traxxas Rustler 4x4 VXL Brushless RC Car",
      category_name: "RC Cars",
      brand_name: "Traxxas",
      price: 29999,
      original_price: 34500,
      rating: 4.8,
      reviews_count: 89,
      badge: "SALE",
      image_url: null,
      is_bestseller: true,
      is_new_arrival: false,
      is_top_rated: false,
    },
    {
      id: "p-5",
      title: "Volantex RC Vector SR80 Brushless RC Boat",
      category_name: "RC Boats",
      brand_name: "Volantex",
      price: 23999,
      original_price: 27999,
      rating: 4.9,
      reviews_count: 64,
      badge: "HOT",
      image_url: null,
      is_bestseller: true,
      is_new_arrival: false,
      is_top_rated: true,
    },
    {
      id: "p-6",
      title: "FlySky FS-GT5 6CH Transmitter & Receiver",
      category_name: "Accessories",
      brand_name: "FlySky",
      price: 6499,
      original_price: 7999,
      rating: 4.8,
      reviews_count: 112,
      badge: "BEST",
      image_url: null,
      is_bestseller: true,
      is_new_arrival: false,
      is_top_rated: true,
    },
  ];

  const allItems = products && products.length > 0 ? products : defaultProducts;

  const filtered = allItems.filter((item) => {
    if (
      searchQuery &&
      !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.category_name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (activeTab === "best_sellers") return item.is_bestseller ?? true;
    if (activeTab === "new_arrivals") return item.is_new_arrival ?? true;
    if (activeTab === "top_rated") return item.is_top_rated ?? true;
    return true;
  });

  const displayList = filtered.length > 0 ? filtered : allItems.slice(0, 6);

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

  const handleAddToCart = (product: StoreProduct, e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  };

  return (
    <section id="featured-products" className="py-6 sm:py-10 bg-transparent select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header with Tabs & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#111111] italic">
              FEATURED PRODUCTS
            </h2>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("best_sellers")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === "best_sellers"
                    ? "bg-[#111111] text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Best Sellers
              </button>
              <button
                onClick={() => setActiveTab("new_arrivals")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === "new_arrivals"
                    ? "bg-[#111111] text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                New Arrivals
              </button>
              <button
                onClick={() => setActiveTab("top_rated")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === "top_rated"
                    ? "bg-[#111111] text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Top Rated
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-gray-500 hover:text-[#FF5A00] transition-colors cursor-pointer">
              View all products
            </span>

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

        {/* Product Cards Grid */}
        <div
          ref={scrollContainerRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5"
        >
          {displayList.map((product) => {
            const isWish = isInWishlist(product.id);
            const isAdded = addedIds.includes(product.id);
            const hasImg = Boolean(product.image_url);

            return (
              <div
                key={product.id}
                className="group relative rounded-3xl bg-white border border-gray-200/80 hover:border-[#FF5A00]/70 p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  {/* Top: Badge & Wishlist */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {product.badge ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#111111] text-white text-[9px] font-black uppercase tracking-wider">
                        {product.badge}
                      </span>
                    ) : (
                      <span />
                    )}

                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`p-1.5 rounded-full transition-colors ${
                        isWish
                          ? "bg-rose-50 text-rose-500"
                          : "text-gray-400 hover:text-rose-500 hover:bg-gray-100"
                      }`}
                      title={isWish ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={`w-4 h-4 ${isWish ? "fill-rose-500" : ""}`} />
                    </button>
                  </div>

                  {/* Product Image or Placeholder */}
                  <div className="relative w-full h-36 sm:h-40 rounded-2xl overflow-hidden bg-gray-50/70 flex items-center justify-center p-2 mb-3">
                    {hasImg ? (
                      <Image
                        src={product.image_url!}
                        alt={product.title}
                        fill
                        sizes="200px"
                        className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-2 text-center">
                        <ShoppingBag className="w-8 h-8 text-gray-300 mb-1" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                          Upload Photo
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Brand & Title */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5A00] block">
                      {product.brand_name || "RC GADGETS"}
                    </span>
                    <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#FF5A00] transition-colors">
                      {product.title}
                    </h3>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-3 mt-3 border-t border-gray-100 flex items-end justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm sm:text-base font-black text-gray-900">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      {product.original_price && (
                        <span className="text-[10px] text-gray-400 line-through">
                          ₹{product.original_price.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-gray-400 font-normal">
                        ({product.reviews_count})
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm ${
                      isAdded
                        ? "bg-emerald-500 text-white"
                        : "bg-[#FF5A00] hover:bg-[#FF6A00] text-white active:scale-95 shadow-[#FF5A00]/25"
                    }`}
                    title="Add to Cart"
                  >
                    {isAdded ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
