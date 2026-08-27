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
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
            description:
              "Engineered high-grip asphalt curves, banked corners, and straightaways designed for lightning-fast touring and drift battles.",
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
            title: "Water Tank Arena",
            subtitle: "AQUATIC SPEED",
            description:
              "Dedicated indoor testing and racing water tank for high-speed brushless catamarans, deep-V racing hulls, and rescue tugs.",
            image_url:
              "/logo/WhatsApp Image 2026-08-17 at 6.53.55 PM (1).jpeg",
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
      image_url: null,
      button_text: "Learn More",
      button_url: "#contact",
      sort_order: experiences.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
    setStatusMsg(null);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExp({ ...exp });
    setIsModalOpen(true);
    setStatusMsg(null);
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp || !editingExp.title) return;

    setIsSaving(true);
    setStatusMsg(null);

    try {
      const payload: any = {
        title: editingExp.title.trim(),
        subtitle: editingExp.subtitle?.trim() || "",
        description: editingExp.description?.trim() || "",
        image_url: editingExp.image_url || null,
        button_text: editingExp.button_text || "Learn More",
        button_url: editingExp.button_url || "#contact",
        sort_order: Number(editingExp.sort_order) || 1,
        is_active: editingExp.is_active ?? true,
        updated_at: new Date().toISOString(),
      };

      const isUuid =
        editingExp.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          editingExp.id
        );

      if (isUuid) {
        const { data, error } = await (supabase.from("experiences") as any)
          .update(payload)
          .eq("id", editingExp.id)
          .select()
          .single();

        if (error) throw error;

        setExperiences((prev) =>
          prev.map((ex) =>
            ex.id === editingExp.id ? (data as Experience) : ex
          )
        );
        setStatusMsg({
          type: "success",
          text: `Track "${payload.title}" updated successfully!`,
        });
      } else {
        payload.created_at = new Date().toISOString();
        const { data, error } = await (supabase.from("experiences") as any)
          .insert(payload)
          .select()
          .single();

        if (error) throw error;

        setExperiences((prev) => [...prev, data as Experience]);
        setStatusMsg({
          type: "success",
          text: `Track "${payload.title}" created successfully!`,
        });
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error saving experience track:", err);
      setStatusMsg({
        type: "error",
        text: err.message || "Failed to save track",
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
          .from("experiences")
          .delete()
          .eq("id", deleteTarget.id);

        if (error) throw error;
      }

      setExperiences((prev) => prev.filter((ex) => ex.id !== deleteTarget.id));
      setStatusMsg({
        type: "success",
        text: `Track "${deleteTarget.title}" deleted.`,
      });
    } catch (err: any) {
      console.error("Error deleting track:", err);
      setStatusMsg({
        type: "error",
        text: err.message || "Failed to delete track",
      });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <AdminHeader
          title="Tracks &amp; Arena Experiences"
          subtitle="Manage racing tracks, water test tanks, and experience modules"
        />
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-[#FF6A00] shadow-md shadow-[#FF5A00]/25 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Track</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map((exp, idx) => (
            <div
              key={exp.id || idx}
              className={`rounded-2xl bg-white border ${
                exp.is_active ? "border-gray-200/80" : "border-gray-200 opacity-60"
              } p-6 flex flex-col justify-between space-y-4 hover:border-[#FF5A00]/50 hover:shadow-md transition-all shadow-xs`}
            >
              <div>
                <div className="relative w-full h-56 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-4 flex items-center justify-center">
                  {exp.image_url ? (
                    <Image
                      src={exp.image_url}
                      alt={exp.title}
                      fill
                      sizes="400px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center gap-2">
                      <Flag className="w-8 h-8 text-[#FF5A00]" />
                      <span className="text-xs font-bold uppercase">
                        No Track Image
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[9px] font-black text-gray-700 border border-gray-200">
                    Order: #{exp.sort_order}
                  </div>
                </div>

                <h3 className="text-lg font-black text-gray-900 uppercase tracking-wide">
                  {exp.title}
                </h3>
                {exp.subtitle && (
                  <p className="text-xs font-bold text-[#FF5A00] uppercase tracking-wider mt-1">
                    {exp.subtitle}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                  {exp.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(exp)}
                  className="p-2 rounded-lg bg-orange-50 hover:bg-[#FF5A00] text-[#FF5A00] hover:text-white transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(exp)}
                  className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-base font-black uppercase text-gray-900 tracking-wide">
                {editingExp.id ? "Edit Experience" : "Add Experience Track"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExperience} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Track / Experience Title <span className="text-[#FF5A00]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RC Car Track"
                  value={editingExp.title || ""}
                  onChange={(e) =>
                    setEditingExp({ ...editingExp, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Subtitle Badge
                </label>
                <input
                  type="text"
                  placeholder="e.g. FOR SPEED LOVERS"
                  value={editingExp.subtitle || ""}
                  onChange={(e) =>
                    setEditingExp({ ...editingExp, subtitle: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Description <span className="text-[#FF5A00]">*</span>
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
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none resize-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
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
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    CTA Button Label
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
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                <ImageUploader
                  label="Track Photo"
                  bucket="site-assets"
                  folder="experiences"
                  currentUrl={editingExp.image_url}
                  onUploadSuccess={(url) =>
                    setEditingExp({ ...editingExp, image_url: url })
                  }
                  onRemove={() =>
                    setEditingExp({ ...editingExp, image_url: null })
                  }
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-[#FF6A00] shadow-md shadow-[#FF5A00]/25 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Track</span>
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
        title="Delete Track"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
