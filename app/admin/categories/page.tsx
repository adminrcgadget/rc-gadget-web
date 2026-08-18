"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { createClient } from "@/lib/supabase/client";
import { Category } from "@/types/database";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  Layers,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Confirm Dialog
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (data && data.length > 0) {
        setCategories(data as Category[]);
      } else {
        // Fallback default list for initial setup
        setCategories([
          {
            id: "cat-1",
            name: "RC Cars",
            short_description: "High-speed brushless buggies, extreme rock crawlers, precision drift machines & 4WD scale racers.",
            icon_url: null,
            image_url: "/logo/WhatsApp Image 2026-08-17 at 6.53.55 PM (1).jpeg",
            sort_order: 1,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "cat-2",
            name: "RC Planes",
            short_description: "Aerobatic aircraft, scale turbine jets, warbirds & ultra-stable high-altitude precision flyers.",
            icon_url: null,
            image_url: "/logo/WhatsApp Image 2026-08-17 at 6.53.55 PM (1).jpeg",
            sort_order: 2,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "cat-3",
            name: "RC Ships",
            short_description: "High-velocity brushless speedboats, twin-hull hydroplanes & authentic scale battleships.",
            icon_url: null,
            image_url: "/logo/WhatsApp Image 2026-08-17 at 6.53.55 PM (1).jpeg",
            sort_order: 3,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "cat-4",
            name: "RC Excavators",
            short_description: "Heavy-duty full-metal hydraulic diggers, articulated dump trucks & construction giants.",
            icon_url: null,
            image_url: "/logo/WhatsApp Image 2026-08-17 at 6.53.55 PM (1).jpeg",
            sort_order: 4,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "cat-5",
            name: "RC Gadgets & Radios",
            short_description: "Pro-level multi-channel radio transmitters, telemetry systems, LiPo chargers, FPV gear & performance accessories.",
            icon_url: null,
            image_url: "/logo/WhatsApp Image 2026-08-17 at 6.53.55 PM (1).jpeg",
            sort_order: 5,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
        ]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCat({
      name: "",
      short_description: "",
      sort_order: (categories.length + 1) * 1,
      image_url: "",
      icon_url: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCat({ ...cat });
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat || !editingCat.name) return;

    setIsSaving(true);
    setStatusMsg(null);

    try {
      const payload: any = {
        ...editingCat,
        updated_at: new Date().toISOString(),
      };

      const isUuid = payload.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.id);
      if (!isUuid) {
        delete payload.id;
      }

      const { error } = await supabase
        .from("categories")
        .upsert(payload)
        .select();

      if (error) {
        throw error;
      }

      setStatusMsg({ type: "success", text: `Category '${editingCat.name}' saved successfully!` });
      await fetchCategories();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error saving category:", err);
      setStatusMsg({ type: "error", text: err.message || "Failed to save category" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", deleteTarget.id);

      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setStatusMsg({ type: "success", text: `Category '${deleteTarget.name}' deleted successfully.` });
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to delete category" });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleToggleActive = async (cat: Category) => {
    const updated = !cat.is_active;
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, is_active: updated } : c))
    );

    try {
      await (supabase.from("categories") as any)
        .update({ is_active: updated, updated_at: new Date().toISOString() })
        .eq("id", cat.id);
    } catch (err) {
      console.error("Error toggling active:", err);
    }
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        title="RC Categories Management"
        subtitle="Add, edit, reorder, and upload media for RC vehicle categories displayed on the public site"
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

      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
          <Layers className="w-4 h-4 text-[#FF5500]" />
          <span>{categories.length} Total Categories</span>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-[#FF5500] hover:bg-[#FF6A1A] shadow-lg shadow-[#FF5500]/25 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table / Card Grid */}
      {isLoading ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#FF5500] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={cat.id || idx}
              className={`rounded-3xl bg-[#0E0E0E] border ${
                cat.is_active ? "border-white/10" : "border-white/5 opacity-60"
              } p-6 flex flex-col justify-between space-y-4 hover:border-[#FF5500]/50 transition-all shadow-xl`}
            >
              <div>
                {/* Header Image Thumbnail & Sort Order */}
                <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-black/60 border border-white/10 mb-4">
                  {cat.image_url ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Layers className="w-8 h-8 text-[#FF5500]" />
                    </div>
                  )}

                  {/* Badges on preview */}
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-black text-zinc-300">
                    Order: #{cat.sort_order}
                  </div>

                  <div
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      cat.is_active
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {cat.is_active ? "Active" : "Hidden"}
                  </div>
                </div>

                <h3 className="text-lg font-black text-white uppercase tracking-wide">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  {cat.short_description || "No description provided."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleActive(cat)}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    cat.is_active
                      ? "text-zinc-400 hover:text-white"
                      : "text-emerald-400 hover:text-emerald-300"
                  }`}
                  title={cat.is_active ? "Hide category" : "Make visible"}
                >
                  {cat.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{cat.is_active ? "Hide" : "Show"}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                    aria-label="Edit category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(cat)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    aria-label="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-[#141414] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-black uppercase text-white tracking-wide">
                {editingCat.id ? `Edit: ${editingCat.name}` : "Add New RC Category"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Category Name <span className="text-[#FF5500]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RC Drift Cars"
                  value={editingCat.name || ""}
                  onChange={(e) =>
                    setEditingCat({ ...editingCat, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Short Description / Specs
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. High speed brushless 4WD..."
                  value={editingCat.short_description || ""}
                  onChange={(e) =>
                    setEditingCat({
                      ...editingCat,
                      short_description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingCat.sort_order ?? 1}
                    onChange={(e) =>
                      setEditingCat({
                        ...editingCat,
                        sort_order: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-3">
                    <input
                      type="checkbox"
                      checked={editingCat.is_active ?? true}
                      onChange={(e) =>
                        setEditingCat({
                          ...editingCat,
                          is_active: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-[#FF5500] accent-[#FF5500] rounded"
                    />
                    <span className="text-xs font-bold uppercase text-zinc-300">
                      Active on Website
                    </span>
                  </label>
                </div>
              </div>

              {/* Category Image Upload */}
              <ImageUploader
                label="Category Showcase Photo"
                bucket="categories"
                folder="category-images"
                currentUrl={editingCat.image_url}
                onUploadSuccess={(url) =>
                  setEditingCat({ ...editingCat, image_url: url })
                }
                onRemove={() =>
                  setEditingCat({ ...editingCat, image_url: null })
                }
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-[#FF5500] hover:bg-[#FF6A1A] shadow-lg shadow-[#FF5500]/30 transition-all disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Category"
        message={`Are you sure you want to delete category "${deleteTarget?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
