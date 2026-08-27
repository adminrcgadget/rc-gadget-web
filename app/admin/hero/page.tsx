"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { createClient } from "@/lib/supabase/client";
import { HeroSection } from "@/types/database";
import {
  Save,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  Smartphone,
  Monitor,
  Eye,
} from "lucide-react";

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<HeroSection[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [savingSlide, setSavingSlide] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const supabase = createClient();

  const fetchHeroSlides = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("hero_section")
        .select("*")
        .order("created_at", { ascending: true });

      const dbSlides = (data || []) as any[];

      const threeSlides: HeroSection[] = [
        {
          id: dbSlides[0]?.id || "slide-1",
          heading_line_1: dbSlides[0]?.heading_line_1 || "Hero Slide 1",
          heading_line_2: dbSlides[0]?.heading_line_2 || "REMOTE",
          heading_line_3: dbSlides[0]?.heading_line_3 || "CONTROL",
          eyebrow: dbSlides[0]?.eyebrow || "KOTTAKKAL — FIRST IN MALAPPURAM",
          description: dbSlides[0]?.description || "",
          highlighted_text: "FULL_BANNER",
          primary_button_text: dbSlides[0]?.primary_button_text || "SHOP NOW",
          primary_button_url:
            dbSlides[0]?.primary_button_url || "#shop-by-category",
          secondary_button_text: dbSlides[0]?.secondary_button_text || "CONTACT US",
          secondary_button_url: dbSlides[0]?.secondary_button_url || "#contact",
          background_image_url: dbSlides[0]?.background_image_url || null,
          foreground_image_url: dbSlides[0]?.foreground_image_url || null,
          is_active: dbSlides[0]?.is_active ?? true,
          created_at: dbSlides[0]?.created_at || new Date().toISOString(),
          updated_at: dbSlides[0]?.updated_at || new Date().toISOString(),
        },
        {
          id: dbSlides[1]?.id || "slide-2",
          heading_line_1: dbSlides[1]?.heading_line_1 || "Hero Slide 2",
          heading_line_2: dbSlides[1]?.heading_line_2 || "PRO SPEED",
          heading_line_3: dbSlides[1]?.heading_line_3 || "TRACKS",
          eyebrow: dbSlides[1]?.eyebrow || "EXPERIENCE THE THRILL",
          description: dbSlides[1]?.description || "",
          highlighted_text: "FULL_BANNER",
          primary_button_text: dbSlides[1]?.primary_button_text || "EXPLORE TRACKS",
          primary_button_url: dbSlides[1]?.primary_button_url || "#experience",
          secondary_button_text: dbSlides[1]?.secondary_button_text || "CONTACT US",
          secondary_button_url: dbSlides[1]?.secondary_button_url || "#contact",
          background_image_url: dbSlides[1]?.background_image_url || null,
          foreground_image_url: dbSlides[1]?.foreground_image_url || null,
          is_active: dbSlides[1]?.is_active ?? true,
          created_at: dbSlides[1]?.created_at || new Date(Date.now() + 1000).toISOString(),
          updated_at: dbSlides[1]?.updated_at || new Date().toISOString(),
        },
        {
          id: dbSlides[2]?.id || "slide-3",
          heading_line_1: dbSlides[2]?.heading_line_1 || "Hero Slide 3",
          heading_line_2: dbSlides[2]?.heading_line_2 || "NEW HOBBY",
          heading_line_3: dbSlides[2]?.heading_line_3 || "ARRIVALS",
          eyebrow: dbSlides[2]?.eyebrow || "FIRST IN MALAPPURAM",
          description: dbSlides[2]?.description || "",
          highlighted_text: "FULL_BANNER",
          primary_button_text: dbSlides[2]?.primary_button_text || "VIEW PRODUCTS",
          primary_button_url: dbSlides[2]?.primary_button_url || "#featured-products",
          secondary_button_text: dbSlides[2]?.secondary_button_text || "GET IN TOUCH",
          secondary_button_url: dbSlides[2]?.secondary_button_url || "#contact",
          background_image_url: dbSlides[2]?.background_image_url || null,
          foreground_image_url: dbSlides[2]?.foreground_image_url || null,
          is_active: dbSlides[2]?.is_active ?? true,
          created_at: dbSlides[2]?.created_at || new Date(Date.now() + 2000).toISOString(),
          updated_at: dbSlides[2]?.updated_at || new Date().toISOString(),
        },
      ];

      setSlides(threeSlides);
    } catch (err) {
      console.error("Error fetching hero slides:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroSlides();
  }, []);

  const handleSaveSlide = async (index: number) => {
    const slide = slides[index];
    if (!slide) return;

    setSavingSlide(index);
    setStatusMsg(null);

    try {
      const payload: any = {
        heading_line_1: slide.heading_line_1 || `Hero Slide ${index + 1}`,
        heading_line_2: slide.heading_line_2 || "REMOTE",
        heading_line_3: slide.heading_line_3 || "CONTROL",
        eyebrow: slide.eyebrow || "KOTTAKKAL — FIRST IN MALAPPURAM",
        description: slide.description || "",
        highlighted_text: "FULL_BANNER",
        primary_button_text: slide.primary_button_text || "SHOP NOW",
        primary_button_url:
          typeof slide.primary_button_url === "string" &&
          slide.primary_button_url.trim().length > 0
            ? slide.primary_button_url.trim()
            : "#shop-by-category",
        secondary_button_text: slide.secondary_button_text || "CONTACT US",
        secondary_button_url: slide.secondary_button_url || "#contact",
        background_image_url:
          typeof slide.background_image_url === "string" &&
          slide.background_image_url.trim().length > 0
            ? slide.background_image_url.trim()
            : null,
        foreground_image_url:
          typeof slide.foreground_image_url === "string" &&
          slide.foreground_image_url.trim().length > 0
            ? slide.foreground_image_url.trim()
            : null,
        is_active: slide.is_active ?? true,
        updated_at: new Date().toISOString(),
      };

      const isUuid =
        slide.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          slide.id
        );

      if (isUuid) {
        payload.id = slide.id;
        const { error } = await (supabase.from("hero_section") as any)
          .upsert(payload)
          .select();
        if (error) throw error;
      } else {
        const { data, error } = await (supabase.from("hero_section") as any)
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        if (data) {
          setSlides((prev) =>
            prev.map((s, i) => (i === index ? { ...s, id: data.id } : s))
          );
        }
      }

      setStatusMsg({
        type: "success",
        text: `Hero Slide ${index + 1} saved and published live!`,
      });
    } catch (err: any) {
      console.error("Error saving hero slide:", err);
      setStatusMsg({
        type: "error",
        text: err.message || `Failed to save Hero Slide ${index + 1}`,
      });
    } finally {
      setSavingSlide(null);
    }
  };

  const updateSlideField = (
    index: number,
    field: keyof HeroSection,
    value: any
  ) => {
    setSlides((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    );
  };

  const currentSlide = slides[activeTab];

  return (
    <div className="space-y-8 animate-in fade-in">
      <AdminHeader
        title="Hero 3-Slide Auto Banner"
        subtitle="Manage your 3 rotating hero banners with separate desktop and mobile creative uploads, custom action links, and auto-play carousel support"
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
        <div className="space-y-8">
          {/* Slide Navigation Tabs */}
          <div className="flex items-center gap-3 border-b border-gray-200/80 pb-4 overflow-x-auto">
            {slides.map((slide, idx) => {
              const hasImg = Boolean(slide.background_image_url);
              const isActiveTab = activeTab === idx;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
                    isActiveTab
                      ? "bg-[#FF5A00] text-white shadow-md shadow-[#FF5A00]/25"
                      : "bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActiveTab
                        ? "bg-white text-[#FF5A00]"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span>Slide {idx + 1}</span>
                  {hasImg && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </button>
              );
            })}
          </div>

          {currentSlide && (
            <div className="space-y-8 animate-in fade-in">
              {/* Banner Uploaders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Desktop Hero Banner */}
                <div className="rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2 text-gray-900">
                        <Monitor className="w-4 h-4 text-[#FF5A00]" />
                        <h3 className="text-xs font-black uppercase tracking-wider">
                          Slide {activeTab + 1}: Desktop Hero Banner Image
                        </h3>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Full Width (Zero Crop)
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed">
                      Upload your designed desktop banner for Slide {activeTab + 1}. The storefront displays this banner with 100% natural width &amp; auto height without any cropping.
                    </p>

                    <ImageUploader
                      folder="hero"
                      currentUrl={currentSlide.background_image_url}
                      onUploadSuccess={(url) =>
                        updateSlideField(activeTab, "background_image_url", url)
                      }
                      onRemove={() =>
                        updateSlideField(activeTab, "background_image_url", null)
                      }
                    />
                  </div>
                </div>

                {/* Mobile Hero Banner */}
                <div className="rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2 text-gray-900">
                        <Smartphone className="w-4 h-4 text-[#FF5A00]" />
                        <h3 className="text-xs font-black uppercase tracking-wider">
                          Slide {activeTab + 1}: Mobile Banner Image (Optional)
                        </h3>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                        Phone Optimized
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed">
                      Optional dedicated mobile creative for Slide {activeTab + 1}. If left blank, the desktop banner will automatically scale down proportionally.
                    </p>

                    <ImageUploader
                      folder="hero"
                      currentUrl={currentSlide.foreground_image_url}
                      onUploadSuccess={(url) =>
                        updateSlideField(activeTab, "foreground_image_url", url)
                      }
                      onRemove={() =>
                        updateSlideField(activeTab, "foreground_image_url", null)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Destination Settings */}
              <div className="rounded-2xl bg-white border border-gray-200/80 shadow-xs p-6 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 border-l-2 border-[#FF5A00] pl-3">
                  Slide {activeTab + 1} Actions &amp; Destination Link
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Title / Alt Tag */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                      Slide Name / Alt Text
                    </label>
                    <input
                      type="text"
                      value={currentSlide.heading_line_1 || ""}
                      onChange={(e) =>
                        updateSlideField(activeTab, "heading_line_1", e.target.value)
                      }
                      placeholder={`Hero Slide ${activeTab + 1}`}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-xs outline-none focus:border-[#FF5A00] focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Target URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                      Destination Link (Target URL)
                    </label>
                    <input
                      type="text"
                      value={currentSlide.primary_button_url || ""}
                      onChange={(e) =>
                        updateSlideField(activeTab, "primary_button_url", e.target.value)
                      }
                      placeholder="e.g. #shop-by-category, #featured-products, or URL"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-xs outline-none focus:border-[#FF5A00] focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Status Toggle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">
                      Slide Status
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        updateSlideField(
                          activeTab,
                          "is_active",
                          !(currentSlide.is_active ?? true)
                        )
                      }
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                        currentSlide.is_active ?? true
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                      }`}
                    >
                      {currentSlide.is_active ?? true
                        ? "Active in Auto-Slider"
                        : "Disabled"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Natural Live Preview */}
              {currentSlide.background_image_url && (
                <div className="rounded-2xl bg-white border border-gray-200/80 shadow-xs p-6 space-y-4">
                  <div className="flex items-center gap-2 text-gray-900">
                    <Eye className="w-4 h-4 text-[#FF5A00]" />
                    <h3 className="text-xs font-black uppercase tracking-widest">
                      Live Natural Aspect Ratio Preview (Slide {activeTab + 1})
                    </h3>
                  </div>

                  <div className="w-full rounded-2xl overflow-hidden border border-gray-200 bg-black">
                    <img
                      src={currentSlide.background_image_url}
                      alt={`Slide ${activeTab + 1} Preview`}
                      className="w-full h-auto block"
                    />
                  </div>
                </div>
              )}

              {/* Save Slide Action */}
              <div className="sticky bottom-6 z-30 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                  <Sparkles className="w-4 h-4 text-[#FF5A00]" />
                  <span>Saves to 3-Slide Auto-Rotating Carousel</span>
                </div>

                <button
                  type="button"
                  disabled={savingSlide === activeTab}
                  onClick={() => handleSaveSlide(activeTab)}
                  className="px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-[#FF6A00] shadow-lg shadow-[#FF5A00]/30 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {savingSlide === activeTab ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publishing Slide {activeTab + 1}...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save &amp; Publish Slide {activeTab + 1}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
