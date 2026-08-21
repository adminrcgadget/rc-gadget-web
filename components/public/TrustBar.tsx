"use client";

import React from "react";
import { ShieldCheck, CreditCard, Truck, Headphones } from "lucide-react";

export const TrustBar: React.FC = () => {
  const items = [
    {
      icon: ShieldCheck,
      title: "PREMIUM QUALITY",
      subtitle: "Handpicked & tested RC products",
    },
    {
      icon: CreditCard,
      title: "SECURE PAYMENTS",
      subtitle: "100% safe & trusted checkout",
    },
    {
      icon: Truck,
      title: "FAST SHIPPING",
      subtitle: "Pan India delivery",
    },
    {
      icon: Headphones,
      title: "EXPERT SUPPORT",
      subtitle: "We're here to help you",
    },
  ];

  return (
    <section className="py-4 sm:py-6 bg-transparent select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 rounded-3xl bg-white border border-gray-200/80 p-5 sm:p-6 shadow-xs">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 sm:gap-3.5 group"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-orange-50 group-hover:bg-[#FF5A00] border border-orange-100 group-hover:border-[#FF5A00] flex items-center justify-center text-[#FF5A00] group-hover:text-white transition-all duration-300 shrink-0">
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-gray-900 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium leading-tight line-clamp-1">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
