"use client";

import React from "react";
import { usePathname } from "next/navigation";

interface FloatingWhatsAppProps {
  phone?: string | null;
}

export function FloatingWhatsApp({ phone = "7510110155" }: FloatingWhatsAppProps) {
  const pathname = usePathname();

  // Do not render floating button on admin dashboard pages
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  const cleanPhone = (phone || "7510110155").replace(/[^0-9]/g, "");
  const whatsappNumber = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi RC Gadgets! 🏎️ I would like to inquire about your RC models."
  )}`;

  return (
    <aside
      aria-label="Contact via WhatsApp"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 group select-none pointer-events-auto"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-emerald-950/25 hover:shadow-2xl hover:shadow-emerald-900/40 hover:scale-108 active:scale-95 transition-all duration-300 cursor-pointer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        {/* Subtle Ping Glow ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping opacity-75 -z-10 pointer-events-none duration-1000" />

        {/* WhatsApp Official SVG Logo */}
        <svg
          viewBox="0 0 32 32"
          className="w-7 h-7 sm:w-8 sm:h-8 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.002 0C7.164 0 0 7.163 0 16c0 2.825.738 5.58 2.143 8.013L.07 31.93l8.113-2.038A15.937 15.937 0 0016.002 32C24.836 32 32 24.837 32 16c0-8.837-7.164-16-16-16zm0 29.333a13.268 13.268 0 01-6.767-1.847l-.485-.288-5.03 1.263 1.346-4.9-.317-.504A13.29 13.29 0 012.667 16c0-7.352 5.98-13.333 13.335-13.333 7.352 0 13.331 5.981 13.331 13.333 0 7.355-5.979 13.333-13.331 13.333zm7.31-9.983c-.4-.2-2.37-1.17-2.738-1.303-.367-.134-.633-.2-.9.2-.267.4-1.034 1.303-1.267 1.57-.234.267-.467.3-.867.1-.4-.2-1.69-.623-3.22-1.988-1.19-.1.062-1.994-2.373-2.228-2.773-.233-.4-.025-.616.175-.815.18-.18.4-.467.6-.7.2-.234.267-.4.4-.667.133-.267.067-.5-.033-.7-.1-.2-.9-2.17-1.234-2.97-.325-.78-.656-.674-.9-.686-.233-.012-.5-.015-.767-.015-.267 0-.7.1-1.067.5-.367.4-1.4 1.368-1.4 3.336 0 1.968 1.434 3.868 1.634 4.135.2.267 2.822 4.31 6.838 6.042.955.412 1.7.658 2.28.843.959.305 1.832.262 2.522.159.77-.115 2.37-.968 2.703-1.902.334-.935.334-1.736.234-1.902-.1-.167-.367-.267-.767-.467z" />
        </svg>

        {/* Hover Pill Tooltip */}
        <span className="hidden sm:block absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-gray-900/95 backdrop-blur-md text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl">
          Chat with us on WhatsApp
        </span>
      </a>
    </aside>
  );
}
