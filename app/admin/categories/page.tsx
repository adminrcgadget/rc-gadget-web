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
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
        setCategories([
          {
            id: "c-1",
            name: "RC Cars",
            short_description: "High-speed brushless buggies, crawlers & drift racers",
            icon_url: null,
            image_url: "/assets/cat-car.webp",
            sort_order: 1,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "c-2",
            name: "RC Planes",
            short_description: "Aerobatic aircraft & precision scale jets",
            icon_url: null,
            image_url: "/assets/cat-plane.webp",
            sort_order: 2,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "c-3",
            name: "RC Boats",
            short_description: "High velocity racing speedboats & catamarans",
            icon_url: null,
            image_url: "/assets/cat-ship.webp",
            sort_order: 3,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "c-4",
            name: "RC Drones",
            short_description: "GPS camera quadcopters & FPV racers",
            icon_url: null,
            image_url: null,
            sort_order: 4,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "c-5",
            name: "RC Bikes",
            short_description: "Gyro-stabilized scale supermotos & dirtbikes",
            icon_url: null,
            image_url: null,
            sort_order: 5,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "c-6",
            name: "RC Parts",
            short_description: "Heavy scale excavators, dump trucks & loaders",
            icon_url: null,
            image_url: "/assets/cat-excavator.webp",
            sort_order: 6,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "c-7",
            name: "Batteries",
            short_description: "LiPo, Li-Ion packs, smart balance chargers & leads",
            icon_url: null,
            image_url: null,
            sort_order: 7,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "c-8",
            name: "Accessories",
            short_description: "2.4GHz transmitters, receivers, brushless ESCs & tools",
            icon_url: null,
            image_url: null,
            sort_order: 8,
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
      icon_url: null,
      image_url: null,
      sort_order: categories.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
    setStatusMsg(null);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCat({ ...cat });
    setIsModalOpen(true);
    setStatusMsg(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCat(null);
  };

  const handleDirectCardUpload = async (cat: Category, file: File) => {
    setUploadingCardId(cat.id);
    setStatusMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "categories");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok || !result.url) {
        throw new Error(result.error || "Upload failed");
      }

      const newImageUrl = result.url;
      const payload = {
        name: cat.name,
        short_description: cat.short_description || "",
        icon_url: cat.icon_url || null,
        image_url: newImageUrl,
        sort_order: cat.sort_order ?? 1,
        is_active: cat.is_active ?? true,
        updated_at: new Date().toISOString(),
      };

      const isUuid =
        cat.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          cat.id
        );

      let savedCat: any;

      if (isUuid) {
        const { data, error } = await (supabase.from("categories") as any)
          .update(payload)
          .eq("id", cat.id)
          .select()
          .single();

        if (error) throw error;
        savedCat = data;
      } else {
        const { data, error } = await (supabase.from("categories") as any)
          .insert({ ...payload, created_at: new Date().toISOString() })
          .select()
          .single();

        if (error) throw error;
        savedCat = data;
      }

      setCategories((prev) =>
        prev.map((c) =>
          c.id === cat.id ? { ...c, image_url: newImageUrl, id: savedCat?.id || c.id } : c
        )
      );

      setStatusMsg({
        type: "success",
        text: `Photo for "${cat.name}" updated successfully!`,
      });
    } catch (err: any) {
      console.error("Direct upload error:", err);
      setStatusMsg({
        type: "error",
        text: err.message || "Failed to upload category image",
      });
    } finally {
      setUploadingCardId(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat || !editingCat.name) return;

    setIsSaving(true);
    setStatusMsg(null);

    try {
      const payload: any = {
        name: editingCat.name.trim(),
        short_description: editingCat.short_description?.trim() || null,
        icon_url: editingCat.icon_url || null,
        image_url: editingCat.image_url || null,
        sort_order: Number(editingCat.sort_order) || 1,
        is_active: editingCat.is_active ?? true,
        updated_at: new Date().toISOString(),
      };

      const isUuid =
        editingCat.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          editingCat.id
        );

      if (isUuid) {
        const { data, error } = await (supabase.from("categories") as any)
          .update(payload)
          .eq("id", editingCat.id)
          .select()
          .single();

        if (error) throw error;

        setCategories((prev) =>
          prev.map((c) => (c.id === editingCat.id ? (data as Category) : c))
        );
        setStatusMsg({
          type: "success",
          text: `Category "${payload.name}" updated successfully!`,
        });
      } else {
        payload.created_at = new Date().toISOString();
        const { data, error } = await (supabase.from("categories") as any)
          .insert(payload)
          .select()
          .single();

        if (error) throw error;

        setCategories((prev) => [...prev, data as Category]);
        setStatusMsg({
          type: "success",
          text: `Category "${payload.name}" created successfully!`,
        });
      }

      handleCloseModal();
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

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const isUuid =
        deleteTarget.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          deleteTarget.id
        );

      if (isUuid) {
        const { error } = await supabase
          .from("categories")
          .delete()
          .eq("id", deleteTarget.id);

        if (error) throw error;
      }

      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setStatusMsg({
        type: "success",
        text: `Category "${deleteTarget.name}" deleted successfully.`,
      });
    } catch (err: any) {
      console.error("Error deleting category:", err);
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
    const newStatus = !cat.is_active;
    try {
      const isUuid =
        cat.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          cat.id
        );

      if (isUuid) {
        const { error } = await (supabase.from("categories") as any)
          .update({ is_active: newStatus, updated_at: new Date().toISOString() })
          .eq("id", cat.id);

        if (error) throw error;
      }

      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, is_active: newStatus } : c))
      );
    } catch (err: any) {
      console.error("Error toggling active status:", err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <AdminHeader
          title="RC Categories"
          subtitle="Manage your 8 store categories with photos and fleet descriptions"
        />
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-[#FF6A00] shadow-md shadow-[#FF5A00]/25 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center gap-2.5 ${
            statusMsg.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {statusMsg.type === "success" ? (
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {isLoading ? (
        <div className="p-16 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#FF5A00] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, idx) => {
            const isThisCardUploading = uploadingCardId === cat.id;

            return (
              <div
                key={cat.id || idx}
                className={`rounded-2xl bg-white border ${
                  cat.is_active ? "border-gray-200/80" : "border-gray-200 opacity-60"
                } p-5 flex flex-col justify-between space-y-4 hover:border-[#FF5A00]/50 hover:shadow-md transition-all shadow-xs relative overflow-hidden`}
              >
                <div>
                  {/* Header Image Thumbnail & Direct Upload Box */}
                  <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-3.5 flex items-center justify-center p-3 group">
                    {cat.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        fill
                        sizes="240px"
                        className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1.5 select-none">
                        <Layers className="w-7 h-7 text-[#FF5A00]" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          No Photo Uploaded
                        </span>
                      </div>
                    )}

                    {/* Badges on preview */}
                    <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-black text-gray-700 border border-gray-200">
                      #{cat.sort_order}
                    </div>

                    <div
                      className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                        cat.is_active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {cat.is_active ? "Active" : "Hidden"}
                    </div>

                    {/* Loading Overlay */}
                    {isThisCardUploading && (
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-[#FF5A00] z-20">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                          Uploading...
                        </span>
                      </div>
                    )}

                    {/* Hover 1-Click Upload Overlay */}
                    {!isThisCardUploading && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3 z-10 backdrop-blur-2xs">
                        <button
                          type="button"
                          onClick={() => cardFileInputRefs.current[cat.id]?.click()}
                          className="px-3.5 py-1.5 rounded-xl bg-[#FF5A00] hover:bg-[#FF6A00] text-white text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload Photo</span>
                        </button>
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

                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {cat.short_description || "No description provided."}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(cat)}
                    className={`text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                      cat.is_active
                        ? "text-gray-400 hover:text-gray-700"
                        : "text-emerald-600 hover:text-emerald-700"
                    }`}
                  >
                    {cat.is_active ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                    <span>{cat.is_active ? "Hide" : "Show"}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-[#FF5A00] text-[#FF5A00] hover:text-white transition-all text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
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

      {/* Edit / Add Modal Dialog */}
      {isModalOpen && editingCat && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">
                {editingCat.id ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingCat.name || ""}
                  onChange={(e) =>
                    setEditingCat((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g. RC Cars, RC Planes"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-xs outline-none focus:border-[#FF5A00] focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingCat.short_description || ""}
                  onChange={(e) =>
                    setEditingCat((prev) => ({
                      ...prev,
                      short_description: e.target.value,
                    }))
                  }
                  placeholder="Brief description for category preview cards..."
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-xs outline-none focus:border-[#FF5A00] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingCat.sort_order ?? 1}
                    onChange={(e) =>
                      setEditingCat((prev) => ({
                        ...prev,
                        sort_order: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-xs outline-none focus:border-[#FF5A00] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                    Status
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingCat((prev) => ({
                        ...prev,
                        is_active: !prev?.is_active,
                      }))
                    }
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase border transition-all ${
                      editingCat.is_active
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}
                  >
                    {editingCat.is_active ? "Active" : "Hidden"}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <ImageUploader
                  label="Category Photo (Cutout on Transparent / Clean Background)"
                  folder="categories"
                  currentUrl={editingCat.image_url}
                  onUploadSuccess={(url) =>
                    setEditingCat((prev) => ({ ...prev, image_url: url }))
                  }
                  onRemove={() =>
                    setEditingCat((prev) => ({ ...prev, image_url: null }))
                  }
                  onUploadingStateChange={setIsImageUploading}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isImageUploading}
                  className="px-6 py-2.5 rounded-xl bg-[#FF5A00] hover:bg-[#FF6A00] text-white text-xs font-black uppercase tracking-wider shadow-md shadow-[#FF5A00]/25 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete Category"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
