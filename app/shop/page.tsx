import React from "react";
import { Metadata } from "next";
import { StoreProvider } from "@/components/context/StoreContext";
import { Header } from "@/components/public/Header";
import { ShopCatalog } from "@/components/public/ShopCatalog";
import { TrustBar } from "@/components/public/TrustBar";
import { StoreFooter } from "@/components/public/StoreFooter";
import { CartDrawer } from "@/components/public/CartDrawer";
import {
  getSiteSettings,
  getNavigationItems,
  getCategories,
  getSocialLinks,
  getProducts,
} from "@/lib/queries";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Shop RC Models & Accessories | ${settings.business_name || "RC Gadgets"}`,
    description:
      "Explore high-performance RC Cars, Planes, Ships, Helicopters, Drones, Excavators, and replacement accessories at RC Gadgets Kottakkal.",
  };
}

export default async function ShopPage() {
  const [settings, navigation, categories, socialLinks, products] =
    await Promise.all([
      getSiteSettings(),
      getNavigationItems(),
      getCategories(),
      getSocialLinks(),
      getProducts(),
    ]);

  return (
    <StoreProvider>
      <main className="min-h-screen bg-white text-[#111111] selection:bg-[#FF5A00] selection:text-white relative pt-16 sm:pt-20">
        {/* Header Navigation */}
        <Header settings={settings} navigation={navigation} />

        {/* Interactive Shop Catalog */}
        <ShopCatalog
          initialProducts={products}
          categories={categories}
          settings={settings}
        />

        {/* Guarantee & Value Proposition Bar */}
        <div className="border-t border-gray-200 mt-12">
          <TrustBar />
        </div>

        {/* Store Footer */}
        <StoreFooter settings={settings} socialLinks={socialLinks} />

        {/* Slide-over Cart Drawer */}
        <CartDrawer />
      </main>
    </StoreProvider>
  );
}
