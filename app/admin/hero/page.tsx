"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { createClient } from "@/lib/supabase/client";
import { HeroSection } from "@/types/database";
import { Save, Check, AlertCircle, Loader2 } from "lucide-react";

export default function AdminHeroPage() {
  const [hero, setHero] = useState<HeroSection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchHero = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("hero_section")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (data) {
          setHero(data as HeroSection);
        } else {
          setHero({
            id: "b0000000-0000-0000-0000-000000000001",
            eyebrow: "KOTTAKKAL — FIRST IN MALAPPURAM",
            heading_line_1: "YOUR WORLD OF",
            heading_line_2: "REMOTE",
            heading_line_3: "CONTROL",
            description: "Where passion meets performance. Experience high-octane RC motorsport, scale engineering marvels, and professional racing tracks right here in Kottakkal.",
            highlighted_text: "WHERE PASSION MEETS PERFORMANCE",
            primary_button_text: "Explore Our World",
            primary_button_url: "#our-world",
            secondary_button_text: "Experience Tracks",
            secondary_button_url: "#experience",
            background_image_url: "/logo/WhatsApp Image 2026-08-17 at 6.53.56 PM.jpeg",
            foreground_image_url: "/logo/WhatsApp Image 2026-08-17 at 6.53.55 PM (1).jpeg",
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("Error fetching hero:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHero();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hero) return;

    setIsSaving(true);
    setStatusMsg(null);

    try {
      const { error } = await supabase
        .from("hero_section")
        .upsert({
          ...hero,
          updated_at: new Date().toISOString(),
        } as any);

      if (error) {
        setStatusMsg({ type: "error", text: error.message });
      } else {
        setStatusMsg({ type: "success", text: "Hero section updated successfully!" });
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to update hero" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !hero) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#FF5500] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Hero Section CMS"
        subtitle="Manage cinematic headline typography, RC vehicle artwork, CTAs, and background visuals"
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
        {/* Typography & Content */}
        <div className="rounded-3xl bg-[#0E0E0E] border border-white/10 p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-white border-l-2 border-[#FF5500] pl-3">
            Cinematic Headlines & Text
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Eyebrow Badge Text
              </label>
              <input
                type="text"
                value={hero.eyebrow || ""}
                onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Highlighted Tagline / Quote
              </label>
              <input
                type="text"
                value={hero.highlighted_text || ""}
                onChange={(e) =>
                  setHero({ ...hero, highlighted_text: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Heading Line 1 (White)
              </label>
              <input
                type="text"
                required
                value={hero.heading_line_1 || ""}
                onChange={(e) =>
                  setHero({ ...hero, heading_line_1: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#FF5500]">
                Heading Line 2 (Orange Accent)
              </label>
              <input
                type="text"
                value={hero.heading_line_2 || ""}
                onChange={(e) =>
                  setHero({ ...hero, heading_line_2: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Heading Line 3 (Metallic)
              </label>
              <input
                type="text"
                value={hero.heading_line_3 || ""}
                onChange={(e) =>
                  setHero({ ...hero, heading_line_3: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
              Hero Narrative Description
            </label>
            <textarea
              rows={3}
              value={hero.description || ""}
              onChange={(e) =>
                setHero({ ...hero, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none resize-none"
            />
          </div>
        </div>

        {/* Buttons & Links */}
        <div className="rounded-3xl bg-[#0E0E0E] border border-white/10 p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-white border-l-2 border-[#FF5500] pl-3">
            Call To Action Buttons
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 space-y-4">
              <span className="text-xs font-black text-[#FF5500] uppercase tracking-wider block">
                Primary Button
              </span>
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">Button Label</label>
                <input
                  type="text"
                  value={hero.primary_button_text || ""}
                  onChange={(e) =>
                    setHero({ ...hero, primary_button_text: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">Target URL / Anchor</label>
                <input
                  type="text"
                  value={hero.primary_button_url || ""}
                  onChange={(e) =>
                    setHero({ ...hero, primary_button_url: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 space-y-4">
              <span className="text-xs font-black text-zinc-300 uppercase tracking-wider block">
                Secondary Button
              </span>
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">Button Label</label>
                <input
                  type="text"
                  value={hero.secondary_button_text || ""}
                  onChange={(e) =>
                    setHero({ ...hero, secondary_button_text: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">Target URL / Anchor</label>
                <input
                  type="text"
                  value={hero.secondary_button_url || ""}
                  onChange={(e) =>
                    setHero({ ...hero, secondary_button_url: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Artwork / Images */}
        <div className="rounded-3xl bg-[#0E0E0E] border border-white/10 p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-white border-l-2 border-[#FF5500] pl-3">
            Hero Artwork & RC Vehicle Media
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploader
              label="Foreground RC Vehicle Artwork"
              bucket="site-assets"
              folder="hero"
              currentUrl={hero.foreground_image_url}
              onUploadSuccess={(url) =>
                setHero({ ...hero, foreground_image_url: url })
              }
              onRemove={() => setHero({ ...hero, foreground_image_url: null })}
            />

            <ImageUploader
              label="Background Atmosphere / Texture"
              bucket="site-assets"
              folder="hero"
              currentUrl={hero.background_image_url}
              onUploadSuccess={(url) =>
                setHero({ ...hero, background_image_url: url })
              }
              onRemove={() => setHero({ ...hero, background_image_url: null })}
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="sticky bottom-6 z-20 p-4 rounded-2xl bg-[#141414]/90 backdrop-blur-md border border-white/10 flex items-center justify-between shadow-2xl">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hero.is_active}
              onChange={(e) => setHero({ ...hero, is_active: e.target.checked })}
              className="w-4 h-4 text-[#FF5500] accent-[#FF5500] rounded"
            />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Hero Section Active on Website
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
                <span>Save Hero Section</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
