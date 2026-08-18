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
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
            description: "RC Gadgets is pioneering the RC motorsport and hobby ecosystem in Kottakkal, Kerala. We combine state-of-the-art machines with dedicated racing tracks, offering hobbyists, speed enthusiasts, and families an exhilarating world of remote control entertainment, professional support, and unmatched quality.",
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

      const isUuid = payload.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.id);
      if (!isUuid) {
        delete payload.id;
      }

      const { data: savedData, error } = await supabase
        .from("about_section")
        .upsert(payload)
        .select()
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (savedData) {
        setAbout(savedData as AboutSection);
      }
      setStatusMsg({ type: "success", text: "About section saved successfully!" });
    } catch (err: any) {
      console.error("Error saving about section:", err);
      setStatusMsg({ type: "error", text: err.message || "Failed to update about section" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !about) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#FF5500] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title="About Section CMS"
        subtitle="Manage brand story, vision narrative, showcase media, and call to actions"
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

      <form onSubmit={handleSave} className="space-y-8">
        <div className="rounded-3xl bg-[#0E0E0E] border border-white/10 p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-white border-l-2 border-[#FF5500] pl-3">
            About Narrative & Headlines
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Eyebrow Badge
              </label>
              <input
                type="text"
                value={about.eyebrow || ""}
                onChange={(e) => setAbout({ ...about, eyebrow: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Main Heading
              </label>
              <input
                type="text"
                required
                value={about.heading || ""}
                onChange={(e) => setAbout({ ...about, heading: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
              Detailed Story Description
            </label>
            <textarea
              rows={5}
              required
              value={about.description || ""}
              onChange={(e) =>
                setAbout({ ...about, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Button Label
              </label>
              <input
                type="text"
                value={about.button_text || ""}
                onChange={(e) =>
                  setAbout({ ...about, button_text: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Button URL / Anchor
              </label>
              <input
                type="text"
                value={about.button_url || ""}
                onChange={(e) =>
                  setAbout({ ...about, button_url: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
              />
            </div>
          </div>

          {/* Media Upload */}
          <div className="pt-4 border-t border-white/5">
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
        <div className="sticky bottom-6 z-20 p-4 rounded-2xl bg-[#141414]/90 backdrop-blur-md border border-white/10 flex items-center justify-between shadow-2xl">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={about.is_active}
              onChange={(e) => setAbout({ ...about, is_active: e.target.checked })}
              className="w-4 h-4 text-[#FF5500] accent-[#FF5500] rounded"
            />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              About Section Active
            </span>
          </label>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase text-white bg-[#FF5500] hover:bg-[#FF6A1A] shadow-lg shadow-[#FF5500]/30 transition-all flex items-center gap-2 disabled:opacity-50"
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
