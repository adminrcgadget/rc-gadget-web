"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteSettings, NavigationItem, SocialLink } from "@/types/database";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { renderSocialBrandIcon } from "@/components/ui/SocialIcons";

interface FooterProps {
  settings: SiteSettings;
  navigation: NavigationItem[];
  socialLinks: SocialLink[];
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  navigation,
  socialLinks,
}) => {
  const defaultSocials = [
    { id: "soc-1", platform: "Facebook", url: settings.facebook_url || "https://www.facebook.com" },
    { id: "soc-2", platform: "Instagram", url: settings.instagram_url || "https://www.instagram.com" },
    { id: "soc-3", platform: "YouTube", url: settings.youtube_url || "https://www.youtube.com" },
    { id: "soc-4", platform: "WhatsApp", url: settings.whatsapp_number ? `https://wa.me/${settings.whatsapp_number}` : "https://whatsapp.com" },
  ];

  // Deduplicate social links by platform so each platform (Instagram, Facebook, YouTube, WhatsApp) only appears ONCE
  const socials = React.useMemo(() => {
    const raw = socialLinks && socialLinks.length > 0 ? socialLinks : defaultSocials;
    const seenPlatforms = new Set<string>();
    const filtered: any[] = [];

    for (const soc of raw) {
      const platformKey = (soc.platform || "").trim().toLowerCase();
      if (platformKey && !seenPlatforms.has(platformKey)) {
        seenPlatforms.add(platformKey);
        filtered.push(soc);
      }
    }

    // Fill remaining default platforms if any are missing
    for (const def of defaultSocials) {
      const platformKey = def.platform.toLowerCase();
      if (!seenPlatforms.has(platformKey)) {
        seenPlatforms.add(platformKey);
        filtered.push(def);
      }
    }

    return filtered.slice(0, 4);
  }, [socialLinks, settings]);

  return (
    <footer className="bg-white text-gray-600 pt-10 pb-12 relative overflow-hidden border-t border-gray-200">

      {/* 1. Social Strip: FOLLOW US */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 select-none">
          <div className="w-10 sm:w-16 h-0.5 bg-gradient-to-r from-transparent to-[#FF5A00]" />
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-gray-900 text-center">
            FOLLOW US
          </h3>
          <div className="w-10 sm:w-16 h-0.5 bg-gradient-to-l from-transparent to-[#FF5A00]" />
        </div>

        {/* 4 Circular Social Buttons */}
        <div className="flex items-center justify-center gap-3.5">
          {socials.slice(0, 4).map((soc: any) => (
            <a
              key={soc.id}
              href={soc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-[#FF5A00] text-gray-700 hover:text-[#FF5A00] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
              aria-label={soc.platform}
            >
              {renderSocialBrandIcon(soc.platform, "w-4 h-4")}
            </a>
          ))}
        </div>
      </div>

      {/* 2. Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-12 border-t border-gray-100 pt-10 items-start">

          {/* Column 1: Brand & Details (Col 4) */}
          <div className="lg:col-span-4 space-y-3">
            <Link href="#hero" className="inline-block group">
              {settings.logo_url ? (
                <div className="relative h-8 w-36 sm:h-9 sm:w-40">
                  <Image
                    src={settings.logo_url}
                    alt={settings.business_name || "RC Gadgets"}
                    fill
                    sizes="200px"
                    className="object-contain object-left"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-1.5 font-black italic tracking-wider text-xl">
                  <span className="text-[#FF5A00]">RC</span>
                  <span className="text-black">GADGETS</span>
                </div>
              )}
            </Link>

            <p className="text-xs font-bold text-gray-900 pt-0.5">
              {settings.tagline || "Your World of Remote Control"}
            </p>

            <p className="text-[11px] sm:text-xs text-gray-500 font-normal leading-relaxed max-w-sm">
              {settings.description ||
                "Your ultimate destination for premium RC Cars, RC Planes, RC Ships, RC Excavators and all RC Gadgets."}
            </p>

            <div className="space-y-1.5 pt-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FF5A00]" />
                <span>{settings.phone ? `+91 ${settings.phone.replace(/^\+?91\s*/, "")}` : "+91 75 101 101 55"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FF5A00]" />
                <span>{settings.email || "rcgadgetsstore@gmail.com"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#FF5A00]" />
                <span>{settings.city || "Kottakkal"}, {settings.state || "Kerala, India"}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links (Col 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="#hero" className="text-gray-600 hover:text-[#FF5A00] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#our-world" className="text-gray-600 hover:text-[#FF5A00] transition-colors">
                  Our World
                </Link>
              </li>
              <li>
                <Link href="#coming-soon" className="text-gray-600 hover:text-[#FF5A00] transition-colors">
                  Coming Soon
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-600 hover:text-[#FF5A00] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-600 hover:text-[#FF5A00] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#experience" className="text-gray-600 hover:text-[#FF5A00] transition-colors">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-600 hover:text-[#FF5A00] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Collection (Col 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
              OUR COLLECTION
            </h4>
            <ul className="space-y-2 text-xs font-medium text-gray-600">
              <li>
                <Link href="#our-world" className="hover:text-[#FF5A00] transition-colors">
                  RC Cars
                </Link>
              </li>
              <li>
                <Link href="#our-world" className="hover:text-[#FF5A00] transition-colors">
                  RC Planes
                </Link>
              </li>
              <li>
                <Link href="#our-world" className="hover:text-[#FF5A00] transition-colors">
                  RC Ships
                </Link>
              </li>
              <li>
                <Link href="#our-world" className="hover:text-[#FF5A00] transition-colors">
                  RC Excavators
                </Link>
              </li>
              <li>
                <Link href="#our-world" className="hover:text-[#FF5A00] transition-colors">
                  RC Gadgets
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter / Stay Updated (Col 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
              NEWSLETTER
            </h4>
            <p className="text-xs text-gray-500">
              Subscribe to get updates on new arrivals, deals & more.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-2 pt-1">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3.5 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#FF5A00] text-xs text-gray-900 outline-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#FF5A00] hover:bg-[#FF6A00] text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>

        </div>

        {/* 3. Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 border-t border-gray-100">
          <p>{settings.copyright_text || "© 2026 RC GADGETS. All rights reserved."}</p>
          <div className="flex items-center gap-6">
            <Link href="#about" className="hover:text-gray-700 transition-colors">Privacy Policy</Link>
            <Link href="#about" className="hover:text-gray-700 transition-colors">Terms of Service</Link>
            <Link href="#contact" className="hover:text-gray-700 transition-colors">Refund Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
