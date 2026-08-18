"use client";

import React from "react";
import { SiteSettings } from "@/types/database";

interface ContactSectionProps {
  settings: SiteSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  return (
    <section id="contact" className="py-12 bg-[#050505] relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Metallic Light Chamfered Strip */}
        <div className="relative rounded-[32px] bg-[#E1E4E8] text-zinc-950 p-6 sm:p-10 shadow-2xl border-2 border-white/80 overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-400/40 items-center">
            
            {/* Col 1: Visit Us */}
            <div className="py-4 md:py-2 md:px-6 flex items-start gap-4">
              <div className="shrink-0 text-[#FF5500] pt-1">
                <svg viewBox="0 0 24 24" className="w-9 h-9 fill-[#FF5500] stroke-none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
                </svg>
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#FF5500] block">
                  VISIT US
                </span>
                <p className="text-sm sm:text-base font-black uppercase text-zinc-900 leading-tight mt-1">
                  {settings.city || "KOTTAKKAL"}
                  <br />
                  {settings.address || "PARAMBILANGADI"}
                  <br />
                  <span className="text-zinc-700 text-xs sm:text-sm font-bold">
                    {settings.state ? `${settings.city}, ${settings.state}` : "MALAPPURAM, KERALA"}
                  </span>
                </p>
              </div>
            </div>

            {/* Col 2: Call Us */}
            <div className="py-4 md:py-2 md:px-6 flex items-center gap-4">
              <a
                href={`tel:${(settings.phone || "7510110155").replace(/\s+/g, "")}`}
                className="w-12 h-12 rounded-full bg-[#FF5500] text-white flex items-center justify-center shrink-0 shadow-md hover:scale-105 transition-transform"
                aria-label="Call RC Gadgets"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </a>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#FF5500] block">
                  CALL US
                </span>
                <a
                  href={`tel:${(settings.phone || "7510110155").replace(/\s+/g, "")}`}
                  className="text-lg sm:text-2xl font-black text-zinc-950 hover:text-[#FF5500] transition-colors block tracking-tight"
                >
                  {settings.phone || "75 101 101 55"}
                </a>
              </div>
            </div>

            {/* Col 3: Email Us */}
            <div className="py-4 md:py-2 md:px-6 flex items-center gap-4">
              <a
                href={`mailto:${settings.email || "rcgadgetsstore@gmail.com"}`}
                className="w-12 h-12 rounded-full bg-[#FF5500] text-white flex items-center justify-center shrink-0 shadow-md hover:scale-105 transition-transform"
                aria-label="Email RC Gadgets"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>
              <div className="truncate">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#FF5500] block">
                  EMAIL US
                </span>
                <a
                  href={`mailto:${settings.email || "rcgadgetsstore@gmail.com"}`}
                  className="text-xs sm:text-sm font-black text-zinc-950 hover:text-[#FF5500] transition-colors block truncate"
                >
                  {settings.email || "rcgadgetsstore@gmail.com"}
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
