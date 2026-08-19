"use client";

import React, { useEffect, useState, useRef } from "react";
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
  Upload,
  Sparkles,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Direct card upload state
  const [uploadingCardId, setUploadingCardId] = useState<string | null>(null);
  const cardFileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

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
        setCategories([]);
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

  // Direct 1-Click Image Upload for a Category Card
  const handleDirectCardUpload = async (cat: Category, file: File) => {
    if (!file || !cat.id) return;
    setUploadingCardId(cat.id);
    setStatusMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "category-images");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok || !result.url) {
        throw new Error(result.error || "Image upload failed");
      }

      const newImageUrl = result.url;

      // Update Supabase DB directly
      const { error: dbError } = await (supabase.from("categories") as any)
        .update({
          image_url: newImageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", cat.id);

      if (dbError) throw dbError;

      // Update local state immediately
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, image_url: newImageUrl } : c))
      );

      setStatusMsg({
        type: "success",
        text: `Photo updated successfully for '${cat.name}'!`,
      });
    } catch (err: any) {
      console.error("Direct upload error:", err);
      setStatusMsg({
        type: "error",
        text: err.message || "Failed to upload photo for category",
      });
    } finally {
      setUploadingCardId(null);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat || !editingCat.name) return;

    setIsSaving(true);
    setStatusMsg(null);

    try {
      const isUuid =
        editingCat.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          editingCat.id
        );

      if (editingCat.id && isUuid) {
        // Update existing record
        const { error } = await (supabase.from("categories") as any)
          .update({
            name: editingCat.name,
            short_description: editingCat.short_description || "",
            image_url: editingCat.image_url || null,
            icon_url: editingCat.icon_url || null,
            sort_order: editingCat.sort_order ?? 1,
            is_active: editingCat.is_active ?? true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingCat.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await (supabase.from("categories") as any).insert({
          name: editingCat.name,
          short_description: editingCat.short_description || "",
          image_url: editingCat.image_url || null,
          icon_url: editingCat.icon_url || null,
          sort_order: editingCat.sort_order ?? 1,
          is_active: editingCat.is_active ?? true,
        });

        if (error) throw error;
      }

      setStatusMsg({
        type: "success",
        text: `Category '${editingCat.name}' saved successfully to database!`,
      });
      await fetchCategories();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error saving category:", err);
      setStatusMsg({
        type: "error",
        text: err.message || "Failed to save category",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const { error } = await (supabase.from("categories") as any)
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;

      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setStatusMsg({
        type: "success",
        text: `Category '${deleteTarget.name}' deleted successfully.`,
      });
    } catch (err: any) {
      setStatusMsg({
        type: "error",
        text: err.message || "Failed to delete category",
      });
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
        title="Our World — RC Vehicle Photos & Categories"
        subtitle="Upload, edit, and manage high-resolution photos and descriptions for the RC vehicle categories displayed in 'Our World'"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
          <Layers className="w-4 h-4 text-[#FF5500]" />
          <span>{categories.length} Categories in &ldquo;Our World&rdquo;</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-[#FF5500] hover:bg-[#FF6A1A] shadow-lg shadow-[#FF5500]/25 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* Categories Table / Card Grid */}
      {isLoading ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#FF5500] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const isThisCardUploading = uploadingCardId === cat.id;

            return (
              <div
                key={cat.id || idx}
                className={`rounded-3xl bg-[#0E0E0E] border ${
                  cat.is_active ? "border-white/10" : "border-white/5 opacity-60"
                } p-6 flex flex-col justify-between space-y-4 hover:border-[#FF5500]/50 transition-all shadow-xl relative overflow-hidden`}
              >
                <div>
                  {/* Header Image Thumbnail & Direct Upload Box */}
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-[#050505] border border-zinc-800 mb-4 flex items-center justify-center p-3 group">
                    {cat.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        fill
                        sizes="300px"
                        className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-1.5 select-none">
                        <Layers className="w-8 h-8 text-[#FF5500]" />
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                          No Photo Uploaded
                        </span>
                      </div>
                    )}

                    {/* Badges on preview */}
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-black text-zinc-300 border border-white/10">
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

                    {/* Loading Overlay */}
                    {isThisCardUploading && (
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-[#FF5500] z-20">
                        <Loader2 className="w-7 h-7 animate-spin" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white">
                          Uploading & Saving...
                        </span>
                      </div>
                    )}

                    {/* Hover 1-Click Upload Overlay */}
                    {!isThisCardUploading && (
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2.5 p-4 z-10">
                        <button
                          type="button"
                          onClick={() => cardFileInputRefs.current[cat.id]?.click()}
                          className="px-4 py-2 rounded-xl bg-[#FF5500] hover:bg-[#FF6A1A] text-white text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Photo</span>
                        </button>
                        <span className="text-[10px] text-zinc-400 font-medium">
                          Supports PNG, WebP, JPG
                        </span>
                      </div>
                    )}

                    {/* Hidden Direct File Input */}
                    <input
                      type="file"
                      accept="image/png,image/webp,image/jpeg,image/jpg"
                      ref={(el) => {
                        cardFileInputRefs.current[cat.id] = el;
                      }}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleDirectCardUpload(cat, file);
                          e.target.value = "";
                        }
                      }}
                    />
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
                    {cat.is_active ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    <span>{cat.is_active ? "Hide" : "Show"}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => cardFileInputRefs.current[cat.id]?.click()}
                      className="p-2 rounded-lg bg-zinc-800/80 hover:bg-[#FF5500] text-zinc-300 hover:text-white transition-all text-xs font-bold flex items-center gap-1"
                      title="Upload new image"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="px-3 py-1.5 rounded-lg bg-[#FF5500]/20 hover:bg-[#FF5500] text-[#FF5500] hover:text-white transition-all text-xs font-bold uppercase flex items-center gap-1.5"
                      aria-label="Edit category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
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
            );
          })}
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
                label="Category Showcase Photo (Cloudinary Upload)"
                bucket="categories"
                folder="category-images"
                currentUrl={editingCat.image_url}
                onUploadingStateChange={(loading) => setIsImageUploading(loading)}
                onUploadSuccess={(url) =>
                  setEditingCat((prev) => (prev ? { ...prev, image_url: url } : null))
                }
                onRemove={() =>
                  setEditingCat((prev) => (prev ? { ...prev, image_url: null } : null))
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
                  disabled={isSaving || isImageUploading}
                  className="px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-[#FF5500] hover:bg-[#FF6A1A] shadow-lg shadow-[#FF5500]/30 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to DB...</span>
                    </>
                  ) : isImageUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading Image...</span>
                    </>
                  ) : (
                    <span>Save Category</span>
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
        title="Delete Category"
        message={`Are you sure you want to delete category "${deleteTarget?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
