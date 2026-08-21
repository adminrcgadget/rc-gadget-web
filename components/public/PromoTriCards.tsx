"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Banner } from "@/types/database";
import { ImageIcon, ArrowRight } from "lucide-react";

interface PromoTriCardsProps {
  banners?: Banner[];
}

function getValidUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export const PromoTriCards: React.FC<PromoTriCardsProps> = ({ banners }) => {
  const defaultSlots = [
    { id: "promo-banner-1", title: "", subtitle: "", description: "", button_text: "", button_url: "#featured-products", image_url: null, desktop_image_url: null, mobile_image_url: null },
    { id: "promo-banner-2", title: "", subtitle: "", description: "", button_text: "", button_url: "#featured-products", image_url: null, desktop_image_url: null, mobile_image_url: null },
    { id: "promo-banner-3", title: "", subtitle: "", description: "", button_text: "", button_url: "#experience",         image_url: null, desktop_image_url: null, mobile_image_url: null },
  ];

  const slots = defaultSlots.map((defaultSlot, idx) => {
    // Match by sort_order (1,2,3) — not array index — so 3rd banner always goes to slot 3
    const slotOrder = idx + 1;
    const uploaded = banners?.find((b: any) => b.sort_order === slotOrder) || banners?.[idx];
    const rawDesktop = getValidUrl(uploaded?.desktop_image_url || uploaded?.image_url);
    const rawMobile  = getValidUrl(uploaded?.mobile_image_url);
    const desktopImg = rawDesktop || rawMobile || null;
    const mobileImg  = rawMobile  || rawDesktop || null;

    return {
      id:                uploaded?.id           || defaultSlot.id,
      title:             uploaded?.title        || defaultSlot.title,
      subtitle:          uploaded?.subtitle     || defaultSlot.subtitle,
      description:       uploaded?.description  || defaultSlot.description,
      button_text:       uploaded?.button_text  || defaultSlot.button_text,
      button_url:        getValidUrl(uploaded?.button_url) || defaultSlot.button_url,
      desktop_image_url: desktopImg,
      mobile_image_url:  mobileImg,
      hasImage: Boolean(desktopImg || mobileImg),
      hasText:  Boolean(uploaded?.title || uploaded?.subtitle || uploaded?.button_text),
    };
  });


  return (
    <section className="py-6 sm:py-10 bg-transparent select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {slots.map((slot, idx) => (
            <Link
              key={slot.id || idx}
              href={slot.button_url || "#featured-products"}
              className="group relative w-full aspect-[16/7] sm:aspect-[16/8] md:aspect-[16/7] rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/90 bg-white shadow-xs hover:shadow-xl hover:border-[#FF5A00]/60 transition-all duration-300 hover:-translate-y-1 block"
            >
              {slot.hasImage ? (
                <>
                  {/* Desktop image */}
                  {slot.desktop_image_url && (
                    <div className="absolute inset-0 hidden sm:block">
                      <Image
                        src={slot.desktop_image_url}
                        alt={slot.title || `Promotional Banner ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Mobile image */}
                  {slot.mobile_image_url && (
                    <div className="absolute inset-0 sm:hidden">
                      <Image
                        src={slot.mobile_image_url}
                        alt={slot.title || `Promotional Banner ${idx + 1}`}
                        fill
                        sizes="100vw"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  {slot.hasText && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  )}

                  {/* Text overlay — fixed bottom-left */}
                  {slot.hasText && (
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-5 space-y-0.5">
                      {slot.title && (
                        <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#FF5A00]">
                          {slot.title}
                        </p>
                      )}
                      {slot.subtitle && (
                        <p className="text-sm sm:text-base font-black text-white leading-tight">
                          {slot.subtitle}
                        </p>
                      )}
                      {slot.description && (
                        <p className="text-[10px] text-white/70 leading-snug max-w-[180px] sm:max-w-[220px] pt-0.5">
                          {slot.description}
                        </p>
                      )}
                      {slot.button_text && (
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF5A00] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider group-hover:bg-[#FF6A00] transition-colors">
                            {slot.button_text}
                            <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                /* Empty slot placeholder */
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gray-50/80 group-hover:bg-orange-50/30 transition-colors space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 text-gray-400 group-hover:text-[#FF5A00] group-hover:border-[#FF5A00]/40 flex items-center justify-center transition-all shadow-xs">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-gray-700 group-hover:text-[#FF5A00] transition-colors block">
                      Banner Slot {idx + 1}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      Upload Image in Admin Panel → Promo Banners
                    </span>
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
