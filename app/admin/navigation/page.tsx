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
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<NavigationItem> | null>(
    null
  );
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
          {
            id: "1",
            label: "Home",
            href: "#hero",
            sort_order: 1,
            is_visible: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "2",
            label: "Our World",
            href: "#our-world",
            sort_order: 2,
            is_visible: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "3",
            label: "Coming Soon",
            href: "#coming-soon",
            sort_order: 3,
            is_visible: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "4",
            label: "About",
            href: "#about",
            sort_order: 4,
            is_visible: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "6",
            label: "Experience",
            href: "#experience",
            sort_order: 5,
            is_visible: true,
            created_at: "",
            updated_at: "",
          },
          {
            id: "7",
            label: "Contact",
            href: "#contact",
            sort_order: 6,
            is_visible: true,
            created_at: "",
            updated_at: "",
          },
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
      sort_order: navItems.length + 1,
      is_visible: true,
    });
    setIsModalOpen(true);
    setStatusMsg(null);
  };

  const handleOpenEdit = (item: NavigationItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
    setStatusMsg(null);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.label) return;

    setIsSaving(true);
    setStatusMsg(null);

    try {
      const payload: any = {
        label: editingItem.label.trim(),
        href: editingItem.href?.trim() || "#",
        sort_order: Number(editingItem.sort_order) || 1,
        is_visible: editingItem.is_visible ?? true,
        updated_at: new Date().toISOString(),
      };

      const isUuid =
        editingItem.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          editingItem.id
        );

      if (isUuid) {
        const { data, error } = await (supabase.from("navigation_items") as any)
          .update(payload)
          .eq("id", editingItem.id)
          .select()
          .single();

        if (error) throw error;

        setNavItems((prev) =>
          prev.map((n) =>
            n.id === editingItem.id ? (data as NavigationItem) : n
          )
        );
        setStatusMsg({
          type: "success",
          text: `Nav link "${payload.label}" updated successfully!`,
        });
      } else {
        payload.created_at = new Date().toISOString();
        const { data, error } = await (supabase.from("navigation_items") as any)
          .insert(payload)
          .select()
          .single();

        if (error) throw error;

        setNavItems((prev) => [...prev, data as NavigationItem]);
        setStatusMsg({
          type: "success",
          text: `Nav link "${payload.label}" added successfully!`,
        });
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error saving nav link:", err);
      setStatusMsg({
        type: "error",
        text: err.message || "Failed to save nav link",
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
          .from("navigation_items")
          .delete()
          .eq("id", deleteTarget.id);

        if (error) throw error;
      }

      setNavItems((prev) => prev.filter((n) => n.id !== deleteTarget.id));
      setStatusMsg({
        type: "success",
        text: `Menu item "${deleteTarget.label}" deleted.`,
      });
    } catch (err: any) {
      console.error("Error deleting menu item:", err);
      setStatusMsg({
        type: "error",
        text: err.message || "Failed to delete menu item",
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
          title="Navigation Menu Items"
          subtitle="Configure header navigation links, reorder menu items, and control visibility"
        />
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-[#FF6A00] shadow-md shadow-[#FF5A00]/25 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Item</span>
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
        <div className="rounded-2xl bg-white border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">
              Header Menu Links ({navItems.length})
            </h3>
            <span className="text-xs text-gray-500 font-medium">
              Drag or set sort order to reorder
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {navItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-gray-50/70 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A00] flex items-center justify-center font-bold text-xs border border-orange-100">
                    {item.sort_order}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      {item.label}
                    </h4>
                    <span className="text-xs text-gray-500 font-medium">
                      {item.href}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      item.is_visible
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.is_visible ? "Visible" : "Hidden"}
                  </span>

                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-lg bg-orange-50 hover:bg-[#FF5A00] text-[#FF5A00] hover:text-white transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-base font-black uppercase text-gray-900 tracking-wide">
                {editingItem.id ? "Edit Menu Item" : "Add Menu Item"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Menu Label <span className="text-[#FF5A00]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Our World"
                  value={editingItem.label || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, label: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Target Anchor / URL <span className="text-[#FF5A00]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. #our-world"
                  value={editingItem.href || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, href: e.target.value })
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
                    value={editingItem.sort_order ?? 1}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
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
                      checked={editingItem.is_visible ?? true}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          is_visible: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-[#FF5A00] accent-[#FF5A00] rounded"
                    />
                    <span className="text-xs font-bold uppercase text-gray-800">
                      Visible
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
                  className="px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-[#FF6A00] shadow-md shadow-[#FF5A00]/25 transition-all disabled:opacity-50 cursor-pointer"
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
        message={`Are you sure you want to delete "${deleteTarget?.label}"?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
