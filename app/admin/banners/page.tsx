"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { createClient } from "@/lib/supabase/client";
import { Banner } from "@/types/database";
import {
  Save,
  Check,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingSlot, setSavingSlot] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const supabase = createClient();

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("sort_order", { ascending: true });

      const dbBanners = (data || []) as any[];
      const slots: Banner[] = [
        {
          id: dbBanners[0]?.id || "slot-1",
          title: dbBanners[0]?.title || "NEW ARRIVALS",
          subtitle: dbBanners[0]?.subtitle || "Latest RC models just landed",
          description: dbBanners[0]?.description || "",
          image_url: dbBanners[0]?.image_url || null,
          desktop_image_url: dbBanners[0]?.desktop_image_url || null,
          mobile_image_url: dbBanners[0]?.mobile_image_url || null,
          button_text: dbBanners[0]?.button_text || "EXPLORE NOW",
          button_url: dbBanners[0]?.button_url || "#featured-products",
          position: "featured",
          is_active: dbBanners[0]?.is_active ?? true,
          sort_order: 1,
          created_at: "",
          updated_at: "",
        },
        {
          id: dbBanners[1]?.id || "slot-2",
          title: dbBanners[1]?.title || "UP TO 20% OFF",
          subtitle: dbBanners[1]?.subtitle || "On selected RC Accessories",
          description: dbBanners[1]?.description || "",
          image_url: dbBanners[1]?.image_url || null,
          desktop_image_url: dbBanners[1]?.desktop_image_url || null,
          mobile_image_url: dbBanners[1]?.mobile_image_url || null,
          button_text: dbBanners[1]?.button_text || "SHOP ACCESSORIES",
          button_url: dbBanners[1]?.button_url || "#featured-products",
          position: "featured",
          is_active: dbBanners[1]?.is_active ?? true,
          sort_order: 2,
          created_at: "",
          updated_at: "",
        },
        {
          id: dbBanners[2]?.id || "slot-3",
          title: dbBanners[2]?.title || "TRACKS & EXPERIENCE",
          subtitle: dbBanners[2]?.subtitle || "Visit our RC tracks & experience the thrill",
          description: dbBanners[2]?.description || "",
          image_url: dbBanners[2]?.image_url || null,
          desktop_image_url: dbBanners[2]?.desktop_image_url || null,
          mobile_image_url: dbBanners[2]?.mobile_image_url || null,
          button_text: dbBanners[2]?.button_text || "BOOK TRACK TIME",
          button_url: dbBanners[2]?.button_url || "#experience",
          position: "featured",
          is_active: dbBanners[2]?.is_active ?? true,
          sort_order: 3,
          created_at: "",
          updated_at: "",
        },
      ];

      setBanners(slots);
    } catch (err) {
      console.error("Error fetching banners:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSaveSlot = async (index: number) => {
    const slot = banners[index];
    if (!slot) return;

    setSavingSlot(index);
    setStatusMsg(null);

    try {
      const payload: any = {
        title: slot.title || `Banner Slot ${index + 1}`,
        subtitle: slot.subtitle || "",
        description: slot.description || "",
        image_url: slot.image_url || null,
        desktop_image_url: slot.desktop_image_url || slot.image_url || null,
        mobile_image_url: slot.mobile_image_url || slot.image_url || null,
        button_text: slot.button_text || "EXPLORE NOW",
        button_url: slot.button_url || "#featured-products",
        position: "featured",
        is_active: slot.is_active ?? true,
        sort_order: index + 1,
        updated_at: new Date().toISOString(),
      };

      const isUuid =
        slot.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          slot.id
        );

      if (isUuid) {
        payload.id = slot.id;
        const { error } = await (supabase.from("banners") as any)
          .upsert(payload)
          .select();
        if (error) throw error;
      } else {
        const { data, error } = await (supabase.from("banners") as any)
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        if (data) {
          setBanners((prev) =>
            prev.map((b, i) => (i === index ? { ...b, id: data.id } : b))
          );
        }
      }

      setStatusMsg({
        type: "success",
        text: `Banner Slot ${index + 1} (${slot.title}) saved and published live!`,
      });
    } catch (err: any) {
      console.error("Error saving banner slot:", err);
      setStatusMsg({
        type: "error",
        text: err.message || `Failed to save Banner Slot ${index + 1}`,
      });
    } finally {
      setSavingSlot(null);
    }
  };

  const updateBannerState = (index: number, updates: Partial<Banner>) => {
    setBanners((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...updates } : item))
    );
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        title="3 Promotional Banner Slots Management"
        subtitle="Upload your custom full-photo creatives, separate mobile banners, and configure direct action links for the 3 slots under Featured Products"
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

      {isLoading ? (
        <div className="p-16 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#FF5500] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {banners.map((banner, idx) => {
            const isSaving = savingSlot === idx;

            return (
              <div
                key={banner.id || idx}
                className="rounded-3xl bg-[#0E0E0E] border border-white/10 p-6 flex flex-col justify-between space-y-6 shadow-2xl hover:border-[#FF5500]/40 transition-all"
              >
                <div className="space-y-5">
                  {/* Slot Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#FF5500]/20 text-[#FF5500] font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-white">
                        Banner Slot {idx + 1}
                      </h3>
                    </div>

                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      Live on Homepage
                    </span>
                  </div>

                  {/* Desktop Banner Image Upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-zinc-300 block flex items-center justify-between">
                      <span>Desktop Banner Image (Aspect 16:7)</span>
                    </label>
                    <ImageUploader
                      label=""
                      folder="promos"
                      currentUrl={banner.image_url}
                      onUploadSuccess={(url) =>
                        updateBannerState(idx, {
                          image_url: url,
                          desktop_image_url: url,
                        })
                      }
                      onRemove={() =>
                        updateBannerState(idx, {
                          image_url: null,
                          desktop_image_url: null,
                        })
                      }
                    />
                  </div>

                  {/* Mobile Banner Image Upload (Optional) */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <label className="text-xs font-black uppercase tracking-wider text-zinc-400 block">
                      Mobile Banner Image (Optional)
                    </label>
                    <ImageUploader
                      label=""
                      folder="promos"
                      currentUrl={banner.mobile_image_url}
                      onUploadSuccess={(url) =>
                        updateBannerState(idx, { mobile_image_url: url })
                      }
                      onRemove={() =>
                        updateBannerState(idx, { mobile_image_url: null })
                      }
                    />
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                      Banner Title / Tag
                    </label>
                    <input
                      type="text"
                      value={banner.title || ""}
                      onChange={(e) =>
                        updateBannerState(idx, { title: e.target.value })
                      }
                      placeholder="e.g. NEW ARRIVALS / UP TO 20% OFF"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white text-xs outline-none focus:border-[#FF5500]"
                    />
                  </div>

                  {/* Destination Link */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                      Destination Link / Target URL
                    </label>
                    <input
                      type="text"
                      value={banner.button_url || ""}
                      onChange={(e) =>
                        updateBannerState(idx, { button_url: e.target.value })
                      }
                      placeholder="e.g. #featured-products or #experience"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white text-xs outline-none focus:border-[#FF5500]"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-white/10">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleSaveSlot(idx)}
                    className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-[#FF5500] hover:bg-[#FF6A1A] shadow-lg shadow-[#FF5500]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Publishing Slot {idx + 1}...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save &amp; Publish Slot {idx + 1}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
