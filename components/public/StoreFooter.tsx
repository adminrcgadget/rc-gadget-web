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
  ChevronDown,
} from "lucide-react";

interface StoreFooterProps {
  settings: SiteSettings;
  socialLinks?: SocialLink[];
}

const FooterAccordion = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-zinc-800/60 lg:border-none">
      {/* Header — clickable only on mobile */}
      <button
        className="w-full flex items-center justify-between py-3.5 lg:py-0 lg:cursor-default lg:pointer-events-none"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <h4 className="text-xs font-black uppercase tracking-widest text-white">
          {title}
        </h4>
        <ChevronDown
          className={`w-4 h-4 text-zinc-500 transition-transform duration-300 lg:hidden ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Content — always visible on desktop, dropdown on mobile */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:!max-h-none lg:!opacity-100 lg:overflow-visible lg:mt-3.5 ${
          open ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0 lg:opacity-100"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

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
    <footer className="bg-black text-gray-400 pt-12 pb-10 border-t border-zinc-800/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Top Brand Row — always full width */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <Link href="#hero" className="inline-block">
            <div className="relative h-10 w-44 sm:h-11 sm:w-52">
              <Image
                src={settings?.logo_url || "/logo/Screenshot 2026-08-18 121555.png"}
                alt={settings?.business_name || "RC GADGETS"}
                fill
                sizes="220px"
                className="object-contain object-left"
              />
            </div>
          </Link>

          <p className="text-xs text-zinc-400 leading-relaxed max-w-xs sm:max-w-sm sm:text-right">
            Your one-stop destination for premium RC cars, planes, boats, drones and accessories. Built for speed, built for passion.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3">
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

        {/* Divider */}
        <div className="border-t border-zinc-800/60" />

        {/* Accordion Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">

          {/* Column 1: QUICK LINKS */}
          <div className="lg:col-span-2">
            <FooterAccordion title="Quick Links">
              <ul className="space-y-2.5 text-xs text-zinc-400">
                {[
                  { label: "Home", href: "/" },
                  { label: "Shop", href: "#featured-products" },
                  { label: "Categories", href: "#shop-by-category" },
                  { label: "Brands", href: "#top-brands" },
                  { label: "Tracks & Arena", href: "#experience" },
                  { label: "Contact", href: "#contact" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterAccordion>
          </div>

          {/* Column 2: CUSTOMER SERVICE */}
          <div className="lg:col-span-2">
            <FooterAccordion title="Customer Service">
              <ul className="space-y-2.5 text-xs text-zinc-400">
                {[
                  { label: "Track Your Order", href: "#contact" },
                  { label: "Returns & Refunds", href: "#contact" },
                  { label: "Shipping Policy", href: "#contact" },
                  { label: "Payment Methods", href: "#contact" },
                  { label: "FAQ & Guides", href: "#about" },
                  { label: "Contact Us", href: "#contact" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterAccordion>
          </div>

          {/* Column 3: OUR STORE */}
          <div className="lg:col-span-3">
            <FooterAccordion title="Our Store">
              <div className="space-y-2.5 text-xs text-zinc-400">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#FF5A00] shrink-0 mt-0.5" />
                  <span>RC Gadgets, Parambilangadi, Kottakkal, Malappuram, Kerala — 676503</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#FF5A00] shrink-0" />
                  <a href={`tel:${rawPhone}`} className="hover:text-white font-bold text-zinc-200">
                    +91 {phoneDisplay}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#FF5A00] shrink-0" />
                  <a href={`mailto:${settings?.email || "rcgadgetsstore@gmail.com"}`} className="hover:text-white break-all">
                    {settings?.email || "rcgadgets.kottakkal@gmail.com"}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#FF5A00] shrink-0" />
                  <span>Mon - Sat: 9AM – 8PM</span>
                </div>
              </div>
            </FooterAccordion>
          </div>

          {/* Column 4: NEWSLETTER (no accordion — always visible) */}
          <div className="lg:col-span-2 pt-4 lg:pt-0">
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-3.5">
              Newsletter
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
              Subscribe for new arrivals, offers & RC events.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-[#FF5A00] transition-colors"
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
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Subscribed!</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
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
