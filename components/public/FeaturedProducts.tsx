"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { StoreProduct, useStore } from "@/components/context/StoreContext";
import {
  Heart,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Check,
  Sparkles,
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

  const tabs = [
    { key: "best_sellers", label: "Best Sellers" },
    { key: "new_arrivals", label: "New Arrivals" },
    { key: "top_rated", label: "Top Rated" },
  ] as const;

  const badgeColors: Record<string, string> = {
    HOT: "bg-rose-500 text-white",
    NEW: "bg-blue-500 text-white",
    SALE: "bg-[#FF5A00] text-white",
    BEST: "bg-amber-500 text-white",
    POPULAR: "bg-violet-500 text-white",
  };

  return (
    <section id="featured-products" className="py-6 sm:py-10 bg-transparent select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">

        {/* Section Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200/80 pb-4">
          {/* Title row */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#111111] italic">
              FEATURED PRODUCTS
            </h2>

            {/* Nav arrows — visible on all screens */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-full border border-gray-200 hover:border-[#FF5A00] hover:text-[#FF5A00] flex items-center justify-center text-gray-600 transition-colors bg-white shadow-xs active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-full border border-gray-200 hover:border-[#FF5A00] hover:text-[#FF5A00] flex items-center justify-center text-gray-600 transition-colors bg-white shadow-xs active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tabs + View All — scroll on mobile */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all shrink-0 ${
                    activeTab === tab.key
                      ? "bg-[#111111] text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <Link
              href="/shop"
              className="text-xs font-black uppercase tracking-wider text-gray-500 hover:text-[#FF5A00] transition-colors cursor-pointer shrink-0 hidden sm:block"
            >
              VIEW ALL IN SHOP →
            </Link>
          </div>
        </div>

        {/* ── MOBILE: horizontal scroll carousel (< sm) ── */}
        <div
          ref={scrollContainerRef}
          className="flex sm:hidden gap-3.5 overflow-x-auto pb-3 scrollbar-none snap-x snap-mandatory"
        >
          {displayList.map((product) => {
            const isWish = isInWishlist(product.id);
            const isAdded = addedIds.includes(product.id);
            const hasImg = Boolean(product.image_url);
            const badgeCls = product.badge
              ? badgeColors[product.badge] || "bg-gray-800 text-white"
              : "";

            return (
              <div
                key={product.id}
                className="group relative rounded-2xl bg-white border border-gray-200/80 hover:border-[#FF5A00]/60 p-3.5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg snap-start shrink-0 w-[160px]"
              >
                {/* Badge & Wishlist */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  {product.badge ? (
                    <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${badgeCls}`}>
                      {product.badge}
                    </span>
                  ) : (
                    <span />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className={`p-1 rounded-full transition-colors ${
                      isWish ? "bg-rose-50 text-rose-500" : "text-gray-300 hover:text-rose-400"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWish ? "fill-rose-500" : ""}`} />
                  </button>
                </div>

                {/* Clickable Image & Title */}
                <Link href={`/products/${product.id}`} className="block">
                  {/* Image */}
                  <div className="relative w-full h-28 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center mb-2.5">
                    {hasImg ? (
                      <Image
                        src={product.image_url!}
                        alt={product.title}
                        fill
                        sizes="160px"
                        className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-300">
                        <ShoppingBag className="w-7 h-7 mb-1" />
                        <span className="text-[8px] font-bold uppercase tracking-wider text-gray-300">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Brand & Title */}
                  <div className="space-y-0.5 mb-3">
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#FF5A00] block">
                      {product.brand_name || "RC GADGETS"}
                    </span>
                    <h3 className="text-[11px] font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#FF5A00] transition-colors">
                      {product.title}
                    </h3>
                  </div>
                </Link>

                {/* Price + Rating + Cart */}
                <div className="border-t border-gray-100 pt-2.5 flex items-end justify-between gap-1">
                  <div className="space-y-0.5">
                    <div className="flex items-baseline gap-1 flex-wrap">
                      <span className="text-xs font-black text-gray-900">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      {product.original_price && (
                        <span className="text-[9px] text-gray-400 line-through">
                          ₹{product.original_price.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 text-[9px] text-amber-500 font-bold">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-gray-400 font-normal">({product.reviews_count})</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm ${
                      isAdded
                        ? "bg-emerald-500 text-white"
                        : "bg-[#FF5A00] hover:bg-[#FF6A00] text-white active:scale-95"
                    }`}
                    title="Add to Cart"
                  >
                    {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── DESKTOP / TABLET: auto-fit grid (>= sm) ── */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-5">
          {displayList.map((product) => {
            const isWish = isInWishlist(product.id);
            const isAdded = addedIds.includes(product.id);
            const hasImg = Boolean(product.image_url);
            const badgeCls = product.badge
              ? badgeColors[product.badge] || "bg-gray-800 text-white"
              : "";

            return (
              <div
                key={product.id}
                className="group relative rounded-3xl bg-white border border-gray-200/80 hover:border-[#FF5A00]/70 p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  {/* Badge & Wishlist */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {product.badge ? (
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${badgeCls}`}>
                        {product.badge}
                      </span>
                    ) : (
                      <span />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                        isWish
                          ? "bg-rose-50 text-rose-500"
                          : "text-gray-400 hover:text-rose-500 hover:bg-gray-100"
                      }`}
                      title={isWish ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={`w-4 h-4 ${isWish ? "fill-rose-500" : ""}`} />
                    </button>
                  </div>

                  {/* Clickable Image & Title */}
                  <Link href={`/products/${product.id}`} className="block">
                    {/* Image */}
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
                            RC Model
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
                  </Link>
                </div>

                {/* Bottom Bar */}
                <div className="pt-3 mt-3 border-t border-gray-100 flex items-end justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
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
                      <span className="text-gray-400 font-normal">({product.reviews_count})</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm cursor-pointer ${
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
