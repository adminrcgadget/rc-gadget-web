"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { createClient } from "@/lib/supabase/client";
import { NavigationItem } from "@/types/database";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  Menu as MenuIcon,
  X,
} from "lucide-react";

export default function AdminNavigationPage() {
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<NavigationItem> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<NavigationItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();

  const fetchNavItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("navigation_items")
        .select("*")
        .order("sort_order", { ascending: true });

      if (data && data.length > 0) {
        setNavItems(data as NavigationItem[]);
      } else {
        setNavItems([
          { id: "1", label: "Home", href: "#hero", sort_order: 1, is_visible: true, created_at: "", updated_at: "" },
          { id: "2", label: "Our World", href: "#our-world", sort_order: 2, is_visible: true, created_at: "", updated_at: "" },
          { id: "3", label: "Coming Soon", href: "#coming-soon", sort_order: 3, is_visible: true, created_at: "", updated_at: "" },
          { id: "4", label: "About Us", href: "#about", sort_order: 4, is_visible: true, created_at: "", updated_at: "" },
          { id: "5", label: "Features", href: "#features", sort_order: 5, is_visible: true, created_at: "", updated_at: "" },
          { id: "6", label: "Experience", href: "#experience", sort_order: 6, is_visible: true, created_at: "", updated_at: "" },
          { id: "7", label: "Contact", href: "#contact", sort_order: 7, is_visible: true, created_at: "", updated_at: "" },
        ]);
      }
    } catch (err) {
      console.error("Error fetching navigation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNavItems();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem({
      label: "",
      href: "#",
      sort_order: (navItems.length + 1) * 1,
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: NavigationItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.label || !editingItem.href) return;

    setIsSaving(true);
    setStatusMsg(null);

    try {
      const payload: any = {
        ...editingItem,
        updated_at: new Date().toISOString(),
      };

      const isUuid = payload.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.id);
      if (!isUuid) {
        delete payload.id;
      }

      const { error } = await supabase.from("navigation_items").upsert(payload).select();

      if (error) {
        throw error;
      }

      setStatusMsg({ type: "success", text: "Navigation item saved successfully!" });
      await fetchNavItems();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error saving navigation item:", err);
      setStatusMsg({ type: "error", text: err.message || "Failed to save navigation item" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await supabase.from("navigation_items").delete().eq("id", deleteTarget.id);
      setNavItems((prev) => prev.filter((n) => n.id !== deleteTarget.id));
      setStatusMsg({ type: "success", text: "Navigation item deleted successfully." });
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to delete navigation item" });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Navigation Menu Items"
        subtitle="Manage website header and footer menu anchors, labels, order, and visibility"
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
          <MenuIcon className="w-4 h-4 text-[#FF5500]" />
          <span>{navItems.length} Menu Items</span>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-[#FF5500] hover:bg-[#FF6A1A] shadow-lg shadow-[#FF5500]/25 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Table List */}
      {isLoading ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#FF5500] animate-spin" />
        </div>
      ) : (
        <div className="rounded-3xl bg-[#0E0E0E] border border-white/10 overflow-hidden shadow-2xl">
          <div className="divide-y divide-white/5">
            {navItems.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-white/5 text-zinc-400 text-xs font-black flex items-center justify-center">
                    {item.sort_order}
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wide">
                      {item.label}
                    </h4>
                    <span className="text-xs text-zinc-500 font-mono">
                      {item.href}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      item.is_visible
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {item.is_visible ? "Visible" : "Hidden"}
                  </span>

                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-[#141414] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-black uppercase text-white tracking-wide">
                {editingItem.id ? "Edit Menu Item" : "Add Menu Item"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Menu Label <span className="text-[#FF5500]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Our World"
                  value={editingItem.label || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, label: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Target Anchor / URL <span className="text-[#FF5500]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. #our-world"
                  value={editingItem.href || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, href: e.target.value })
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
                    value={editingItem.sort_order ?? 1}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
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
                      checked={editingItem.is_visible ?? true}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          is_visible: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-[#FF5500] accent-[#FF5500] rounded"
                    />
                    <span className="text-xs font-bold uppercase text-zinc-300">
                      Visible
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
                  {isSaving ? "Saving..." : "Save Item"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Menu Item"
        message={`Are you sure you want to delete menu item "${deleteTarget?.label}"?`}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
