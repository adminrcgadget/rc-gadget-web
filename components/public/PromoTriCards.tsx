"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Banner } from "@/types/database";
import { ImageIcon } from "lucide-react";

interface PromoTriCardsProps {
  banners?: Banner[];
}

function getValidUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export const PromoTriCards: React.FC<PromoTriCardsProps> = ({ banners }) => {
  // 3 Empty Banner Slots by default
  const defaultSlots = [
    {
      id: "promo-banner-1",
      title: "Banner Slot 1",
      button_url: "#featured-products",
      image_url: null,
      desktop_image_url: null,
      mobile_image_url: null,
    },
    {
      id: "promo-banner-2",
      title: "Banner Slot 2",
      button_url: "#featured-products",
      image_url: null,
      desktop_image_url: null,
      mobile_image_url: null,
    },
    {
      id: "promo-banner-3",
      title: "Banner Slot 3",
      button_url: "#experience",
      image_url: null,
      desktop_image_url: null,
      mobile_image_url: null,
    },
  ];

  // Map each slot to Supabase banners
  const slots = defaultSlots.map((defaultSlot, idx) => {
    const uploaded = banners?.[idx];
    const rawDesktop = getValidUrl(uploaded?.desktop_image_url || uploaded?.image_url);
    const rawMobile = getValidUrl(uploaded?.mobile_image_url);

    const desktopImg = rawDesktop || rawMobile || null;
    const mobileImg = rawMobile || rawDesktop || null;

    return {
      id: uploaded?.id || defaultSlot.id,
      title: uploaded?.title || defaultSlot.title,
      button_url: getValidUrl(uploaded?.button_url) || defaultSlot.button_url,
      desktop_image_url: desktopImg,
      mobile_image_url: mobileImg,
      hasImage: Boolean(desktopImg || mobileImg),
    };
  });

  return (
    <section className="py-6 sm:py-10 bg-transparent select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {slots.map((slot, idx) => {
            return (
              <Link
                key={slot.id || idx}
                href={slot.button_url || "#featured-products"}
                className="group relative w-full aspect-[16/7] sm:aspect-[16/8] md:aspect-[16/7] rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/90 bg-white shadow-xs hover:shadow-xl hover:border-[#FF5A00]/60 transition-all duration-300 hover:-translate-y-1 block"
              >
                {slot.hasImage ? (
                  <>
                    {/* Desktop/Tablet Banner View */}
                    {slot.desktop_image_url && (
                      <div className="relative w-full h-full hidden sm:block bg-white">
                        <Image
                          src={slot.desktop_image_url}
                          alt={slot.title || `Promotional Banner ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 420px"
                          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    )}

                    {/* Mobile Banner View */}
                    {slot.mobile_image_url && (
                      <div className="relative w-full h-full sm:hidden bg-white">
                        <Image
                          src={slot.mobile_image_url}
                          alt={slot.title || `Promotional Banner ${idx + 1}`}
                          fill
                          sizes="100vw"
                          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  /* Clean Empty Slot (Ready for Admin Upload) */
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gray-50/80 group-hover:bg-orange-50/30 transition-colors space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 text-gray-400 group-hover:text-[#FF5A00] group-hover:border-[#FF5A00]/40 flex items-center justify-center transition-all shadow-xs">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-gray-700 group-hover:text-[#FF5A00] transition-colors block">
                        Banner Slot {idx + 1}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        Upload Image in Admin Panel → 3 Promo Banners
                      </span>
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
