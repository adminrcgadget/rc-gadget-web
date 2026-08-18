"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { createClient } from "@/lib/supabase/client";
import { Experience } from "@/types/database";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  Flag,
  X,
} from "lucide-react";

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();

  const fetchExperiences = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("sort_order", { ascending: true });

      if (data && data.length > 0) {
        setExperiences(data as Experience[]);
      } else {
        setExperiences([
          {
            id: "exp-1",
            title: "RC Car Track",
            subtitle: "FOR SPEED LOVERS",
            description: "Engineered high-grip asphalt curves, banked corners, and straightaways designed for lightning-fast touring and drift battles.",
            image_url: "/logo/WhatsApp Image 2026-08-17 at 6.53.55 PM.jpeg",
            button_text: "Learn More",
            button_url: "#contact",
            sort_order: 1,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "exp-2",
            title: "RC Adventure Track",
            subtitle: "BUILT FOR EXTREME FUN",
            description: "Extreme rock climbs, suspension-testing log bridges, muddy trenches, and scale off-road crawler trails for ultimate testing.",
            image_url: "/logo/WhatsApp Image 2026-08-17 at 6.53.55 PM.jpeg",
            button_text: "Learn More",
            button_url: "#contact",
            sort_order: 2,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
        ]);
      }
    } catch (err) {
      console.error("Error fetching experiences:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleOpenAdd = () => {
    setEditingExp({
      title: "",
      subtitle: "",
      description: "",
      image_url: "",
      button_text: "Learn More",
      button_url: "#contact",
      sort_order: (experiences.length + 1) * 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExp({ ...exp });
    setIsModalOpen(true);
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp || !editingExp.title || !editingExp.description) return;

    setIsSaving(true);
    setStatusMsg(null);

    try {
      const payload: any = {
        ...editingExp,
        updated_at: new Date().toISOString(),
      };

      const isUuid = payload.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.id);
      if (!isUuid) {
        delete payload.id;
      }

      const { error } = await supabase.from("experiences").upsert(payload).select();

      if (error) {
        throw error;
      }

      setStatusMsg({ type: "success", text: "Experience saved successfully to Supabase!" });
      await fetchExperiences();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error saving experience:", err);
      setStatusMsg({ type: "error", text: err.message || "Failed to save experience" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await supabase.from("experiences").delete().eq("id", deleteTarget.id);
      setExperiences((prev) => prev.filter((ex) => ex.id !== deleteTarget.id));
      setStatusMsg({ type: "success", text: "Experience track deleted successfully." });
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to delete experience" });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Experience The Thrill / Track Arenas"
        subtitle="Manage custom indoor drift tracks, rock crawler trails, specs, and photos"
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
          <Flag className="w-4 h-4 text-[#FF5500]" />
          <span>{experiences.length} Experience Arenas</span>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-[#FF5500] hover:bg-[#FF6A1A] shadow-lg shadow-[#FF5500]/25 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Experience</span>
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#FF5500] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experiences.map((exp, idx) => (
            <div
              key={exp.id || idx}
              className={`rounded-3xl bg-[#0E0E0E] border ${
                exp.is_active ? "border-white/10" : "border-white/5 opacity-60"
              } p-6 flex flex-col justify-between space-y-4 hover:border-[#FF5500]/50 transition-all shadow-xl`}
            >
              <div>
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-black/60 border border-white/10 mb-4">
                  {exp.image_url ? (
                    <Image
                      src={exp.image_url}
                      alt={exp.title}
                      fill
                      sizes="400px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Flag className="w-10 h-10 text-[#FF5500]" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-black text-zinc-300">
                    Track #{exp.sort_order}
                  </div>

                  <div
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      exp.is_active
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {exp.is_active ? "Active" : "Disabled"}
                  </div>
                </div>

                <h3 className="text-xl font-black text-white uppercase tracking-wide">
                  {exp.title}
                </h3>
                {exp.subtitle && (
                  <p className="text-xs font-bold text-orange-400 uppercase tracking-wider mt-1">
                    {exp.subtitle}
                  </p>
                )}
                <p className="text-xs text-zinc-400 mt-2 line-clamp-3">
                  {exp.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(exp)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(exp)}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-[#141414] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-black uppercase text-white tracking-wide">
                {editingExp.id ? "Edit Experience" : "Add Experience Track"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExperience} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Track / Experience Title <span className="text-[#FF5500]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RC Car Track"
                  value={editingExp.title || ""}
                  onChange={(e) =>
                    setEditingExp({ ...editingExp, title: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Subtitle Badge
                </label>
                <input
                  type="text"
                  placeholder="e.g. FOR SPEED LOVERS"
                  value={editingExp.subtitle || ""}
                  onChange={(e) =>
                    setEditingExp({ ...editingExp, subtitle: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Description <span className="text-[#FF5500]">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Engineered high-grip asphalt curves..."
                  value={editingExp.description || ""}
                  onChange={(e) =>
                    setEditingExp({
                      ...editingExp,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={editingExp.button_text || ""}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        button_text: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingExp.sort_order ?? 1}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        sort_order: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <ImageUploader
                label="Track Photo Artwork"
                bucket="experiences"
                folder="tracks"
                currentUrl={editingExp.image_url}
                onUploadSuccess={(url) =>
                  setEditingExp({ ...editingExp, image_url: url })
                }
                onRemove={() =>
                  setEditingExp({ ...editingExp, image_url: null })
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
                  {isSaving ? "Saving..." : "Save Track"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Experience"
        message={`Are you sure you want to delete track "${deleteTarget?.title}"?`}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
