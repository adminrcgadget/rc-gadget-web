"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { createClient } from "@/lib/supabase/client";
import { SocialLink } from "@/types/database";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  Share2,
  X,
  ExternalLink,
} from "lucide-react";
import { renderSocialBrandIcon } from "@/components/ui/SocialIcons";

export default function AdminSocialPage() {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<Partial<SocialLink> | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<SocialLink | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();

  const fetchSocials = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .order("sort_order", { ascending: true });

      if (data && data.length > 0) {
        setSocials(data as SocialLink[]);
      } else {
        setSocials([
          {
            id: "soc-1",
            platform: "Instagram",
            label: "@rc_gadgetsstore",
            url: "https://www.instagram.com/rc_gadgetsstore/",
            icon: "Instagram",
            sort_order: 1,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "soc-2",
            platform: "Facebook",
            label: "RC Gadgets Official",
            url: "https://www.facebook.com/share/19FeP3z6KV/",
            icon: "Facebook",
            sort_order: 2,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "soc-3",
            platform: "YouTube",
            label: "RC Gadgets Motors",
            url: "https://www.youtube.com",
            icon: "YouTube",
            sort_order: 3,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "soc-4",
            platform: "WhatsApp",
            label: "+91 75 101 101 55",
            url: "https://wa.me/917510110155",
            icon: "WhatsApp",
            sort_order: 4,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
        ]);
      }
    } catch (err) {
      console.error("Error fetching social links:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  const handleOpenAdd = () => {
    setEditingSocial({
      platform: "",
      label: "",
      url: "",
      icon: "Instagram",
      sort_order: socials.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
    setStatusMsg(null);
  };

  const handleOpenEdit = (soc: SocialLink) => {
    setEditingSocial({ ...soc });
    setIsModalOpen(true);
    setStatusMsg(null);
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSocial || !editingSocial.platform || !editingSocial.url) return;

    setIsSaving(true);
    setStatusMsg(null);

    try {
      const payload: any = {
        platform: editingSocial.platform.trim(),
        label: editingSocial.label?.trim() || editingSocial.platform.trim(),
        url: editingSocial.url.trim(),
        icon: editingSocial.icon || editingSocial.platform.trim(),
        sort_order: Number(editingSocial.sort_order) || 1,
        is_active: editingSocial.is_active ?? true,
        updated_at: new Date().toISOString(),
      };

      const isUuid =
        editingSocial.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          editingSocial.id
        );

      if (isUuid) {
        const { data, error } = await (supabase.from("social_links") as any)
          .update(payload)
          .eq("id", editingSocial.id)
          .select()
          .single();

        if (error) throw error;

        setSocials((prev) =>
          prev.map((s) => (s.id === editingSocial.id ? (data as SocialLink) : s))
        );
        setStatusMsg({
          type: "success",
          text: `Social link "${payload.platform}" updated successfully!`,
        });
      } else {
        payload.created_at = new Date().toISOString();
        const { data, error } = await (supabase.from("social_links") as any)
          .insert(payload)
          .select()
          .single();

        if (error) throw error;

        setSocials((prev) => [...prev, data as SocialLink]);
        setStatusMsg({
          type: "success",
          text: `Social link "${payload.platform}" added successfully!`,
        });
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error saving social link:", err);
      setStatusMsg({
        type: "error",
        text: err.message || "Failed to save social link",
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
          .from("social_links")
          .delete()
          .eq("id", deleteTarget.id);

        if (error) throw error;
      }

      setSocials((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setStatusMsg({
        type: "success",
        text: `Social link "${deleteTarget.platform}" deleted.`,
      });
    } catch (err: any) {
      console.error("Error deleting social link:", err);
      setStatusMsg({
        type: "error",
        text: err.message || "Failed to delete social link",
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
          title="Social Channels &amp; Links"
          subtitle="Manage official Instagram, YouTube, Facebook, WhatsApp, and social media feeds"
        />
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-[#FF6A00] shadow-md shadow-[#FF5A00]/25 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Social Channel</span>
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
          {socials.map((soc, idx) => (
            <div
              key={soc.id || idx}
              className={`rounded-2xl bg-white border ${
                soc.is_active ? "border-gray-200/80" : "border-gray-200 opacity-60"
              } p-6 flex flex-col justify-between space-y-4 hover:border-[#FF5A00]/50 hover:shadow-md transition-all shadow-xs`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5A00] flex items-center justify-center font-bold text-sm border border-orange-100">
                    {renderSocialBrandIcon(soc.platform, "w-5 h-5")}
                  </div>
                  <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    #{soc.sort_order}
                  </span>
                </div>

                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                  {soc.platform}
                </h3>
                <p className="text-xs text-gray-500 font-medium truncate">
                  {soc.label}
                </p>

                <a
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#FF5A00] hover:underline flex items-center gap-1 mt-2 truncate"
                >
                  <span className="truncate">{soc.url}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(soc)}
                  className="p-1.5 rounded-lg bg-orange-50 hover:bg-[#FF5A00] text-[#FF5A00] hover:text-white transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(soc)}
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
      {isModalOpen && editingSocial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-base font-black uppercase text-gray-900 tracking-wide">
                {editingSocial.id ? "Edit Social Channel" : "Add Social Channel"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSocial} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Platform Name <span className="text-[#FF5A00]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Instagram, Facebook, YouTube, WhatsApp"
                  value={editingSocial.platform || ""}
                  onChange={(e) =>
                    setEditingSocial({
                      ...editingSocial,
                      platform: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Display Handle / Label <span className="text-[#FF5A00]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. @rc_gadgetsstore"
                  value={editingSocial.label || ""}
                  onChange={(e) =>
                    setEditingSocial({
                      ...editingSocial,
                      label: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Channel URL <span className="text-[#FF5A00]">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://instagram.com/..."
                  value={editingSocial.url || ""}
                  onChange={(e) =>
                    setEditingSocial({
                      ...editingSocial,
                      url: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingSocial.sort_order ?? 1}
                    onChange={(e) =>
                      setEditingSocial({
                        ...editingSocial,
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
                      checked={editingSocial.is_active ?? true}
                      onChange={(e) =>
                        setEditingSocial({
                          ...editingSocial,
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
                    <span>Save Channel</span>
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
        title="Delete Social Channel"
        message={`Are you sure you want to delete "${deleteTarget?.platform}"?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
