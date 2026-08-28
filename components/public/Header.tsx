"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SiteSettings, NavigationItem } from "@/types/database";
import { useStore } from "@/components/context/StoreContext";
import {
  Menu,
  X,
  ArrowRight,
  Phone,
  ShoppingBag,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface HeaderProps {
  settings: SiteSettings;
  navigation?: NavigationItem[];
}

interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: { label: string; href: string; badge?: string }[];
}

export const Header: React.FC<HeaderProps> = ({ settings }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeHref, setActiveHref] = useState("");
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { cartCount, setIsCartOpen } = useStore();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Essential links:
  // Shop | RC Cars ⌄ | RC Accessories | Hotwheels | Contact
  const navItems: NavLinkItem[] = [
    {
      id: "nav-shop",
      label: "Shop",
      href: "/shop",
    },
    {
      id: "nav-rc-cars",
      label: "RC Cars",
      href: "/shop?category=RC%20Cars",
      hasDropdown: true,
      dropdownItems: [
        { label: "All RC Cars", href: "/shop?category=RC%20Cars" },
        { label: "Monster Trucks (8S & 4S)", href: "/shop?category=RC%20Cars&q=Monster", badge: "HOT" },
        { label: "Rock Crawlers & Off-Road", href: "/shop?category=RC%20Crawlers" },
        { label: "Drift & High-Speed Racers", href: "/shop?category=RC%20Drift" },
        { label: "Mini RC Cars (1:28 / 1:64)", href: "/shop?category=Mini%20RC%20Cars" },
      ],
    },
    {
      id: "nav-rc-accessories",
      label: "RC Accessories",
      href: "/shop?category=RC%20Car%20Accessories",
    },
    {
      id: "nav-hotwheels",
      label: "Hotwheels",
      href: "/shop?category=Hotwheels",
    },
    {
      id: "nav-contact",
      label: "Contact",
      href: isHomePage ? "#contact" : "/#contact",
    },
  ];

  // Helper to format href correctly from any subpage
  const formatHref = (href: string) => {
    if (!href) return "/";
    if (href.startsWith("#")) {
      return isHomePage ? href : `/${href}`;
    }
    return href;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (isHomePage) {
        const sections = ["contact", "experience", "about", "coming-soon", "our-world", "hero"];
        for (const sectionId of sections) {
          const el = document.getElementById(sectionId);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 120 && rect.bottom >= 120) {
              setActiveHref(`#${sectionId}`);
              return;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseEnterDropdown = (id: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(id);
  };

  const handleMouseLeaveDropdown = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // Determine active state cleanly
  const isItemActive = (item: NavLinkItem) => {
    if (pathname === "/shop") {
      return item.id === "nav-shop";
    }
    if (pathname.startsWith("/shop?category=RC%20Cars")) {
      return item.id === "nav-rc-cars";
    }
    if (pathname.startsWith("/shop?category=RC%20Car%20Accessories") || pathname.startsWith("/shop?category=RC%20Accessories")) {
      return item.id === "nav-rc-accessories";
    }
    if (pathname.startsWith("/shop?category=Hotwheels")) {
      return item.id === "nav-hotwheels";
    }
    if (pathname.startsWith("/products")) {
      return item.id === "nav-shop";
    }
    if (isHomePage) {
      if (item.href === "#contact" && activeHref === "#contact") return true;
    }
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black border-b border-zinc-800/80 h-16 sm:h-18 ${
        isScrolled ? "shadow-lg shadow-black/40" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 group shrink-0"
          >
            <div className="relative h-10 w-40 sm:h-11 sm:w-44 flex items-center transition-transform duration-300 group-hover:scale-105">
              <Image
                src={settings.logo_url || "/logo/Screenshot 2026-08-18 121555.png"}
                alt={settings.business_name || "RC Gadgets"}
                fill
                sizes="(max-width: 640px) 160px, 220px"
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Center Navigation Links (Matching Exact Title-Case Reference Design) */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => {
              const targetHref = formatHref(item.href);
              const isActive = isItemActive(item);
              const isDropdownOpen = activeDropdown === item.id;

              if (item.hasDropdown && item.dropdownItems) {
                return (
                  <div
                    key={item.id}
                    className="relative py-3"
                    onMouseEnter={() => handleMouseEnterDropdown(item.id)}
                    onMouseLeave={handleMouseLeaveDropdown}
                  >
                    <Link
                      href={targetHref}
                      className={`text-[13px] font-medium transition-colors flex items-center gap-1 py-1 ${
                        isActive
                          ? "text-white font-semibold"
                          : "text-zinc-300 hover:text-white"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180 text-[#FF5A00]" : ""
                        }`}
                      />
                    </Link>

                    {isActive && (
                      <span className="absolute bottom-1.5 left-0 right-0 h-[2px] bg-[#FF5A00] shadow-[0_0_8px_#FF5A00] rounded-full" />
                    )}

                    {/* Sleek Dark Dropdown Popup */}
                    {isDropdownOpen && (
                      <div className="absolute top-full -left-4 w-60 bg-[#0D0D10]/98 backdrop-blur-xl border border-zinc-800/90 rounded-2xl p-2 shadow-2xl shadow-black/80 space-y-1 animate-in fade-in slide-in-from-top-2 z-50">
                        {item.dropdownItems.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-all group"
                          >
                            <span>{sub.label}</span>
                            {sub.badge ? (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-[#FF5A00] text-white">
                                {sub.badge}
                              </span>
                            ) : (
                              <ArrowRight className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:text-[#FF5A00] transition-opacity" />
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={item.id} className="relative py-3">
                  <Link
                    href={targetHref}
                    className={`text-[13px] font-medium transition-colors py-1 block ${
                      isActive
                        ? "text-white font-semibold"
                        : "text-zinc-300 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>

                  {isActive && (
                    <span className="absolute bottom-1.5 left-0 right-0 h-[2px] bg-[#FF5A00] shadow-[0_0_8px_#FF5A00] rounded-full" />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-3.5">
            {/* Phone Quick Call */}
            <a
              href={`tel:${(settings.phone || "7510110155").replace(/\s+/g, "")}`}
              className="p-2 text-zinc-400 hover:text-[#FF5A00] transition-colors rounded-lg hover:bg-zinc-900 flex items-center gap-1.5 text-xs font-semibold"
              title="Call Us"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span className="text-[11px] text-zinc-300">
                {settings.phone ? `+91 ${settings.phone.replace(/^\+?91\s*/, "")}` : "+91 75 101 101 55"}
              </span>
            </a>

            {/* Cart Icon Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#FF5A00]" />
              <span className="text-[12px] font-medium text-zinc-200">Cart</span>
              {cartCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#FF5A00] text-white text-[9px] font-black flex items-center justify-center animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>

            <Link
              href={formatHref("#contact")}
              className="group px-4 py-2 rounded-lg bg-[#FF5A00] hover:bg-[#FF6A00] text-white transition-all duration-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#FF5A00]/25 hover:shadow-[#FF5A00]/40 cursor-pointer"
            >
              <span>GET IN TOUCH</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white hover:border-[#FF5A00] transition-colors cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#FF5A00]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF5A00] text-white text-[9px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <a
              href={`tel:${(settings.phone || "7510110155").replace(/\s+/g, "")}`}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[#FF5A00] hover:border-[#FF5A00]/50 transition-colors"
              aria-label="Call store"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-zinc-900 border border-zinc-800 text-white rounded-lg hover:border-[#FF5A00] transition-colors active:scale-95 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#FF5A00]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/98 backdrop-blur-xl border-b border-zinc-800 shadow-2xl shadow-black/80 px-5 py-5 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const targetHref = formatHref(item.href);
              const isActive = isItemActive(item);
              const isSubOpen = openMobileDropdown === item.id;

              if (item.hasDropdown && item.dropdownItems) {
                return (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900/50">
                      <Link
                        href={targetHref}
                        onClick={() => setMobileMenuOpen(false)}
                        className={isActive ? "text-[#FF5A00] font-bold" : ""}
                      >
                        {item.label}
                      </Link>
                      <button
                        onClick={() =>
                          setOpenMobileDropdown(isSubOpen ? null : item.id)
                        }
                        className="p-1 text-zinc-400 hover:text-white"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isSubOpen ? "rotate-180 text-[#FF5A00]" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {isSubOpen && (
                      <div className="pl-4 space-y-1 border-l-2 border-zinc-800 ml-3">
                        {item.dropdownItems.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-2 px-3 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/40 flex items-center justify-between block"
                          >
                            <span>{sub.label}</span>
                            {sub.badge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#FF5A00] text-white">
                                {sub.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={targetHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    isActive
                      ? "text-[#FF5A00] bg-zinc-900/80 font-bold"
                      : "text-zinc-300 hover:text-white hover:bg-zinc-900/50"
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 ${isActive ? "text-[#FF5A00]" : "text-zinc-600"}`}
                  />
                </Link>
              );
            })}

            <div className="pt-3 border-t border-zinc-800/80 mt-2 space-y-2.5">
              <Link
                href={formatHref("#contact")}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center text-xs font-black uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-[#FF6A00] rounded-xl shadow-lg shadow-[#FF5A00]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>GET IN TOUCH</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
