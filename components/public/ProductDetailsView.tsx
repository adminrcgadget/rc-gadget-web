"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, SiteSettings } from "@/types/database";
import { useStore } from "@/components/context/StoreContext";
import {
  Heart,
  ShoppingCart,
  Check,
  ShoppingBag,
  MessageCircle,
  Share2,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Wrench,
  Clock,
} from "lucide-react";

interface ProductDetailsViewProps {
  product: Product;
  relatedProducts: Product[];
  settings: SiteSettings;
}

export function ProductDetailsView({
  product,
  relatedProducts,
  settings,
}: ProductDetailsViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "description" | "shipping">(
    "specs"
  );
  const [copiedLink, setCopiedLink] = useState(false);

  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const isWish = isInWishlist(product.id);

  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(
          ((product.original_price - product.price) / product.original_price) * 100
        )
      : null;

  const rawPhone = (settings?.phone || "7510110155").replace(/[^0-9]/g, "");

  const handleAddToCart = () => {
    addToCart(product as any, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    const pageUrl = typeof window !== "undefined" ? window.location.href : "";
    const message = `Hi RC Gadgets! 🏎️\nI would like to order this model:\n\n*${product.title}*\nPrice: ₹${Number(product.price).toLocaleString("en-IN")}\nCategory: ${product.category_name}\nQuantity: ${quantity}\n\nProduct Link: ${pageUrl}`;
    const url = `https://wa.me/${rawPhone || "917510110155"}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const specsList = [
    { label: "Category", value: product.category_name },
    { label: "Brand / Manufacturer", value: product.brand_name || "RC GADGETS" },
    { label: "Model ID", value: `RCG-${product.id.slice(0, 8).toUpperCase()}` },
    { label: "Rating", value: `${product.rating || 4.9} / 5.0 (${product.reviews_count || 48} reviews)` },
    { label: "Availability", value: (product.stock_quantity ?? 0) > 0 ? "In Stock — Kottakkal Store" : "Available to Order" },
    { label: "Power System", value: "High-Discharge Electric Brushless / LiPo" },
    { label: "Radio Control", value: "2.4GHz Anti-Interference Pro-Grade Transmitter" },
    { label: "In the Box", value: "RTR Assembled Model, Transmitter, Accessories & Manual" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 font-sans">
      {/* 1. Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-medium text-gray-500 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link href="/shop" className="hover:text-black transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link
            href={`/shop?category=${encodeURIComponent(product.category_name)}`}
            className="hover:text-black transition-colors"
          >
            {product.category_name}
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-900 font-semibold truncate max-w-xs sm:max-w-md">
            {product.title}
          </span>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-900 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* 2. Product Detail Grid (Apple/Nike Standard) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Minimal Photo Stage (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative w-full aspect-square rounded-3xl bg-[#F6F6F6] p-8 flex items-center justify-center overflow-hidden group">
            {/* Top Minimal Badge */}
            {product.badge && (
              <span className="absolute top-5 left-5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black text-white z-10">
                {product.badge}
              </span>
            )}
            {discount && (
              <span className="absolute top-5 right-14 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white z-10">
                {discount}% OFF
              </span>
            )}

            {/* Share & Wishlist buttons */}
            <div className="absolute top-5 right-5 z-10 flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/90 backdrop-blur-xs text-gray-600 hover:text-black transition-colors"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => toggleWishlist(product as any)}
                className={`p-2 rounded-full bg-white/90 backdrop-blur-xs transition-colors cursor-pointer ${
                  isWish ? "text-rose-500" : "text-gray-400 hover:text-black"
                }`}
                title={isWish ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={`w-4 h-4 ${isWish ? "fill-rose-500" : ""}`}
                />
              </button>
            </div>

            {/* Image */}
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="text-gray-300 text-sm font-medium">
                RC Model Visual
              </div>
            )}
          </div>

          {copiedLink && (
            <div className="p-3 rounded-xl bg-gray-100 text-gray-900 text-xs font-semibold text-center animate-in fade-in">
              Product link copied to clipboard
            </div>
          )}
        </div>

        {/* Right Column: Minimal Buy Box (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Brand & Title */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block">
              {product.brand_name || "RC GADGETS"} • {product.category_name}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Pricing */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold text-gray-900 tracking-tight">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
              {product.original_price && (
                <span className="text-base text-gray-400 line-through">
                  MRP ₹{Number(product.original_price).toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              MRP inclusive of all taxes • In stock in Kottakkal, Kerala
            </p>
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="text-xs text-gray-600 font-medium">
              ★ {product.rating} / 5.0 ({product.reviews_count || 32} verified customer ratings)
            </div>
          )}

          {/* Overview text */}
          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed pt-2 border-t border-gray-100">
              {product.description}
            </p>
          )}

          {/* Quantity & CTA Actions */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-700">Quantity</span>
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-1 text-gray-700 hover:bg-gray-100 font-medium"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-semibold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 py-1 text-gray-700 hover:bg-gray-100 font-medium"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-full font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-black hover:bg-zinc-800 text-white active:scale-[0.99]"
                }`}
              >
                {isAdded ? "Added to Bag" : "Add to Bag"}
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-4 rounded-full font-semibold text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order via WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Value Assurance Row */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gray-900 shrink-0" />
              <span>100% Genuine Hobby Grade</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-900 shrink-0" />
              <span>Insured Express Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-gray-900 shrink-0" />
              <span>Expert Setup &amp; Tuning</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-900 shrink-0" />
              <span>Store Support in Kottakkal</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Specs & Tabs */}
      <div className="border-t border-gray-200 pt-10 space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-200 pb-3">
          <button
            onClick={() => setActiveTab("specs")}
            className={`text-xs font-semibold uppercase tracking-wider pb-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "specs"
                ? "border-black text-black"
                : "border-transparent text-gray-400 hover:text-black"
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab("description")}
            className={`text-xs font-semibold uppercase tracking-wider pb-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "description"
                ? "border-black text-black"
                : "border-transparent text-gray-400 hover:text-black"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`text-xs font-semibold uppercase tracking-wider pb-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "shipping"
                ? "border-black text-black"
                : "border-transparent text-gray-400 hover:text-black"
            }`}
          >
            Shipping &amp; Pickup
          </button>
        </div>

        {activeTab === "specs" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {specsList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2.5 border-b border-gray-100"
              >
                <span className="font-medium text-gray-500 uppercase text-[11px]">
                  {item.label}
                </span>
                <span className="font-semibold text-gray-900 text-right">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "description" && (
          <div className="max-w-2xl space-y-3 text-sm text-gray-600 leading-relaxed">
            <p>
              {product.description ||
                "Engineered for high-performance RC enthusiasts. Features authentic scale detailing, high-speed brushless capability, and pro-level chassis durability."}
            </p>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="max-w-2xl space-y-2 text-sm text-gray-600 leading-relaxed">
            <p>
              <strong>Store Pickup:</strong> RC Gadgets, Parambilangadi, Kottakkal, Malappuram, Kerala.
            </p>
            <p>
              <strong>Doorstep Delivery:</strong> Pan-India insured shipping with real-time tracking IDs.
            </p>
          </div>
        )}
      </div>

      {/* 4. Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="border-t border-gray-200 pt-10 space-y-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              You Might Also Like
            </h2>
            <Link
              href={`/shop?category=${encodeURIComponent(product.category_name)}`}
              className="text-xs font-semibold text-gray-500 hover:text-black"
            >
              View More →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                href={`/products/${rel.id}`}
                className="group flex flex-col justify-between"
              >
                <div className="relative w-full aspect-square rounded-2xl bg-[#F6F6F6] flex items-center justify-center p-6 mb-3 overflow-hidden">
                  {rel.image_url ? (
                    <Image
                      src={rel.image_url}
                      alt={rel.title}
                      fill
                      sizes="200px"
                      className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-gray-300 text-xs font-medium">
                      RC Model
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">
                    {rel.brand_name || "RC GADGETS"}
                  </span>
                  <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 group-hover:text-black">
                    {rel.title}
                  </h3>
                  <span className="text-sm font-bold text-gray-900 block pt-1">
                    ₹{Number(rel.price).toLocaleString("en-IN")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
