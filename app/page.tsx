import React from "react";
import { StoreProvider } from "@/components/context/StoreContext";
import { Header } from "@/components/public/Header";
import { StoreHero } from "@/components/public/StoreHero";
import { TrustBar } from "@/components/public/TrustBar";
import { ShopByCategory } from "@/components/public/ShopByCategory";
import { FeaturedProducts } from "@/components/public/FeaturedProducts";
import { PromoTriCards } from "@/components/public/PromoTriCards";
import { SecondaryTrustBar } from "@/components/public/SecondaryTrustBar";
import { StoreFooter } from "@/components/public/StoreFooter";
import { CartDrawer } from "@/components/public/CartDrawer";

import {
  getSiteSettings,
  getNavigationItems,
  getHeroSlides,
  getCategories,
  getActiveBanners,
  getSocialLinks,
  getProducts,
} from "@/lib/queries";

export const revalidate = 0;

export default async function HomePage() {
  const [settings, navigation, heroSlides, categories, banners, socialLinks, products] =
    await Promise.all([
      getSiteSettings(),
      getNavigationItems(),
      getHeroSlides(),
      getCategories(),
      getActiveBanners(),
      getSocialLinks(),
      getProducts(),
    ]);

  return (
    <StoreProvider>
      <main className="min-h-screen bg-[#F8F9FA] text-[#111111] selection:bg-[#FF5A00] selection:text-white relative pt-16 sm:pt-20">
        {/* 1. Header Navigation */}
        <Header settings={settings} navigation={navigation} />

        {/* 2. Auto-Sliding 3-Banner Hero Showcase */}
        <StoreHero heroSlides={heroSlides} />

        {/* 3. Value Proposition Trust Bar */}
        <TrustBar />

        {/* 4. Shop By Category (8 Categories) */}
        <ShopByCategory categories={categories} />

        {/* 5. Featured Products with Tabs */}
        <FeaturedProducts products={products} />

        {/* 6. 3 Promo Banners Under Products */}
        <PromoTriCards banners={banners} />

        {/* 7. Secondary Guarantee & Trust Bar */}
        <SecondaryTrustBar />

        {/* 8. 5-Column Dark Store Footer */}
        <StoreFooter settings={settings} socialLinks={socialLinks} />

        {/* 9. Interactive Slide-over Cart Drawer */}
        <CartDrawer />
      </main>
    </StoreProvider>
  );
}

