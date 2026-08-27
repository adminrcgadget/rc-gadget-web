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
  Smartphone,
  Monitor,
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
          title: dbBanners[0]?.title || "Banner Slot 1",
          subtitle: dbBanners[0]?.subtitle || "",
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
          title: dbBanners[1]?.title || "Banner Slot 2",
          subtitle: dbBanners[1]?.subtitle || "",
          description: dbBanners[1]?.description || "",
          image_url: dbBanners[1]?.image_url || null,
          desktop_image_url: dbBanners[1]?.desktop_image_url || null,
          mobile_image_url: dbBanners[1]?.mobile_image_url || null,
          button_text: dbBanners[1]?.button_text || "SHOP DEALS",
          button_url: dbBanners[1]?.button_url || "#featured-products",
          position: "featured",
          is_active: dbBanners[1]?.is_active ?? true,
          sort_order: 2,
          created_at: "",
          updated_at: "",
        },
        {
          id: dbBanners[2]?.id || "slot-3",
          title: dbBanners[2]?.title || "Banner Slot 3",
          subtitle: dbBanners[2]?.subtitle || "",
          description: dbBanners[2]?.description || "",
          image_url: dbBanners[2]?.image_url || null,
          desktop_image_url: dbBanners[2]?.desktop_image_url || null,
          mobile_image_url: dbBanners[2]?.mobile_image_url || null,
          button_text: dbBanners[2]?.button_text || "LEARN MORE",
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
    const banner = banners[index];
    if (!banner) return;

    setSavingSlot(index);
    setStatusMsg(null);

    try {
      const payload: any = {
        title: banner.title || `Promo Banner ${index + 1}`,
        subtitle: banner.subtitle || "",
        description: banner.description || "",
        desktop_image_url:
          typeof banner.desktop_image_url === "string" &&
          banner.desktop_image_url.trim().length > 0
            ? banner.desktop_image_url.trim()
            : null,
        mobile_image_url:
          typeof banner.mobile_image_url === "string" &&
          banner.mobile_image_url.trim().length > 0
            ? banner.mobile_image_url.trim()
            : null,
        image_url:
          banner.desktop_image_url || banner.mobile_image_url || null,
        button_text: banner.button_text || "EXPLORE NOW",
        button_url: banner.button_url || "#featured-products",
        position: "featured",
        is_active: banner.is_active ?? true,
        sort_order: index + 1,
        updated_at: new Date().toISOString(),
      };

      const isUuid =
        banner.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          banner.id
        );

      if (isUuid) {
        payload.id = banner.id;
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
        text: `Banner Slot ${index + 1} published live to storefront!`,
      });
    } catch (err: any) {
      console.error("Error saving banner:", err);
      setStatusMsg({
        type: "error",
        text: err.message || `Failed to save banner slot ${index + 1}`,
      });
    } finally {
      setSavingSlot(null);
    }
  };

  const updateBannerField = (
    index: number,
    field: keyof Banner,
    value: any
  ) => {
    setBanners((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <AdminHeader
        title="3 Promotional Banners"
        subtitle="Manage the 3 graphic promotional banners displayed directly below the featured products section"
      />

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {banners.map((banner, index) => {
            const hasImage = Boolean(
              banner.desktop_image_url || banner.mobile_image_url
            );

            return (
              <div
                key={banner.id || index}
                className="rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow p-6 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-5">
                  {/* Slot Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-orange-50 text-[#FF5A00] font-black text-xs flex items-center justify-center border border-orange-100">
                        {index + 1}
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">
                        Banner Slot {index + 1}
                      </h3>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        hasImage
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {hasImage ? "Active Image" : "Empty Slot"}
                    </span>
                  </div>

                  {/* Desktop Image Uploader */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                      <Monitor className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>Desktop Banner Image</span>
                    </div>
                    <ImageUploader
                      folder="banners"
                      currentUrl={banner.desktop_image_url}
                      onUploadSuccess={(url) => {
                        updateBannerField(index, "desktop_image_url", url);
                        if (!banner.mobile_image_url) {
                          updateBannerField(index, "mobile_image_url", url);
                        }
                      }}
                      onRemove={() => {
                        updateBannerField(index, "desktop_image_url", null);
                      }}
                    />
                  </div>

                  {/* Mobile Image Uploader */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                      <Smartphone className="w-3.5 h-3.5 text-[#FF5A00]" />
                      <span>Mobile Banner Image (Optional)</span>
                    </div>
                    <ImageUploader
                      folder="banners"
                      currentUrl={banner.mobile_image_url}
                      onUploadSuccess={(url) => {
                        updateBannerField(index, "mobile_image_url", url);
                      }}
                      onRemove={() => {
                        updateBannerField(index, "mobile_image_url", null);
                      }}
                    />
                  </div>

                  {/* Settings */}
                  <div className="space-y-4 pt-2 border-t border-gray-100">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                        Banner Title / Label
                      </label>
                      <input
                        type="text"
                        value={banner.title || ""}
                        onChange={(e) =>
                          updateBannerField(index, "title", e.target.value)
                        }
                        placeholder={`Banner ${index + 1} Title`}
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-xs outline-none focus:border-[#FF5A00] focus:bg-white transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                        Target Link / Action URL
                      </label>
                      <input
                        type="text"
                        value={banner.button_url || ""}
                        onChange={(e) =>
                          updateBannerField(index, "button_url", e.target.value)
                        }
                        placeholder="#featured-products"
                        className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-xs outline-none focus:border-[#FF5A00] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="button"
                  disabled={savingSlot === index}
                  onClick={() => handleSaveSlot(index)}
                  className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-[#FF6A00] shadow-md shadow-[#FF5A00]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingSlot === index ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Slot {index + 1}...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save &amp; Publish Slot {index + 1}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
