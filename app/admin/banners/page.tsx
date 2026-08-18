"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { createClient } from "@/lib/supabase/client";
import { Banner } from "@/types/database";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Confirm Dialog
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("sort_order", { ascending: true });

      if (data && data.length > 0) {
        setBanners(data as Banner[]);
      } else {
        setBanners([
          {
            id: "banner-1",
            title: "COMING SOON INTO NEW IN KOTTAKKAL",
            subtitle: "FIRST IN MALAPPURAM — WHERE PASSION MEETS PERFORMANCE",
            description: "RC Gadgets brings high-end remote control technology, professional grade tracks, and premium motorsport hobby equipment to Malappuram.",
            image_url: "/logo/WhatsApp Image 2026-08-17 at 6.53.55 PM.jpeg",
            desktop_image_url: "/logo/WhatsApp Image 2026-08-17 at 6.53.55 PM.jpeg",
            mobile_image_url: "/logo/WhatsApp Image 2026-08-17 at 6.53.55 PM.jpeg",
            button_text: "Get Launch Updates",
            button_url: "#contact",
            position: "featured",
            is_active: true,
            sort_order: 1,
            created_at: "",
            updated_at: "",
          },
        ]);
      }
    } catch (err) {
      console.error("Error fetching banners:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenAdd = () => {
    setEditingBanner({
      title: "",
      subtitle: "",
      description: "",
      image_url: "",
      desktop_image_url: "",
      mobile_image_url: "",
      button_text: "Get In Touch",
      button_url: "#contact",
      position: "featured",
      sort_order: (banners.length + 1) * 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner: Banner) => {
    setEditingBanner({ ...banner });
    setIsModalOpen(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner || !editingBanner.title) return;

    setIsSaving(true);
    setStatusMsg(null);

    try {
      const payload: any = {
        ...editingBanner,
        updated_at: new Date().toISOString(),
      };

      const isUuid = payload.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.id);
      if (!isUuid) {
        delete payload.id;
      }

      const { error } = await supabase.from("banners").upsert(payload).select();

      if (error) {
        throw error;
      }

      setStatusMsg({ type: "success", text: `Banner saved successfully!` });
      await fetchBanners();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error saving banner:", err);
      setStatusMsg({ type: "error", text: err.message || "Failed to save banner" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await supabase.from("banners").delete().eq("id", deleteTarget.id);
      setBanners((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setStatusMsg({ type: "success", text: `Banner deleted successfully.` });
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to delete banner" });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Promotional & Coming Soon Banners"
        subtitle="Manage launch announcements, promotional posters, desktop/mobile responsive artwork, and CTAs"
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
          <ImageIcon className="w-4 h-4 text-[#FF5500]" />
          <span>{banners.length} Active Banners</span>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-[#FF5500] hover:bg-[#FF6A1A] shadow-lg shadow-[#FF5500]/25 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      {/* Banners Grid */}
      {isLoading ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#FF5500] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {banners.map((banner, idx) => (
            <div
              key={banner.id || idx}
              className={`rounded-3xl bg-[#0E0E0E] border ${
                banner.is_active ? "border-white/10" : "border-white/5 opacity-60"
              } p-6 flex flex-col justify-between space-y-4 hover:border-[#FF5500]/50 transition-all shadow-2xl`}
            >
              <div>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/60 border border-white/10 mb-4">
                  {banner.image_url ? (
                    <Image
                      src={banner.image_url}
                      alt={banner.title}
                      fill
                      sizes="500px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <ImageIcon className="w-10 h-10 text-[#FF5500]" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-black text-zinc-300">
                    Order: #{banner.sort_order}
                  </div>

                  <div
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      banner.is_active
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {banner.is_active ? "Active" : "Disabled"}
                  </div>
                </div>

                <h3 className="text-xl font-black text-white uppercase tracking-wide">
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="text-xs font-bold text-orange-400 uppercase tracking-wider mt-1">
                    {banner.subtitle}
                  </p>
                )}
                {banner.description && (
                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
                    {banner.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500">
                  CTA: {banner.button_text || "Get In Touch"}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(banner)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(banner)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-[#141414] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-black uppercase text-white tracking-wide">
                {editingBanner.id ? "Edit Banner" : "Add New Promotional Banner"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Banner Title <span className="text-[#FF5500]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. COMING SOON INTO NEW IN KOTTAKKAL"
                  value={editingBanner.title || ""}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, title: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Subtitle / Highlight
                </label>
                <input
                  type="text"
                  placeholder="e.g. FIRST IN MALAPPURAM"
                  value={editingBanner.subtitle || ""}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      subtitle: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingBanner.description || ""}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={editingBanner.button_text || ""}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        button_text: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Button URL
                  </label>
                  <input
                    type="text"
                    value={editingBanner.button_url || ""}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        button_url: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingBanner.sort_order ?? 1}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
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
                      checked={editingBanner.is_active ?? true}
                      onChange={(e) =>
                        setEditingBanner({
                          ...editingBanner,
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

              {/* Banner Image Upload */}
              <ImageUploader
                label="Banner Poster Artwork"
                bucket="banners"
                folder="promos"
                currentUrl={editingBanner.image_url}
                onUploadSuccess={(url) => {
                  setEditingBanner({
                    ...editingBanner,
                    image_url: url,
                    desktop_image_url: url,
                    mobile_image_url: url,
                  });
                }}
                onRemove={() =>
                  setEditingBanner({
                    ...editingBanner,
                    image_url: null,
                    desktop_image_url: null,
                    mobile_image_url: null,
                  })
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
                  {isSaving ? "Saving..." : "Save Banner"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Banner"
        message={`Are you sure you want to delete banner "${deleteTarget?.title}"?`}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
