"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { createClient } from "@/lib/supabase/client";
import { Feature } from "@/types/database";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  CheckSquare,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminFeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Partial<Feature> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Feature | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();

  const fetchFeatures = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("features")
        .select("*")
        .order("sort_order", { ascending: true });

      if (data && data.length > 0) {
        setFeatures(data as Feature[]);
      } else {
        setFeatures([
          {
            id: "f-1",
            title: "Premium Quality",
            description: "Uncompromising engineering, durable carbon-composite chassis, and high-discharge LiPo powertrain systems.",
            icon_url: null,
            sort_order: 1,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "f-2",
            title: "Trusted Brands",
            description: "Authentic inventory curated from top global RC hobby and motorsport manufacturers.",
            icon_url: null,
            sort_order: 2,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "f-3",
            title: "Expert Support",
            description: "Dedicated RC specialists for calibration, tune-ups, custom upgrades, and ongoing maintenance.",
            icon_url: null,
            sort_order: 3,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "f-4",
            title: "Fast & Safe Delivery",
            description: "Carefully packaged, tested, and tracked door-to-door delivery across Kerala and India.",
            icon_url: null,
            sort_order: 4,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
        ]);
      }
    } catch (err) {
      console.error("Error fetching features:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleOpenAdd = () => {
    setEditingFeature({
      title: "",
      description: "",
      sort_order: (features.length + 1) * 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (feat: Feature) => {
    setEditingFeature({ ...feat });
    setIsModalOpen(true);
  };

  const handleSaveFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeature || !editingFeature.title || !editingFeature.description) return;

    setIsSaving(true);
    setStatusMsg(null);

    try {
      const payload = {
        ...editingFeature,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("features").upsert(payload as any);

      if (error) {
        setFeatures((prev) => {
          if (editingFeature.id) {
            return prev.map((f) => (f.id === editingFeature.id ? ({ ...f, ...editingFeature } as Feature) : f));
          } else {
            return [...prev, { ...editingFeature, id: `feat-${Date.now()}` } as Feature];
          }
        });
        setStatusMsg({ type: "success", text: `Feature updated locally.` });
      } else {
        setStatusMsg({ type: "success", text: `Feature saved successfully!` });
        await fetchFeatures();
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to save feature" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await supabase.from("features").delete().eq("id", deleteTarget.id);
      setFeatures((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      setStatusMsg({ type: "success", text: `Feature deleted successfully.` });
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to delete feature" });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Why Choose Us / Brand Features"
        subtitle="Manage the core value pillars, warranty guarantees, and trust highlights shown on the website"
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

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
          <CheckSquare className="w-4 h-4 text-[#FF5500]" />
          <span>{features.length} Features Registered</span>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-[#FF5500] hover:bg-[#FF6A1A] shadow-lg shadow-[#FF5500]/25 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Feature</span>
        </button>
      </div>

      {/* Features Grid */}
      {isLoading ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#FF5500] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div
              key={feat.id || idx}
              className={`rounded-3xl bg-[#0E0E0E] border ${
                feat.is_active ? "border-white/10" : "border-white/5 opacity-60"
              } p-6 flex flex-col justify-between space-y-4 hover:border-[#FF5500]/50 transition-all shadow-xl`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Pillar #{feat.sort_order}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      feat.is_active
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {feat.is_active ? "Active" : "Hidden"}
                  </span>
                </div>

                <h3 className="text-base font-black text-white uppercase tracking-wide">
                  {feat.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(feat)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(feat)}
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
      {isModalOpen && editingFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-[#141414] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-black uppercase text-white tracking-wide">
                {editingFeature.id ? "Edit Feature" : "Add Brand Feature"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFeature} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Feature Title <span className="text-[#FF5500]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Expert Support"
                  value={editingFeature.title || ""}
                  onChange={(e) =>
                    setEditingFeature({
                      ...editingFeature,
                      title: e.target.value,
                    })
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
                  placeholder="e.g. Dedicated RC specialists for calibration..."
                  value={editingFeature.description || ""}
                  onChange={(e) =>
                    setEditingFeature({
                      ...editingFeature,
                      description: e.target.value,
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
                    value={editingFeature.sort_order ?? 1}
                    onChange={(e) =>
                      setEditingFeature({
                        ...editingFeature,
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
                      checked={editingFeature.is_active ?? true}
                      onChange={(e) =>
                        setEditingFeature({
                          ...editingFeature,
                          is_active: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-[#FF5500] accent-[#FF5500] rounded"
                    />
                    <span className="text-xs font-bold uppercase text-zinc-300">
                      Active
                    </span>
                  </label>
                </div>
              </div>

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
                  {isSaving ? "Saving..." : "Save Feature"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Feature"
        message={`Are you sure you want to delete feature "${deleteTarget?.title}"?`}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
