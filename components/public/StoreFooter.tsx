"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteSettings, SocialLink } from "@/types/database";
import { renderSocialBrandIcon } from "@/components/ui/SocialIcons";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ArrowUp,
  Check,
} from "lucide-react";

interface StoreFooterProps {
  settings: SiteSettings;
  socialLinks?: SocialLink[];
}

export const StoreFooter: React.FC<StoreFooterProps> = ({
  settings,
  socialLinks,
}) => {
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const phoneDisplay = settings?.phone
    ? settings.phone.replace(/^\+?91\s*/, "")
    : "75 101 101 55";
  const rawPhone = (settings?.phone || "7510110155").replace(/[^0-9]/g, "");

  const defaultSocials = [
    {
      id: "s-1",
      platform: "Instagram",
      url: settings?.instagram_url || "https://www.instagram.com/rc_gadgetsstore/",
    },
    {
      id: "s-2",
      platform: "WhatsApp",
      url: `https://wa.me/${rawPhone}`,
    },
    {
      id: "s-3",
      platform: "YouTube",
      url: settings?.youtube_url || "https://www.youtube.com",
    },
    {
      id: "s-4",
      platform: "Facebook",
      url: settings?.facebook_url || "https://www.facebook.com/share/19FeP3z6KV/",
    },
  ];

  const socials =
    socialLinks && socialLinks.length > 0 ? socialLinks : defaultSocials;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setIsSubscribed(true);
    setEmailInput("");
    setTimeout(() => setIsSubscribed(false), 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black text-gray-400 pt-16 pb-12 border-t border-zinc-800/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-3 space-y-4">
            <Link href="#hero" className="inline-block group">
              <div className="relative h-10 w-48 sm:h-11 sm:w-52">
                <Image
                  src={settings?.logo_url || "/logo/Screenshot 2026-08-18 121555.png"}
                  alt={settings?.business_name || "RC GADGETS"}
                  fill
                  sizes="220px"
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Your one-stop destination for premium RC cars, planes, boats, drones and accessories. Built for speed, built for passion.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {socials.map((soc: any) => (
                <a
                  key={soc.id || soc.platform}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 hover:border-[#FF5A00] text-zinc-400 hover:text-[#FF5A00] flex items-center justify-center transition-all hover:scale-110"
                  aria-label={soc.platform}
                >
                  {renderSocialBrandIcon(soc.platform, "w-4 h-4")}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: QUICK LINKS */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#featured-products" className="hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="#shop-by-category" className="hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="#top-brands" className="hover:text-white transition-colors">
                  Brands
                </Link>
              </li>
              <li>
                <Link href="#experience" className="hover:text-white transition-colors">
                  Tracks &amp; Arena
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: CUSTOMER SERVICE */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">
              CUSTOMER SERVICE
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="#contact" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors">
                  Returns &amp; Refunds
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors">
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-white transition-colors">
                  FAQ &amp; Guides
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: OUR STORE */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">
              OUR STORE
            </h4>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF5A00] shrink-0 mt-0.5" />
                <span>
                  RC Gadgets, Parambilangadi, Kottakkal, Malappuram, Kerala, India - 676503
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FF5A00] shrink-0" />
                <a href={`tel:${rawPhone}`} className="hover:text-white font-bold text-zinc-200">
                  +91 {phoneDisplay}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FF5A00] shrink-0" />
                <a href={`mailto:${settings?.email || "rcgadgetsstore@gmail.com"}`} className="hover:text-white">
                  {settings?.email || "rcgadgets.kottakkal@gmail.com"}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#FF5A00] shrink-0" />
                <span>Mon - Sat: 9AM - 8PM</span>
              </div>
            </div>
          </div>

          {/* Column 5: NEWSLETTER */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">
              NEWSLETTER
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Subscribe for updates on new arrivals, offers and RC events.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-[#FF5A00]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[#FF5A00] hover:bg-[#FF6A00] text-white flex items-center justify-center transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {isSubscribed && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold pt-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Subscribed!</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <p>© 2026 RC Gadgets Kottakkal. All Rights Reserved.</p>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-zinc-500 font-semibold">
              First in Malappuram • Professional RC Hub
            </span>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full border border-zinc-800 hover:border-[#FF5A00] text-zinc-400 hover:text-[#FF5A00] flex items-center justify-center transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
