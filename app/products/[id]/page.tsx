import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StoreProvider } from "@/components/context/StoreContext";
import { Header } from "@/components/public/Header";
import { ProductDetailsView } from "@/components/public/ProductDetailsView";
import { TrustBar } from "@/components/public/TrustBar";
import { StoreFooter } from "@/components/public/StoreFooter";
import { CartDrawer } from "@/components/public/CartDrawer";
import {
  getProductById,
  getRelatedProducts,
  getSiteSettings,
  getNavigationItems,
  getSocialLinks,
} from "@/lib/queries";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const [product, settings] = await Promise.all([
    getProductById(id),
    getSiteSettings(),
  ]);

  if (!product) {
    return {
      title: `Product Not Found | ${settings.business_name || "RC Gadgets"}`,
    };
  }

  return {
    title: `${product.title} | ${settings.business_name || "RC Gadgets"}`,
    description:
      product.description ||
      `Buy ${product.title} at ${settings.business_name || "RC Gadgets"} Kottakkal. Premium hobby grade RC models.`,
    openGraph: {
      title: `${product.title} | RC Gadgets`,
      description: product.description || undefined,
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;

  const [product, settings, navigation, socialLinks] = await Promise.all([
    getProductById(id),
    getSiteSettings(),
    getNavigationItems(),
    getSocialLinks(),
  ]);

  if (!product) {
    return (
      <StoreProvider>
        <main className="min-h-screen bg-[#F8F9FB] text-[#111111] pt-24 pb-16 flex flex-col justify-between">
          <Header settings={settings} navigation={navigation} />
          <div className="max-w-md mx-auto px-4 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF5A00] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-black text-gray-900 uppercase">
              Product Not Found
            </h1>
            <p className="text-xs text-gray-500">
              The product you are looking for does not exist or may have been
              removed from our catalog.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF5A00] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#FF6A00] transition-colors shadow-md shadow-[#FF5A00]/25"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explore Shop Catalog</span>
            </Link>
          </div>
          <StoreFooter settings={settings} socialLinks={socialLinks} />
          <CartDrawer />
        </main>
      </StoreProvider>
    );
  }

  const relatedProducts = await getRelatedProducts(
    product.id,
    product.category_name,
    4
  );

  return (
    <StoreProvider>
      <main className="min-h-screen bg-white text-[#111111] selection:bg-[#FF5A00] selection:text-white relative pt-16 sm:pt-20">
        {/* Header */}
        <Header settings={settings} navigation={navigation} />

        {/* Product Details Section */}
        <ProductDetailsView
          product={product}
          relatedProducts={relatedProducts}
          settings={settings}
        />

        {/* Value Trust Bar */}
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
