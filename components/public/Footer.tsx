"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteSettings, NavigationItem, SocialLink } from "@/types/database";
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
    { id: "soc-1", platform: "Instagram", url: settings.instagram_url || "https://www.instagram.com/rc_gadgetsstore/" },
    { id: "soc-2", platform: "Facebook", url: settings.facebook_url || "https://www.facebook.com/share/19FeP3z6KV/" },
    { id: "soc-3", platform: "YouTube", url: settings.youtube_url || "https://www.youtube.com" },
  ];

  const socials = socialLinks && socialLinks.length > 0 ? socialLinks : (defaultSocials as any);

  return (
    <footer className="bg-[#050505] text-zinc-400 pt-8 pb-12 relative overflow-hidden">
      
      {/* 1. Social Strip: FOLLOW US FOR LATEST UPDATES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-center gap-4 mb-6 select-none">
          <div className="w-12 sm:w-20 h-0.5 bg-gradient-to-r from-transparent to-[#FF5500]" />
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white text-center">
            FOLLOW US FOR <span className="text-[#FF5500]">LATEST</span> UPDATES
          </h3>
          <div className="w-12 sm:w-20 h-0.5 bg-gradient-to-l from-transparent to-[#FF5500]" />
        </div>

        {/* 3 Circular Social Buttons */}
        <div className="flex items-center justify-center gap-4">
          {socials.slice(0, 3).map((soc: any) => (
            <a
              key={soc.id}
              href={soc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-[#0E0E0E] border border-[#FF5500]/60 hover:border-[#FF5500] hover:bg-[#FF5500] text-zinc-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg shadow-[#FF5500]/10 hover:shadow-[#FF5500]/40"
              aria-label={soc.platform}
            >
              {renderSocialBrandIcon(soc.platform, "w-5 h-5")}
            </a>
          ))}
        </div>
      </div>

      {/* 2. Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-t border-white/10 pt-12 items-start">
          
          {/* Column 1: Brand & Tagline (Col 5) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="#hero" className="inline-block group">
              {settings.logo_url ? (
                <div className="relative h-10 w-44">
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
                  <span className="text-[#FF5500]">RC</span>
                  <span className="text-white">GADGETS</span>
                </div>
              )}
            </Link>

            <p className="text-xs text-zinc-400 font-medium leading-relaxed max-w-sm">
              Built for passion. Driven by performance.
              <br />
              RC Gadgets – where excitement begins!
            </p>
          </div>

          {/* Column 2: Quick Links (Col 3) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black text-orange-500 uppercase tracking-widest">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link href="#hero" className="hover:text-[#FF5500] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-[#FF5500] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#our-world" className="hover:text-[#FF5500] transition-colors">
                  Our World
                </Link>
              </li>
              <li>
                <Link href="#experience" className="hover:text-[#FF5500] transition-colors">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-[#FF5500] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info (Col 4) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-black text-orange-500 uppercase tracking-widest">
              CONTACT INFO
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#FF5500] fill-current shrink-0 mt-0.5">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
                </svg>
                <span>
                  {settings.city || "Kottakkal"}, {settings.address || "Parambilangadi"}
                  <br />
                  {settings.state ? `${settings.city}, ${settings.state}` : "Malappuram, Kerala"}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#FF5500] fill-current shrink-0">
                  <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <a
                  href={`tel:${(settings.phone || "7510110155").replace(/\s+/g, "")}`}
                  className="hover:text-white font-bold transition-colors"
                >
                  {settings.phone || "75 101 101 55"}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#FF5500] fill-current shrink-0">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <a
                  href={`mailto:${settings.email || "rcgadgetsstore@gmail.com"}`}
                  className="hover:text-white transition-colors truncate"
                >
                  {settings.email || "rcgadgetsstore@gmail.com"}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Bottom Copyright Bar */}
        <div className="pt-8 text-center text-[11px] text-zinc-500 border-t border-white/5">
          <p>{settings.copyright_text || "© 2026 RC Gadgets. All Rights Reserved."}</p>
        </div>

      </div>
    </footer>
  );
};
