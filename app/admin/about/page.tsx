"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { createClient } from "@/lib/supabase/client";
import { AboutSection } from "@/types/database";
import { Save, Check, AlertCircle, Loader2 } from "lucide-react";

export default function AdminAboutPage() {
  const [about, setAbout] = useState<AboutSection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchAbout = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("about_section")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (data) {
          setAbout(data as AboutSection);
        } else {
          setAbout({
            id: "c0000000-0000-0000-0000-000000000001",
            eyebrow: "ABOUT RC GADGETS",
            heading: "More Than a Store. It's an Experience.",
            description:
              "RC Gadgets is pioneering the RC motorsport and hobby ecosystem in Kottakkal, Kerala. We combine state-of-the-art machines with dedicated racing tracks, offering hobbyists, speed enthusiasts, and families an exhilarating world of remote control entertainment, professional support, and unmatched quality.",
            image_url: "/logo/WhatsApp Image 2026-08-17 at 6.53.55 PM (1).jpeg",
            button_text: "Experience The Thrill",
            button_url: "#experience",
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("Error fetching about section:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAbout();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!about) return;

    setIsSaving(true);
    setStatusMsg(null);

    try {
      const payload: any = {
        ...about,
        updated_at: new Date().toISOString(),
      };

      const isUuid =
        payload.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          payload.id
        );

      if (!isUuid) {
        delete payload.id;
      }

      const { data: savedData, error } = await (
        supabase.from("about_section") as any
      )
        .upsert(payload)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (savedData) setAbout(savedData as AboutSection);

      setStatusMsg({
        type: "success",
        text: "About section updated successfully!",
      });
    } catch (err: any) {
      console.error("Error updating about section:", err);
      setStatusMsg({
        type: "error",
        text: err.message || "Failed to update about section",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in">
        <AdminHeader
          title="About Section Management"
          subtitle="Edit brand story narrative, showroom image, and call-to-actions"
        />
        <div className="p-16 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#FF5A00] animate-spin" />
        </div>
      </div>
    );
  }

  if (!about) return null;

  return (
    <div className="space-y-8 animate-in fade-in">
      <AdminHeader
        title="About Section Management"
        subtitle="Edit brand story narrative, showroom image, and call-to-actions"
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

      <form onSubmit={handleSave} className="space-y-8">
        <div className="rounded-2xl bg-white border border-gray-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
          <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 border-l-2 border-[#FF5A00] pl-3">
            About Narrative &amp; Headlines
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Eyebrow Badge
              </label>
              <input
                type="text"
                value={about.eyebrow || ""}
                onChange={(e) => setAbout({ ...about, eyebrow: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Main Heading
              </label>
              <input
                type="text"
                required
                value={about.heading || ""}
                onChange={(e) => setAbout({ ...about, heading: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Detailed Story Description
            </label>
            <textarea
              rows={5}
              required
              value={about.description || ""}
              onChange={(e) =>
                setAbout({ ...about, description: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none resize-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Button Label
              </label>
              <input
                type="text"
                value={about.button_text || ""}
                onChange={(e) =>
                  setAbout({ ...about, button_text: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Button URL / Anchor
              </label>
              <input
                type="text"
                value={about.button_url || ""}
                onChange={(e) =>
                  setAbout({ ...about, button_url: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          {/* Media Upload */}
          <div className="pt-4 border-t border-gray-100">
            <ImageUploader
              label="About Showcase Visual"
              bucket="site-assets"
              folder="about"
              currentUrl={about.image_url}
              onUploadSuccess={(url) => setAbout({ ...about, image_url: url })}
              onRemove={() => setAbout({ ...about, image_url: null })}
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="sticky bottom-6 z-20 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-gray-200 flex items-center justify-between shadow-xl">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={about.is_active}
              onChange={(e) => setAbout({ ...about, is_active: e.target.checked })}
              className="w-4 h-4 text-[#FF5A00] accent-[#FF5A00] rounded"
            />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
              About Section Active
            </span>
          </label>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-[#FF6A00] shadow-md shadow-[#FF5A00]/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save About Section</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
