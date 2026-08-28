"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Product, Category, SiteSettings } from "@/types/database";
import { useStore } from "@/components/context/StoreContext";
import {
  Search,
  Heart,
  ShoppingCart,
  Check,
  X,
  ArrowUpDown,
  Filter,
} from "lucide-react";

interface ShopCatalogProps {
  initialProducts: Product[];
  categories: Category[];
  settings: SiteSettings;
}

function ShopCatalogContent({
  initialProducts,
  categories,
}: ShopCatalogProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const urlCategory = searchParams.get("category") || "ALL";
  const urlSearch = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [searchQuery, setSearchQuery] = useState<string>(urlSearch);
  const [selectedBrand, setSelectedBrand] = useState<string>("ALL");
  const [priceRange, setPriceRange] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onlySpecial, setOnlySpecial] = useState<
    "ALL" | "BESTSELLER" | "NEW" | "TOP_RATED"
  >("ALL");
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    }
    const q = searchParams.get("q");
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const uniqueBrands = useMemo(() => {
    const brands = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.brand_name && p.brand_name.trim().length > 0) {
        brands.add(p.brand_name.trim());
      }
    });
    return Array.from(brands).sort();
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        if (selectedCategory !== "ALL") {
          const catA = product.category_name
            .toLowerCase()
            .replace(/[\s\-_]/g, "");
          const catB = selectedCategory
            .toLowerCase()
            .replace(/[\s\-_]/g, "");
          if (!catA.includes(catB) && !catB.includes(catA)) {
            return false;
          }
        }

        if (selectedBrand !== "ALL") {
          if (
            !product.brand_name ||
            product.brand_name.toLowerCase() !== selectedBrand.toLowerCase()
          ) {
            return false;
          }
        }

        if (inStockOnly && (product.stock_quantity ?? 0) <= 0) {
          return false;
        }

        if (onlySpecial === "BESTSELLER" && !product.is_bestseller) return false;
        if (onlySpecial === "NEW" && !product.is_new_arrival) return false;
        if (onlySpecial === "TOP_RATED" && !product.is_top_rated) return false;

        if (priceRange === "under-10k" && product.price >= 10000) return false;
        if (
          priceRange === "10k-30k" &&
          (product.price < 10000 || product.price > 30000)
        )
          return false;
        if (
          priceRange === "30k-60k" &&
          (product.price < 30000 || product.price > 60000)
        )
          return false;
        if (priceRange === "above-60k" && product.price <= 60000) return false;

        if (searchQuery.trim().length > 0) {
          const query = searchQuery.toLowerCase().trim();
          const matchTitle = product.title.toLowerCase().includes(query);
          const matchBrand = (product.brand_name || "")
            .toLowerCase()
            .includes(query);
          const matchCategory = product.category_name
            .toLowerCase()
            .includes(query);
          const matchDesc = (product.description || "")
            .toLowerCase()
            .includes(query);
          if (!matchTitle && !matchBrand && !matchCategory && !matchDesc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "newest") {
          return (b.is_new_arrival ? 1 : 0) - (a.is_new_arrival ? 1 : 0);
        }
        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      });
  }, [
    initialProducts,
    selectedCategory,
    selectedBrand,
    inStockOnly,
    onlySpecial,
    priceRange,
    searchQuery,
    sortBy,
  ]);

  const handleCategorySelect = (catName: string) => {
    setSelectedCategory(catName);
    if (catName === "ALL") {
      router.push("/shop");
    } else {
      router.push(`/shop?category=${encodeURIComponent(catName)}`);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory("ALL");
    setSearchQuery("");
    setSelectedBrand("ALL");
    setPriceRange("ALL");
    setSortBy("featured");
    setInStockOnly(false);
    setOnlySpecial("ALL");
    router.push("/shop");
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product as any);
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: initialProducts.length };
    categories.forEach((cat) => {
      const match = initialProducts.filter((p) => {
        const catA = p.category_name.toLowerCase().replace(/[\s\-_]/g, "");
        const catB = cat.name.toLowerCase().replace(/[\s\-_]/g, "");
        return catA.includes(catB) || catB.includes(catA);
      });
      counts[cat.name] = match.length;
    });
    return counts;
  }, [initialProducts, categories]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-sans">
      {/* 1. Breadcrumbs & Header Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Shop</span>
          {selectedCategory !== "ALL" && (
            <>
              <span>/</span>
              <span className="text-black font-semibold">
                {selectedCategory}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900">
              {selectedCategory === "ALL"
                ? "All Models"
                : selectedCategory}
              <span className="text-gray-400 font-normal text-lg sm:text-2xl ml-2.5">
                ({filteredProducts.length})
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold text-gray-900 bg-transparent border-none outline-none cursor-pointer pr-2"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-4 py-1.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-900 hover:border-black transition-colors flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Minimalist Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleCategorySelect("ALL")}
          className={`px-4 py-2 rounded-full text-xs font-semibold tracking-tight whitespace-nowrap transition-all cursor-pointer shrink-0 ${
            selectedCategory === "ALL"
              ? "bg-black text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:border-gray-900 hover:bg-gray-50"
          }`}
        >
          All ({categoryCounts["ALL"] || 0})
        </button>

        {categories.map((cat) => {
          const isSelected =
            selectedCategory.toLowerCase() === cat.name.toLowerCase();
          const count = categoryCounts[cat.name] || 0;
          return (
            <button
              key={cat.id || cat.name}
              onClick={() => handleCategorySelect(cat.name)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-tight whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isSelected
                  ? "bg-black text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-gray-900 hover:bg-gray-50"
              }`}
            >
              <span>{cat.name}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] ml-1.5 opacity-70`}
                >
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Catalog Body: Left Minimal Filter Sidebar + Right Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filters (Desktop Sidebar / Mobile Drawer) */}
        <div
          className={`${
            isMobileFilterOpen
              ? "fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end lg:static lg:bg-transparent lg:z-auto"
              : "hidden lg:block lg:col-span-3"
          }`}
        >
          <div
            className={`w-full max-w-xs bg-white lg:bg-transparent p-6 lg:p-0 space-y-6 h-full lg:h-auto overflow-y-auto ${
              isMobileFilterOpen ? "animate-in slide-in-from-right" : ""
            }`}
          >
            {/* Mobile Close Header */}
            <div className="flex items-center justify-between lg:hidden border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900">
                Filters
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-900 block">
                Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Model name, brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:border-black focus:bg-white text-gray-900 text-xs outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Highlights Filter (Pure Clean Text Pills) */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-900 block">
                Collection
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: "ALL", label: "All Items" },
                  { key: "BESTSELLER", label: "Best Sellers" },
                  { key: "NEW", label: "New Arrivals" },
                  { key: "TOP_RATED", label: "Top Rated" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setOnlySpecial(item.key as any)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      onlySpecial === item.key
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-900 block">
                Price
              </label>
              <div className="space-y-1.5">
                {[
                  { id: "ALL", label: "All Prices" },
                  { id: "under-10k", label: "Under ₹10,000" },
                  { id: "10k-30k", label: "₹10,000 – ₹30,000" },
                  { id: "30k-60k", label: "₹30,000 – ₹60,000" },
                  { id: "above-60k", label: "Above ₹60,000" },
                ].map((p) => (
                  <label
                    key={p.id}
                    className="flex items-center gap-2.5 text-xs text-gray-700 font-medium cursor-pointer hover:text-black py-0.5"
                  >
                    <input
                      type="radio"
                      name="price-filter"
                      checked={priceRange === p.id}
                      onChange={() => setPriceRange(p.id)}
                      className="text-black accent-black"
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            {uniqueBrands.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-900 block">
                  Brand
                </label>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <label className="flex items-center gap-2.5 text-xs text-gray-700 font-medium cursor-pointer hover:text-black py-0.5">
                    <input
                      type="radio"
                      name="brand-filter"
                      checked={selectedBrand === "ALL"}
                      onChange={() => setSelectedBrand("ALL")}
                      className="text-black accent-black"
                    />
                    <span>All Brands</span>
                  </label>
                  {uniqueBrands.map((b) => (
                    <label
                      key={b}
                      className="flex items-center gap-2.5 text-xs text-gray-700 font-medium cursor-pointer hover:text-black py-0.5"
                    >
                      <input
                        type="radio"
                        name="brand-filter"
                        checked={selectedBrand === b}
                        onChange={() => setSelectedBrand(b)}
                        className="text-black accent-black"
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* In Stock Only Toggle */}
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-gray-900">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 text-black accent-black rounded"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Reset Filters Link */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-gray-500 hover:text-black underline transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Right Products Catalog Grid (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4">
              <p className="text-base font-bold text-gray-900">
                No matching products found
              </p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try selecting a different category or clearing active filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-semibold tracking-tight hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => {
                const isWish = isInWishlist(product.id);
                const isAdded = addedIds.includes(product.id);
                const hasImg = Boolean(product.image_url);
                const discount =
                  product.original_price && product.original_price > product.price
                    ? Math.round(
                        ((product.original_price - product.price) /
                          product.original_price) *
                          100
                      )
                    : null;

                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col justify-between bg-white border border-gray-200/90 hover:border-gray-300 transition-all duration-300 p-3 sm:p-4 shadow-xs hover:shadow-sm"
                  >
                    <div>
                      {/* Photo Box (Clean Unified White Canvas) */}
                      <div className="relative w-full aspect-square bg-white flex items-center justify-center p-2 mb-3 overflow-hidden">
                        {/* Minimal Badge — Z-INDEX 20 so it never gets covered */}
                        {product.badge ? (
                          <span className="absolute top-2 left-2 z-20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-black text-white shadow-xs pointer-events-none">
                            {product.badge}
                          </span>
                        ) : discount ? (
                          <span className="absolute top-2 left-2 z-20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-xs pointer-events-none">
                            {discount}% OFF
                          </span>
                        ) : null}

                        {/* Minimal Wishlist Heart — Z-INDEX 20 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product as any);
                          }}
                          className={`absolute top-2 right-2 z-20 p-2 rounded-full bg-white/90 shadow-xs hover:bg-white transition-all cursor-pointer ${
                            isWish
                              ? "text-rose-500"
                              : "text-gray-400 hover:text-black"
                          }`}
                          title={
                            isWish
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isWish ? "fill-rose-500" : ""
                            }`}
                          />
                        </button>

                        {/* Image Link */}
                        <Link
                          href={`/products/${product.id}`}
                          className="relative w-full h-full block z-10"
                        >
                          {hasImg ? (
                            <Image
                              src={product.image_url!}
                              alt={product.title}
                              fill
                              sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 360px"
                              className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs font-medium">
                              RC Model
                            </div>
                          )}
                        </Link>
                      </div>

                      {/* Brand & Category */}
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                        <span className="text-[#FF5A00]">
                          {product.brand_name || "RC GADGETS"}
                        </span>
                        <span className="text-gray-400">
                          {product.category_name}
                        </span>
                      </div>

                      {/* Title */}
                      <Link href={`/products/${product.id}`} className="block mb-2">
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#FF5A00] transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                    </div>

                    {/* Bottom Row: Price & Minimal Add to Bag */}
                    <div className="pt-2.5 flex items-end justify-between gap-2 border-t border-gray-100 mt-2">
                      <div>
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-sm sm:text-base font-extrabold text-gray-900">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </span>
                          {product.original_price && (
                            <span className="text-[11px] text-gray-400 line-through">
                              ₹
                              {Number(product.original_price).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          )}
                        </div>
                        {product.rating && (
                          <span className="text-[10px] text-gray-500 font-semibold block mt-0.5">
                            ★ {product.rating} ({product.reviews_count || 24})
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0 ${
                          isAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-black hover:bg-[#FF5A00] text-white active:scale-95"
                        }`}
                      >
                        {isAdded ? "Added" : "Add to Bag"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ShopCatalog(props: ShopCatalogProps) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400 text-xs font-semibold">
          Loading Catalog...
        </div>
      }
    >
      <ShopCatalogContent {...props} />
    </Suspense>
  );
}
