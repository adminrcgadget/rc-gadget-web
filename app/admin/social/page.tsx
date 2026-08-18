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
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<Partial<SocialLink> | null>(null);
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
            label: "RC Gadgets Store",
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
            label: "RC Gadgets Official",
            url: "https://www.youtube.com",
            icon: "Youtube",
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
            icon: "MessageCircle",
            sort_order: 4,
            is_active: true,
            created_at: "",
            updated_at: "",
          },
        ]);
      }
    } catch (err) {
      console.error("Error fetching socials:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  const handleOpenAdd = () => {
    setEditingSocial({
      platform: "Instagram",
      label: "",
      url: "",
      sort_order: (socials.length + 1) * 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (soc: SocialLink) => {
    setEditingSocial({ ...soc });
    setIsModalOpen(true);
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSocial || !editingSocial.platform || !editingSocial.url) return;

    setIsSaving(true);
    setStatusMsg(null);

    try {
      const payload = {
        ...editingSocial,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("social_links").upsert(payload as any);

      if (error) {
        setSocials((prev) => {
          if (editingSocial.id) {
            return prev.map((s) => (s.id === editingSocial.id ? ({ ...s, ...editingSocial } as SocialLink) : s));
          } else {
            return [...prev, { ...editingSocial, id: `soc-${Date.now()}` } as SocialLink];
          }
        });
        setStatusMsg({ type: "success", text: "Social link updated locally." });
      } else {
        setStatusMsg({ type: "success", text: "Social link saved successfully!" });
        await fetchSocials();
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to save social link" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await supabase.from("social_links").delete().eq("id", deleteTarget.id);
      setSocials((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setStatusMsg({ type: "success", text: "Social link deleted successfully." });
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to delete social link" });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Social Media & Direct Channels"
        subtitle="Manage brand channels including Instagram, Facebook, YouTube, WhatsApp, and external links"
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
          <Share2 className="w-4 h-4 text-[#FF5500]" />
          <span>{socials.length} Connected Platforms</span>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-[#FF5500] hover:bg-[#FF6A1A] shadow-lg shadow-[#FF5500]/25 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Social Channel</span>
        </button>
      </div>

      {/* Social List Grid */}
      {isLoading ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#FF5500] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {socials.map((soc, idx) => (
            <div
              key={soc.id || idx}
              className="rounded-3xl bg-[#0E0E0E] border border-white/10 p-6 flex flex-col justify-between space-y-4 hover:border-[#FF5500]/50 transition-all shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5500]">
                    {renderSocialBrandIcon(soc.platform, "w-5 h-5")}
                  </div>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    #{soc.sort_order}
                  </span>
                </div>

                <h3 className="text-base font-black text-white uppercase tracking-wide">
                  {soc.platform}
                </h3>
                <p className="text-xs text-zinc-400 font-semibold mt-0.5">
                  {soc.label}
                </p>
                <a
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#FF5500] hover:underline flex items-center gap-1 mt-2 truncate"
                >
                  <span className="truncate">{soc.url}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(soc)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(soc)}
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
      {isModalOpen && editingSocial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-[#141414] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-black uppercase text-white tracking-wide">
                {editingSocial.id ? "Edit Social Channel" : "Add Social Channel"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSocial} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Platform Name <span className="text-[#FF5500]">*</span>
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
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Display Handle / Label <span className="text-[#FF5500]">*</span>
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
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Channel URL <span className="text-[#FF5500]">*</span>
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
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
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
                    className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-3">
                    <input
                      type="checkbox"
                      checked={editingSocial.is_active ?? true}
                      onChange={(e) =>
                        setEditingSocial({
                          ...editingSocial,
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
                  {isSaving ? "Saving..." : "Save Channel"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Social Channel"
        message={`Are you sure you want to delete channel "${deleteTarget?.platform}"?`}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
