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
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Partial<Feature> | null>(
    null
  );
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
            description:
              "Uncompromising engineering, durable carbon-composite chassis, and high-discharge LiPo powertrain systems.",
            icon_url: null,
            sort_order: 1,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "f-2",
            title: "Trusted Brands",
            description:
              "Authentic inventory curated from top global RC hobby and motorsport manufacturers.",
            icon_url: null,
            sort_order: 2,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "f-3",
            title: "Expert Support",
            description:
              "Dedicated RC technicians and setup specialists for repairs, tuning, calibration, and upgrades.",
            icon_url: null,
            sort_order: 3,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "f-4",
            title: "Fast & Safe Delivery",
            description:
              "Pan-India insured and tracked shipping to ensure your valuable RC aircraft and models arrive in pristine condition.",
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
      icon_url: null,
      sort_order: features.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
    setStatusMsg(null);
  };

  const handleOpenEdit = (feat: Feature) => {
    setEditingFeature({ ...feat });
    setIsModalOpen(true);
    setStatusMsg(null);
  };

  const handleSaveFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeature || !editingFeature.title) return;

    setIsSaving(true);
    setStatusMsg(null);

    try {
      const payload: any = {
        title: editingFeature.title.trim(),
        description: editingFeature.description?.trim() || "",
        icon_url: editingFeature.icon_url || null,
        sort_order: Number(editingFeature.sort_order) || 1,
        is_active: editingFeature.is_active ?? true,
        updated_at: new Date().toISOString(),
      };

      const isUuid =
        editingFeature.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          editingFeature.id
        );

      if (isUuid) {
        const { data, error } = await (supabase.from("features") as any)
          .update(payload)
          .eq("id", editingFeature.id)
          .select()
          .single();

        if (error) throw error;

        setFeatures((prev) =>
          prev.map((f) => (f.id === editingFeature.id ? (data as Feature) : f))
        );
        setStatusMsg({
          type: "success",
          text: `Feature "${payload.title}" updated successfully!`,
        });
      } else {
        payload.created_at = new Date().toISOString();
        const { data, error } = await (supabase.from("features") as any)
          .insert(payload)
          .select()
          .single();

        if (error) throw error;

        setFeatures((prev) => [...prev, data as Feature]);
        setStatusMsg({
          type: "success",
          text: `Feature "${payload.title}" added successfully!`,
        });
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error saving feature:", err);
      setStatusMsg({
        type: "error",
        text: err.message || "Failed to save feature",
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
          .from("features")
          .delete()
          .eq("id", deleteTarget.id);

        if (error) throw error;
      }

      setFeatures((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      setStatusMsg({
        type: "success",
        text: `Feature "${deleteTarget.title}" deleted.`,
      });
    } catch (err: any) {
      console.error("Error deleting feature:", err);
      setStatusMsg({
        type: "error",
        text: err.message || "Failed to delete feature",
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
          title="Why Choose Us Features"
          subtitle="Manage value propositions and service guarantee cards displayed across the storefront"
        />
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-[#FF6A00] shadow-md shadow-[#FF5A00]/25 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Feature</span>
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
          {features.map((feat, idx) => (
            <div
              key={feat.id || idx}
              className={`rounded-2xl bg-white border ${
                feat.is_active ? "border-gray-200/80" : "border-gray-200 opacity-60"
              } p-6 flex flex-col justify-between space-y-4 hover:border-[#FF5A00]/50 hover:shadow-md transition-all shadow-xs`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5A00] flex items-center justify-center font-bold text-sm border border-orange-100">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    #{feat.sort_order}
                  </span>
                </div>

                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                  {feat.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(feat)}
                  className="p-1.5 rounded-lg bg-orange-50 hover:bg-[#FF5A00] text-[#FF5A00] hover:text-white transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(feat)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && editingFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-base font-black uppercase text-gray-900 tracking-wide">
                {editingFeature.id ? "Edit Feature" : "Add Brand Feature"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFeature} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Feature Title <span className="text-[#FF5A00]">*</span>
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
                  placeholder="e.g. Dedicated RC specialists for calibration..."
                  value={editingFeature.description || ""}
                  onChange={(e) =>
                    setEditingFeature({
                      ...editingFeature,
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
                    value={editingFeature.sort_order ?? 1}
                    onChange={(e) =>
                      setEditingFeature({
                        ...editingFeature,
                        sort_order: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={editingFeature.is_active ?? true}
                      onChange={(e) =>
                        setEditingFeature({
                          ...editingFeature,
                          is_active: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-[#FF5A00] accent-[#FF5A00] rounded"
                    />
                    <span className="text-xs font-bold uppercase text-gray-800">
                      Active Visible
                    </span>
                  </label>
                </div>
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
                    <span>Save Feature</span>
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
        title="Delete Feature"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
