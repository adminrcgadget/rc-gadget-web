"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { createClient } from "@/lib/supabase/client";
import { SiteSettings } from "@/types/database";
import { Save, Check, AlertCircle, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (data) {
          setSettings(data as SiteSettings);
        } else {
          // Initialize empty settings object
          setSettings({
            id: "a0000000-0000-0000-0000-000000000001",
            business_name: "RC Gadgets",
            tagline: "Your World of Remote Control",
            description: "Your ultimate destination for premium RC Cars, RC Planes, RC Ships, RC Excavators and all RC Gadgets.",
            phone: "75 101 101 55",
            email: "rcgadgetsstore@gmail.com",
            address: "Parambilangadi",
            city: "Kottakkal",
            state: "Kerala",
            country: "India",
            logo_url: "/logo/Screenshot 2026-08-18 121555.png",
            favicon_url: "/logo/Screenshot 2026-08-18 121555.png",
            instagram_url: "https://www.instagram.com/rc_gadgetsstore/",
            facebook_url: "https://www.facebook.com/share/19FeP3z6KV/",
            youtube_url: "https://www.youtube.com",
            whatsapp_number: "+917510110155",
            copyright_text: "© 2026 RC Gadgets. All rights reserved. Built for passion, driven by performance.",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    setStatusMsg(null);

    try {
      const payload: any = {
        ...settings,
        updated_at: new Date().toISOString(),
      };

      const isUuid = payload.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.id);
      if (!isUuid) {
        delete payload.id;
      }

      const { data: savedData, error } = await supabase
        .from("site_settings")
        .upsert(payload)
        .select()
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (savedData) {
        setSettings(savedData as SiteSettings);
      }
      setStatusMsg({ type: "success", text: "Site settings updated successfully!" });
    } catch (err: any) {
      console.error("Error saving site settings:", err);
      setStatusMsg({ type: "error", text: err.message || "Failed to update settings" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#FF5500] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Site Settings & Profile"
        subtitle="Manage brand identity, contact details, logos, and global website configurations"
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
        {/* Brand Information */}
        <div className="rounded-3xl bg-[#0E0E0E] border border-white/10 p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-white border-l-2 border-[#FF5500] pl-3">
            Brand & General Info
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Business Name
              </label>
              <input
                type="text"
                required
                value={settings.business_name || ""}
                onChange={(e) =>
                  setSettings({ ...settings, business_name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings.tagline || ""}
                onChange={(e) =>
                  setSettings({ ...settings, tagline: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
              Short Description / Bio
            </label>
            <textarea
              rows={3}
              value={settings.description || ""}
              onChange={(e) =>
                setSettings({ ...settings, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none resize-none"
            />
          </div>

          {/* Logo & Favicon Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <ImageUploader
              label="Brand Logo"
              bucket="site-assets"
              currentUrl={settings.logo_url}
              onUploadSuccess={(url) => setSettings({ ...settings, logo_url: url })}
              onRemove={() => setSettings({ ...settings, logo_url: null })}
            />

            <ImageUploader
              label="Favicon / App Icon"
              bucket="site-assets"
              currentUrl={settings.favicon_url}
              onUploadSuccess={(url) =>
                setSettings({ ...settings, favicon_url: url })
              }
              onRemove={() => setSettings({ ...settings, favicon_url: null })}
            />
          </div>
        </div>

        {/* Contact & Location */}
        <div className="rounded-3xl bg-[#0E0E0E] border border-white/10 p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-white border-l-2 border-[#FF5500] pl-3">
            Contact & Store Location (Kottakkal, Kerala)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Primary Phone Number
              </label>
              <input
                type="text"
                value={settings.phone || ""}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Email Address
              </label>
              <input
                type="email"
                value={settings.email || ""}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={settings.whatsapp_number || ""}
                onChange={(e) =>
                  setSettings({ ...settings, whatsapp_number: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Street / Area
              </label>
              <input
                type="text"
                value={settings.address || ""}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                City
              </label>
              <input
                type="text"
                value={settings.city || ""}
                onChange={(e) =>
                  setSettings({ ...settings, city: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                State
              </label>
              <input
                type="text"
                value={settings.state || ""}
                onChange={(e) =>
                  setSettings({ ...settings, state: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Country
              </label>
              <input
                type="text"
                value={settings.country || ""}
                onChange={(e) =>
                  setSettings({ ...settings, country: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer & Copyright */}
        <div className="rounded-3xl bg-[#0E0E0E] border border-white/10 p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-white border-l-2 border-[#FF5500] pl-3">
            Footer Copyright Text
          </h3>

          <div className="space-y-1.5">
            <input
              type="text"
              value={settings.copyright_text || ""}
              onChange={(e) =>
                setSettings({ ...settings, copyright_text: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 focus:border-[#FF5500] text-white text-sm outline-none"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="sticky bottom-6 z-20 p-4 rounded-2xl bg-[#141414]/90 backdrop-blur-md border border-white/10 flex items-center justify-between shadow-2xl">
          <span className="text-xs text-zinc-400">
            Ensure all values are accurate before publishing.
          </span>
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
                <span>Save Site Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
