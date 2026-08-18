"use client";

import React from "react";
import Link from "next/link";
import { SiteSettings } from "@/types/database";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";

interface ContactSectionProps {
  settings: SiteSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  return (
    <section id="contact" className="py-6 sm:py-10 bg-transparent relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Floating White Contact Panel */}
        <div className="relative rounded-3xl bg-white border border-gray-200/80 p-6 sm:p-8 lg:p-10 shadow-sm overflow-hidden">
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-6 items-center">
            
            {/* Left Info: 3 Columns (Col 8) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              
              {/* Item 1: Visit Us */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5A00] shrink-0 shadow-sm">
                  <MapPin className="w-5 h-5 text-[#FF5A00]" />
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#FF5A00] block">
                    VISIT US
                  </span>
                  <p className="text-xs sm:text-sm font-black uppercase text-gray-900 leading-snug mt-0.5">
                    {settings.city || "KOTTAKKAL"}
                    <br />
                    <span className="text-gray-500 text-[11px] sm:text-xs font-semibold">
                      {settings.address && settings.state
                        ? `${settings.address}, ${settings.state} - INDIA`
                        : "Parambilangadi, Kerala - 676503 India"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Item 2: Call Us */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5A00] shrink-0 shadow-sm">
                  <Phone className="w-5 h-5 text-[#FF5A00]" />
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#FF5A00] block">
                    CALL US
                  </span>
                  <a
                    href={`tel:${(settings.phone || "7510110155").replace(/\s+/g, "")}`}
                    className="text-xs sm:text-sm font-black text-gray-900 hover:text-[#FF5A00] transition-colors block mt-0.5"
                  >
                    {settings.phone ? `+91 ${settings.phone.replace(/^\+?91\s*/, "")}` : "+91 75 101 101 55"}
                  </a>
                </div>
              </div>

              {/* Item 3: Email Us */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5A00] shrink-0 shadow-sm">
                  <Mail className="w-5 h-5 text-[#FF5A00]" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#FF5A00] block">
                    EMAIL US
                  </span>
                  <a
                    href={`mailto:${settings.email || "rcgadgetsstore@gmail.com"}`}
                    className="text-xs sm:text-sm font-black text-gray-900 hover:text-[#FF5A00] transition-colors block truncate mt-0.5"
                  >
                    {settings.email || "rcgadgetstore@gmail.com"}
                  </a>
                </div>
              </div>

            </div>

            {/* Vertical Divider (Col 1) */}
            <div className="hidden lg:flex lg:col-span-1 justify-center">
              <div className="w-[1px] h-14 bg-gray-200" />
            </div>

            {/* Right Action CTA (Col 3) */}
            <div className="lg:col-span-3 flex flex-col items-center lg:items-end justify-center">
              <Link
                href={`tel:${(settings.phone || "7510110155").replace(/\s+/g, "")}`}
                className="w-full sm:w-auto px-7 py-3 rounded-lg font-black text-xs sm:text-sm uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-[#FF6A00] shadow-md shadow-[#FF5A00]/25 transition-all duration-300 flex items-center justify-center gap-2 group text-center"
              >
                <span>GET IN TOUCH</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="text-[11px] text-gray-400 mt-1.5 text-center lg:text-right">
                We&apos;re here to help you!
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
