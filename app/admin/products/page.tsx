"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { createClient } from "@/lib/supabase/client";
import { Product, Category } from "@/types/database";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  Package,
  X,
  Eye,
  EyeOff,
  Upload,
  Search,
  Star,
  Tag,
  Flame,
  Sparkles,
  TrendingUp,
  Award,
} from "lucide-react";

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "p-1",
    title: "Traxxas X-Maxx 8S 4WD Brushless Monster Truck",
    category_name: "RC Cars",
    brand_name: "Traxxas",
    price: 79999,
    original_price: 89999,
    rating: 4.9,
    reviews_count: 128,
    badge: "HOT",
    image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045166/rc-gadgets/assets/cat-car.webp",
    description: "Unstoppable 8S power, mammoth size, and award-winning durability.",
    stock_quantity: 5,
    is_bestseller: true,
    is_new_arrival: false,
    is_top_rated: true,
    is_active: true,
    sort_order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: "p-2",
    title: "DJI Mini 4 Pro Drone with RC-N2 Controller",
    category_name: "RC Drones",
    brand_name: "DJI",
    price: 84990,
    original_price: 92000,
    rating: 4.9,
    reviews_count: 96,
    badge: "NEW",
    image_url: null,
    description: "Omnidirectional obstacle sensing, 4K/60fps HDR video, and 34-min flight time.",
    stock_quantity: 8,
    is_bestseller: true,
    is_new_arrival: true,
    is_top_rated: true,
    is_active: true,
    sort_order: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: "p-3",
    title: "FMS 1400mm P-51D Mustang V8 RC Plane",
    category_name: "RC Planes",
    brand_name: "FMS",
    price: 32999,
    original_price: 38000,
    rating: 4.8,
    reviews_count: 74,
    badge: "POPULAR",
    image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045169/rc-gadgets/assets/cat-plane.webp",
    description: "Scale detail, functional flaps, retractable landing gear, and high-speed brushless power.",
    stock_quantity: 4,
    is_bestseller: true,
    is_new_arrival: false,
    is_top_rated: true,
    is_active: true,
    sort_order: 3,
    created_at: "",
    updated_at: "",
  },
  {
    id: "p-4",
    title: "Traxxas Rustler 4x4 VXL Brushless RC Car",
    category_name: "RC Cars",
    brand_name: "Traxxas",
    price: 29999,
    original_price: 34500,
    rating: 4.8,
    reviews_count: 89,
    badge: "SALE",
    image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045166/rc-gadgets/assets/cat-car.webp",
    description: "65+ mph stadium truck performance with Velineon brushless power.",
    stock_quantity: 12,
    is_bestseller: true,
    is_new_arrival: false,
    is_top_rated: false,
    is_active: true,
    sort_order: 4,
    created_at: "",
    updated_at: "",
  },
  {
    id: "p-5",
    title: "Volantex RC Vector SR80 Brushless RC Boat",
    category_name: "RC Boats",
    brand_name: "Volantex",
    price: 23999,
    original_price: 27999,
    rating: 4.9,
    reviews_count: 64,
    badge: "HOT",
    image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045170/rc-gadgets/assets/cat-ship.webp",
    description: "Auto-roll back function, water-cooled brushless motor hitting speeds over 70 km/h.",
    stock_quantity: 6,
    is_bestseller: true,
    is_new_arrival: false,
    is_top_rated: true,
    is_active: true,
    sort_order: 5,
    created_at: "",
    updated_at: "",
  },
  {
    id: "p-6",
    title: "FlySky FS-GT5 6CH Transmitter & Receiver",
    category_name: "Accessories",
    brand_name: "FlySky",
    price: 6499,
    original_price: 7999,
    rating: 4.8,
    reviews_count: 112,
    badge: "BEST",
    image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045168/rc-gadgets/assets/cat-gadget.webp",
    description: "6-channel ultra-fast AFHDS 2A protocol with built-in gyro receiver (FS-BS6).",
    stock_quantity: 20,
    is_bestseller: true,
    is_new_arrival: false,
    is_top_rated: true,
    is_active: true,
    sort_order: 6,
    created_at: "",
    updated_at: "",
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedFilter, setSelectedFilter] = useState<
    "ALL" | "BESTSELLER" | "NEW" | "TOP_RATED" | "HIDDEN"
  >("ALL");

  // Modal State for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Direct card upload state
  const [uploadingCardId, setUploadingCardId] = useState<string | null>(null);
  const cardFileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>(
    {}
  );

  // Delete Confirm Dialog
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .order("sort_order", { ascending: true }),
        supabase
          .from("categories")
          .select("*")
          .order("sort_order", { ascending: true }),
      ]);

      if (categoriesRes.data && categoriesRes.data.length > 0) {
        setCategories(categoriesRes.data as Category[]);
      }

      if (productsRes.data && productsRes.data.length > 0) {
        setProducts(productsRes.data as Product[]);
      } else {
        setProducts(FALLBACK_PRODUCTS);
      }
    } catch (err) {
      console.error("Error fetching admin products:", err);
      setProducts(FALLBACK_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct({
      title: "",
      category_name: categories[0]?.name || "RC Cars",
      brand_name: "RC GADGETS",
      price: 0,
      original_price: null,
      rating: 5.0,
      reviews_count: 0,
      badge: "NEW",
      image_url: null,
      description: "",
      stock_quantity: 10,
      is_bestseller: false,
      is_new_arrival: true,
      is_top_rated: false,
      is_active: true,
      sort_order: (products.length + 1) * 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  const extractErrorMessage = (err: any): string => {
    if (!err) return "Unknown error occurred";
    console.error("Supabase Operation Error Details:", {
      message: err.message,
      details: err.details,
      hint: err.hint,
      code: err.code,
      raw: err,
    });

    const code = err.code || "";
    const message = err.message || "";
    const details = err.details || "";

    if (code === "42501" || message.toLowerCase().includes("row-level security") || message.toLowerCase().includes("permission denied")) {
      return "Permission denied by Supabase Row-Level Security (RLS). Please run 'ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;' in your Supabase SQL Editor.";
    }

    if (code === "42P01" || message.toLowerCase().includes("does not exist")) {
      return "Database table 'products' does not exist in Supabase. Please execute the script in 'supabase/create_products_table.sql' in your Supabase SQL Editor.";
    }

    if (message) return `${message}${details ? ` (${details})` : ""}`;
    if (typeof err === "string") return err;
    if (err.error_description) return err.error_description;
    
    try {
      const str = JSON.stringify(err);
      if (str && str !== "{}") return str;
    } catch {}

    return "Database operation failed. Please check that table 'products' exists and RLS is disabled in Supabase.";
  };

  // Direct 1-Click Image Upload for a Product Card
  const handleDirectCardUpload = async (product: Product, file: File) => {
    if (!file || !product.id) return;
    setUploadingCardId(product.id);
    setStatusMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok || !result.url) {
        throw new Error(result.error || "Image upload failed");
      }

      const newImageUrl = result.url;

      // Update Supabase DB directly if it's a UUID
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          product.id
        );

      if (isUuid) {
        const { error: dbError } = await (supabase.from("products") as any)
          .update({
            image_url: newImageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", product.id);

        if (dbError) throw dbError;
      }

      // Update local state immediately
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, image_url: newImageUrl } : p
        )
      );

      setStatusMsg({
        type: "success",
        text: `Photo updated successfully for '${product.title}'!`,
      });
    } catch (err: any) {
      console.error("Direct upload error:", err);
      const msg = extractErrorMessage(err);
      setStatusMsg({
        type: "error",
        text: msg,
      });
    } finally {
      setUploadingCardId(null);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.title) return;

    setIsSaving(true);
    setStatusMsg(null);

    try {
      const payload: any = {
        title: editingProduct.title.trim(),
        category_name: editingProduct.category_name || "RC Cars",
        brand_name: editingProduct.brand_name || "RC GADGETS",
        price: Number(editingProduct.price) || 0,
        original_price: editingProduct.original_price
          ? Number(editingProduct.original_price)
          : null,
        rating: Number(editingProduct.rating) || 5.0,
        reviews_count: Number(editingProduct.reviews_count) || 0,
        badge: editingProduct.badge || null,
        image_url: editingProduct.image_url || null,
        description: editingProduct.description || "",
        stock_quantity: Number(editingProduct.stock_quantity) || 10,
        is_bestseller: Boolean(editingProduct.is_bestseller),
        is_new_arrival: Boolean(editingProduct.is_new_arrival),
        is_top_rated: Boolean(editingProduct.is_top_rated),
        is_active: editingProduct.is_active ?? true,
        sort_order: Number(editingProduct.sort_order) || 1,
        updated_at: new Date().toISOString(),
      };

      const isUuid =
        editingProduct.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          editingProduct.id
        );

      let savedSuccessfullyToDb = false;

      if (editingProduct.id && isUuid) {
        payload.id = editingProduct.id;
        const { error } = await (supabase.from("products") as any)
          .upsert(payload)
          .select();

        if (error) {
          console.warn("Supabase products upsert notice:", error);
          throw error;
        }
        savedSuccessfullyToDb = true;
      } else {
        const { data, error } = await (supabase.from("products") as any)
          .insert(payload)
          .select()
          .single();

        if (error) {
          console.warn("Supabase products insert notice:", error);
          throw error;
        }
        if (data?.id) {
          payload.id = data.id;
        }
        savedSuccessfullyToDb = true;
      }

      // Update state
      if (editingProduct.id) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id ? ({ ...p, ...payload } as Product) : p
          )
        );
      } else {
        const newProductItem: Product = {
          ...payload,
          id: payload.id || `p-${Date.now()}`,
          created_at: new Date().toISOString(),
        };
        setProducts((prev) => [newProductItem, ...prev]);
      }

      setStatusMsg({
        type: "success",
        text: `Product '${editingProduct.title}' saved successfully${savedSuccessfullyToDb ? " to Supabase database!" : "!"}`,
      });
      setIsModalOpen(false);
    } catch (err: any) {
      console.warn("Notice while saving to database:", err);
      const msg = extractErrorMessage(err);

      // Even if remote DB failed, update local UI so user work is preserved
      if (editingProduct.id) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id ? ({ ...p, ...editingProduct } as Product) : p
          )
        );
      } else {
        const localNewProduct: Product = {
          id: `p-${Date.now()}`,
          title: editingProduct.title || "New Product",
          category_name: editingProduct.category_name || "RC Cars",
          brand_name: editingProduct.brand_name || "RC GADGETS",
          price: Number(editingProduct.price) || 0,
          original_price: editingProduct.original_price ? Number(editingProduct.original_price) : null,
          rating: Number(editingProduct.rating) || 5.0,
          reviews_count: Number(editingProduct.reviews_count) || 0,
          badge: editingProduct.badge || null,
          image_url: editingProduct.image_url || null,
          description: editingProduct.description || "",
          stock_quantity: Number(editingProduct.stock_quantity) || 10,
          is_bestseller: Boolean(editingProduct.is_bestseller),
          is_new_arrival: Boolean(editingProduct.is_new_arrival),
          is_top_rated: Boolean(editingProduct.is_top_rated),
          is_active: editingProduct.is_active ?? true,
          sort_order: Number(editingProduct.sort_order) || 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProducts((prev) => [localNewProduct, ...prev]);
      }

      setStatusMsg({
        type: "error",
        text: msg,
      });
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };



  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          deleteTarget.id
        );

      if (isUuid) {
        const { error } = await (supabase.from("products") as any)
          .delete()
          .eq("id", deleteTarget.id);

        if (error) throw error;
      }

      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setStatusMsg({
        type: "success",
        text: `Product '${deleteTarget.title}' removed successfully.`,
      });
    } catch (err: any) {
      const msg = extractErrorMessage(err);
      setStatusMsg({
        type: "error",
        text: msg || "Failed to delete product",
      });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };


  const handleToggleActive = async (product: Product) => {
    const updated = !product.is_active;
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, is_active: updated } : p))
    );

    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        product.id
      );

    if (isUuid) {
      try {
        await (supabase.from("products") as any)
          .update({ is_active: updated, updated_at: new Date().toISOString() })
          .eq("id", product.id);
      } catch (err) {
        console.error("Error toggling product active status:", err);
      }
    }
  };

  // Filter & Search Logic
  const filteredProducts = products.filter((item) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchBrand = (item.brand_name || "").toLowerCase().includes(q);
      const matchCategory = item.category_name.toLowerCase().includes(q);
      if (!matchTitle && !matchBrand && !matchCategory) return false;
    }

    // Category filter
    if (
      selectedCategory !== "ALL" &&
      item.category_name.toLowerCase() !== selectedCategory.toLowerCase()
    ) {
      return false;
    }

    // Status / Badges filter
    if (selectedFilter === "BESTSELLER" && !item.is_bestseller) return false;
    if (selectedFilter === "NEW" && !item.is_new_arrival) return false;
    if (selectedFilter === "TOP_RATED" && !item.is_top_rated) return false;
    if (selectedFilter === "HIDDEN" && item.is_active) return false;

    return true;
  });

  // Calculate discount percentage helper
  const calcDiscount = (price: number, original?: number | null) => {
    if (!original || original <= price) return null;
    return Math.round(((original - price) / original) * 100);
  };

  const uniqueCategories = Array.from(
    new Set([
      "RC Cars",
      "RC Planes",
      "RC Boats",
      "RC Drones",
      "RC Bikes",
      "RC Parts",
      "Batteries",
      "Accessories",
      ...categories.map((c) => c.name),
      ...products.map((p) => p.category_name),
    ])
  ).filter(Boolean);

  return (
    <div className="space-y-8 bg-black text-white">
      <AdminHeader
        title="Products Catalog & Inventory"
        subtitle="Add, edit, upload product photos, configure pricing, badges, stock, and manage live storefront listings"
      />

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center gap-2.5 ${
            statusMsg.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}
        >
          {statusMsg.type === "success" ? (
            <Check className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0E0E0E] border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
              Total Products
            </span>
            <span className="text-xl sm:text-2xl font-black text-white">
              {products.length}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[#FF5A00]">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E0E0E] border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
              Best Sellers
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-400">
              {products.filter((p) => p.is_bestseller).length}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E0E0E] border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
              New Arrivals
            </span>
            <span className="text-xl sm:text-2xl font-black text-blue-400">
              {products.filter((p) => p.is_new_arrival).length}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E0E0E] border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
              Active Listed
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400">
              {products.filter((p) => p.is_active).length}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-400">
            <Eye className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Action Bar: Search, Category Filters, Add Button */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, brand, category..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0E0E0E] border border-zinc-800 focus:border-[#FF5A00] text-xs font-semibold text-white outline-none placeholder:text-zinc-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Add Product CTA Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAdd}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-[#FF6A00] shadow-lg shadow-[#FF5A00]/25 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-800/80">
          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mr-1">
            Status:
          </span>
          {(
            [
              { id: "ALL", label: "All Items" },
              { id: "BESTSELLER", label: "Best Sellers" },
              { id: "NEW", label: "New Arrivals" },
              { id: "TOP_RATED", label: "Top Rated" },
              { id: "HIDDEN", label: "Hidden / Inactive" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                selectedFilter === tab.id
                  ? "bg-[#FF5A00] text-white shadow-xs"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 outline-none focus:border-[#FF5A00]"
            >
              <option value="ALL">All Categories ({products.length})</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="p-16 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#FF5A00] animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#0E0E0E] border border-zinc-800 space-y-3">
          <Package className="w-10 h-10 text-zinc-600 mx-auto" />
          <h4 className="text-sm font-bold text-white uppercase">
            No products match your search or filter
          </h4>
          <p className="text-xs text-zinc-400">
            Try adjusting your search criteria or add a new product.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#FF5A00] text-white"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product, idx) => {
            const isThisCardUploading = uploadingCardId === product.id;
            const discount = calcDiscount(product.price, product.original_price);

            return (
              <div
                key={product.id || idx}
                className={`group rounded-3xl bg-[#0E0E0E] border ${
                  product.is_active ? "border-zinc-800" : "border-zinc-800/40 opacity-60"
                } p-5 flex flex-col justify-between space-y-4 hover:border-[#FF5A00]/50 transition-all shadow-xl relative overflow-hidden`}
              >
                <div>
                  {/* Photo Thumbnail with Direct 1-Click Upload Overlay */}
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-[#050505] border border-zinc-800/80 mb-3 flex items-center justify-center p-3 group/img">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        sizes="250px"
                        className="object-contain p-2 transition-transform duration-300 group-hover/img:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-1.5 select-none">
                        <Package className="w-8 h-8 text-[#FF5A00]" />
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                          No Photo Uploaded
                        </span>
                      </div>
                    )}

                    {/* Badge Pill Top-Left */}
                    {product.badge && (
                      <div className="absolute top-2.5 left-2.5 bg-[#FF5A00] text-white px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shadow-md">
                        {product.badge}
                      </div>
                    )}

                    {/* Active/Hidden Status Top-Right */}
                    <div
                      className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                        product.is_active
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                      }`}
                    >
                      {product.is_active ? "Active" : "Hidden"}
                    </div>

                    {/* Loading State Overlay */}
                    {isThisCardUploading && (
                      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-[#FF5A00] z-20">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                          Uploading &amp; Saving...
                        </span>
                      </div>
                    )}

                    {/* Hover 1-Click Upload Overlay */}
                    {!isThisCardUploading && (
                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3 z-10">
                        <button
                          type="button"
                          onClick={() =>
                            cardFileInputRefs.current[product.id]?.click()
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-[#FF5A00] hover:bg-[#FF6A00] text-white text-[11px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Change Photo</span>
                        </button>
                        <span className="text-[9px] text-zinc-400">
                          PNG, WebP, JPG
                        </span>
                      </div>
                    )}

                    {/* Hidden Direct File Input */}
                    <input
                      type="file"
                      accept="image/png,image/webp,image/jpeg,image/jpg"
                      ref={(el) => {
                        cardFileInputRefs.current[product.id] = el;
                      }}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleDirectCardUpload(product, file);
                          e.target.value = "";
                        }
                      }}
                    />
                  </div>

                  {/* Brand & Category */}
                  <div className="flex items-center justify-between gap-2 text-[10px] font-black uppercase tracking-wider mb-1">
                    <span className="text-[#FF5A00]">
                      {product.brand_name || "RC GADGETS"}
                    </span>
                    <span className="text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      {product.category_name}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                    {product.title}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {product.is_bestseller && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5" /> Best Seller
                      </span>
                    )}
                    {product.is_new_arrival && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> New Arrival
                      </span>
                    )}
                    {product.is_top_rated && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                        <Award className="w-2.5 h-2.5" /> Top Rated
                      </span>
                    )}
                  </div>

                  {/* Price & Rating */}
                  <div className="flex items-end justify-between gap-2 mt-3 pt-3 border-t border-zinc-800/80">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-black text-white">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </span>
                        {product.original_price && (
                          <span className="text-xs text-zinc-500 line-through">
                            ₹{Number(product.original_price).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                      {discount && (
                        <span className="text-[10px] font-bold text-emerald-400">
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-[10px] text-zinc-500 font-normal">
                        ({product.reviews_count})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(product)}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                      product.is_active
                        ? "text-zinc-400 hover:text-white"
                        : "text-emerald-400 hover:text-emerald-300"
                    }`}
                    title={
                      product.is_active
                        ? "Hide product from store"
                        : "Make visible in store"
                    }
                  >
                    {product.is_active ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[11px]">
                      {product.is_active ? "Hide" : "Show"}
                    </span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(product)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#FF5A00]/20 hover:bg-[#FF5A00] text-[#FF5A00] hover:text-white transition-all text-xs font-bold uppercase flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(product)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#121212] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FF5A00]/20 border border-[#FF5A00]/40 text-[#FF5A00] flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black uppercase text-white tracking-wide">
                  {editingProduct.id
                    ? `Edit Product: ${editingProduct.title || ""}`
                    : "Add New Product"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Product Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                  <span>
                    Product Title <span className="text-[#FF5A00]">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Traxxas X-Maxx 8S 4WD Monster Truck"
                  value={editingProduct.title || ""}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-zinc-800 focus:border-[#FF5A00] text-white text-xs outline-none font-semibold"
                />
              </div>

              {/* Category & Brand row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Category <span className="text-[#FF5A00]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    list="category-options"
                    placeholder="e.g. RC Cars"
                    value={editingProduct.category_name || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-zinc-800 focus:border-[#FF5A00] text-white text-xs outline-none font-semibold"
                  />
                  <datalist id="category-options">
                    {uniqueCategories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Traxxas, DJI, FMS, RC GADGETS"
                    value={editingProduct.brand_name || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        brand_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-zinc-800 focus:border-[#FF5A00] text-white text-xs outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Pricing & Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Selling Price (₹) <span className="text-[#FF5A00]">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="79999"
                    value={editingProduct.price ?? ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-zinc-800 focus:border-[#FF5A00] text-white text-xs outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    MRP / Original (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="89999"
                    value={editingProduct.original_price ?? ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        original_price: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-zinc-800 focus:border-[#FF5A00] text-white text-xs outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    placeholder="HOT, NEW, SALE, etc."
                    value={editingProduct.badge || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        badge: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-zinc-800 focus:border-[#FF5A00] text-white text-xs outline-none font-bold"
                  />
                </div>
              </div>

              {/* Quick Badge Selection helper pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-zinc-500 font-bold uppercase">
                  Quick Badges:
                </span>
                {["HOT", "NEW", "SALE", "POPULAR", "BEST", "20% OFF"].map(
                  (b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() =>
                        setEditingProduct({ ...editingProduct, badge: b })
                      }
                      className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-[#FF5A00] hover:text-white text-zinc-400 text-[10px] font-black uppercase border border-zinc-800 transition-colors"
                    >
                      {b}
                    </button>
                  )
                )}
                {editingProduct.badge && (
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProduct({ ...editingProduct, badge: null })
                    }
                    className="px-2 py-0.5 rounded bg-zinc-900 text-rose-400 text-[10px] font-bold uppercase border border-zinc-800"
                  >
                    Clear Badge
                  </button>
                )}
              </div>

              {/* Product Photo Upload */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <ImageUploader
                  label="Product Photo (Cloudinary CDN Upload)"
                  bucket="products"
                  folder="products"
                  currentUrl={editingProduct.image_url}
                  onUploadingStateChange={(loading) =>
                    setIsImageUploading(loading)
                  }
                  onUploadSuccess={(url) =>
                    setEditingProduct((prev) =>
                      prev ? { ...prev, image_url: url } : null
                    )
                  }
                  onRemove={() =>
                    setEditingProduct((prev) =>
                      prev ? { ...prev, image_url: null } : null
                    )
                  }
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Product Description / Specifications
                </label>
                <textarea
                  rows={2}
                  placeholder="Key features, brushless specs, battery capacity, remote range..."
                  value={editingProduct.description || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-zinc-800 focus:border-[#FF5A00] text-white text-xs outline-none resize-none"
                />
              </div>

              {/* Stock, Rating, Sort Order */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.stock_quantity ?? 10}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock_quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-zinc-800 focus:border-[#FF5A00] text-white text-xs outline-none font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Rating (0-5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={editingProduct.rating ?? 5.0}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        rating: parseFloat(e.target.value) || 5.0,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-zinc-800 focus:border-[#FF5A00] text-white text-xs outline-none font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingProduct.sort_order ?? 1}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        sort_order: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-zinc-800 focus:border-[#FF5A00] text-white text-xs outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Status Flags Checkboxes */}
              <div className="p-4 rounded-2xl bg-[#161616] border border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_active ?? true}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        is_active: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#FF5A00] accent-[#FF5A00] rounded"
                  />
                  <span className="text-[11px] font-bold uppercase text-white">
                    Live Visible
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_bestseller ?? false}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        is_bestseller: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#FF5A00] accent-[#FF5A00] rounded"
                  />
                  <span className="text-[11px] font-bold uppercase text-amber-400">
                    Best Seller
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_new_arrival ?? false}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        is_new_arrival: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#FF5A00] accent-[#FF5A00] rounded"
                  />
                  <span className="text-[11px] font-bold uppercase text-blue-400">
                    New Arrival
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_top_rated ?? false}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        is_top_rated: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#FF5A00] accent-[#FF5A00] rounded"
                  />
                  <span className="text-[11px] font-bold uppercase text-purple-400">
                    Top Rated
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isImageUploading}
                  className="px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-[#FF6A00] shadow-lg shadow-[#FF5A00]/30 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Product...</span>
                    </>
                  ) : isImageUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading Image...</span>
                    </>
                  ) : (
                    <span>Save Product</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Product"
        message={`Are you sure you want to delete product "${deleteTarget?.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
