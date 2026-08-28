"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
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
  Play,
  Maximize2,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";

interface ProductDetailsViewProps {
  product: Product;
  relatedProducts: Product[];
  settings: SiteSettings;
}

type MediaItem =
  | { type: "image"; url: string; id: string }
  | { type: "video"; url: string; id: string; thumbnail?: string };

export function ProductDetailsView({
  product,
  relatedProducts,
  settings,
}: ProductDetailsViewProps) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "description" | "shipping">(
    "specs"
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const isWish = isInWishlist(product.id);

  // Consolidate all product media into a clean list
  const mediaList: MediaItem[] = useMemo(() => {
    const list: MediaItem[] = [];

    // 1. Primary image
    if (product.image_url && product.image_url.trim().length > 0) {
      list.push({
        type: "image",
        url: product.image_url.trim(),
        id: "main-image",
      });
    }

    // 2. Additional gallery images
    if (product.gallery_images && Array.isArray(product.gallery_images)) {
      product.gallery_images.forEach((imgUrl, idx) => {
        if (imgUrl && typeof imgUrl === "string" && imgUrl.trim().length > 0) {
          // Avoid duplicate of primary image
          if (imgUrl.trim() !== product.image_url?.trim()) {
            list.push({
              type: "image",
              url: imgUrl.trim(),
              id: `gallery-img-${idx}`,
            });
          }
        }
      });
    }

    // 3. Product Video
    if (product.video_url && product.video_url.trim().length > 0) {
      list.push({
        type: "video",
        url: product.video_url.trim(),
        id: "product-video",
        thumbnail: product.image_url || undefined,
      });
    }

    // Fallback if no images at all
    if (list.length === 0) {
      list.push({
        type: "image",
        url: "",
        id: "placeholder",
      });
    }

    return list;
  }, [product.image_url, product.gallery_images, product.video_url]);

  const activeMedia = mediaList[selectedMediaIndex] || mediaList[0];

  // Helper to detect if video is YouTube
  const isYouTube =
    activeMedia?.type === "video" &&
    (activeMedia.url.includes("youtube.com") || activeMedia.url.includes("youtu.be"));

  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}`;
    }
    const match = url.match(/[?&]v=([^&]+)/);
    const id = match ? match[1] : "";
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}`;
  };

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

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const shareData = {
      title: `${product.title} | RC Gadgets`,
      text: `Check out ${product.title} at RC Gadgets Kottakkal!`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error("Clipboard failed", e);
    }
  };

  // Close fullscreen lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    if (isFullscreen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const specsList = [
    { label: "Category", value: product.category_name },
    { label: "Brand / Manufacturer", value: product.brand_name || "RC GADGETS" },
    { label: "Model ID", value: `RCG-${product.id.slice(0, 8).toUpperCase()}` },
    { label: "Rating", value: `${product.rating || 4.9} / 5.0 (${product.reviews_count || 48} reviews)` },
    { label: "Availability", value: (product.stock_quantity ?? 0) > 0 ? "In Stock — Kottakkal Store" : "Available to Order" },
    { label: "Power System", value: "High-Discharge Electric Brushless / LiPo Compatible" },
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

      {/* 2. Product Detail Grid (Left Gallery Column + Right Buy Box) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Multi-Thumbnail Strip + Main Stage (7 cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4 sm:gap-5 items-start">
          {/* Vertical Thumbnail Strip (Desktop) / Horizontal Row (Mobile) */}
          {mediaList.length > 1 && (
            <div className="flex lg:flex-col gap-2.5 sm:gap-3 overflow-x-auto lg:overflow-y-auto w-full lg:w-20 shrink-0 pb-2 lg:pb-0 scrollbar-none max-h-[500px]">
              {mediaList.map((item, idx) => {
                const isSelected = selectedMediaIndex === idx;
                const isVideo = item.type === "video";

                return (
                  <button
                    key={item.id || idx}
                    onClick={() => setSelectedMediaIndex(idx)}
                    onMouseEnter={() => setSelectedMediaIndex(idx)}
                    className={`relative w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl bg-white border transition-all flex items-center justify-center p-1.5 shrink-0 cursor-pointer overflow-visible ${
                      isSelected
                        ? "border-[#FF5A00] shadow-sm ring-2 ring-[#FF5A00]/20"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    title={isVideo ? "Watch Video Preview" : `View Photo ${idx + 1}`}
                  >
                    {/* Active Pip Arrow pointing right to main stage (matching reference screenshot) */}
                    {isSelected && (
                      <span className="hidden lg:block absolute -right-[6px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#FF5A00] rotate-45 z-20" />
                    )}

                    {isVideo ? (
                      <div className="relative w-full h-full rounded-lg bg-gray-900 flex flex-col items-center justify-center overflow-hidden">
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt="Video Thumbnail"
                            fill
                            sizes="80px"
                            className="object-contain p-1 opacity-60"
                          />
                        ) : null}
                        <div className="w-7 h-7 rounded-full bg-black/80 text-white flex items-center justify-center shadow-md z-10">
                          <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                        </div>
                      </div>
                    ) : item.url ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={item.url}
                          alt={`${product.title} - View ${idx + 1}`}
                          fill
                          sizes="80px"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <ShoppingBag className="w-5 h-5 text-gray-300" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Main Display Stage (Clean unified white background with single border - NO dual nested borders) */}
          <div className="flex-1 w-full relative aspect-square sm:aspect-4/3 lg:aspect-square rounded-2xl sm:rounded-3xl bg-white border border-gray-200/90 p-6 sm:p-8 flex items-center justify-center overflow-hidden group shadow-xs">
            {/* Top Badges */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
              {product.badge && (
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black text-white shadow-xs">
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Top Right Action Overlay (Share & Wishlist) */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 hover:text-black transition-all shadow-xs cursor-pointer active:scale-95"
                  title="Share product link"
                  aria-label="Share product"
                >
                  {copiedLink ? (
                    <Check className="w-4 h-4 text-emerald-600 animate-in zoom-in" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>

                {/* Copied Feedback Tooltip */}
                {copiedLink && (
                  <span className="absolute right-0 top-full mt-1.5 px-2.5 py-1 rounded-lg bg-black text-white text-[10px] font-bold whitespace-nowrap shadow-lg animate-in fade-in slide-in-from-top-1 z-30">
                    Link Copied!
                  </span>
                )}
              </div>

              <button
                onClick={() => toggleWishlist(product as any)}
                className={`p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all shadow-xs cursor-pointer active:scale-95 ${
                  isWish ? "text-rose-500 border-rose-200" : "text-gray-500 hover:text-black"
                }`}
                title={isWish ? "Remove from wishlist" : "Add to wishlist"}
                aria-label="Wishlist"
              >
                <Heart
                  className={`w-4 h-4 ${isWish ? "fill-rose-500 text-rose-500" : ""}`}
                />
              </button>
            </div>

            {/* Bottom Right Fullscreen Lightbox Button */}
            {activeMedia?.type === "image" && activeMedia.url && (
              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute bottom-4 right-4 z-20 p-2.5 rounded-xl bg-gray-50/90 backdrop-blur-xs border border-gray-200 text-gray-700 hover:text-black hover:border-black transition-all shadow-xs group/btn cursor-pointer"
                title="View Full Resolution"
              >
                <Maximize2 className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
              </button>
            )}

            {/* Main Stage Content: Video or High-Res Image */}
            {activeMedia?.type === "video" ? (
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                {isYouTube ? (
                  <iframe
                    src={getYouTubeEmbedUrl(activeMedia.url)}
                    title={product.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <video
                      ref={videoRef}
                      src={activeMedia.url}
                      autoPlay
                      loop
                      muted={isVideoMuted}
                      playsInline
                      controls
                      className="w-full h-full object-contain"
                    />

                    {/* Quick Mute/Unmute toggle */}
                    <button
                      type="button"
                      onClick={() => setIsVideoMuted(!isVideoMuted)}
                      className="absolute top-4 left-4 z-20 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                      title={isVideoMuted ? "Unmute Video" : "Mute Video"}
                    >
                      {isVideoMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : activeMedia?.url ? (
              <div className="relative w-full h-full">
                <Image
                  src={activeMedia.url}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-contain p-4 sm:p-6 transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>
            ) : (
              <div className="text-gray-300 text-sm font-medium">
                RC Model Visual
              </div>
            )}
          </div>
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
                  className="px-3.5 py-1 text-gray-700 hover:bg-gray-100 font-medium cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-semibold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 py-1 text-gray-700 hover:bg-gray-100 font-medium cursor-pointer"
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

      {/* 4. Fullscreen Image Lightbox Modal */}
      {isFullscreen && activeMedia?.type === "image" && activeMedia.url && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center p-4">
            <Image
              src={activeMedia.url}
              alt={product.title}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* 5. Related Products */}
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
                <div className="relative w-full aspect-square rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center p-4 mb-3 overflow-hidden shadow-xs">
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
