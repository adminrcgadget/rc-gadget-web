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
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
          setSettings({
            id: "a0000000-0000-0000-0000-000000000001",
            business_name: "RC Gadgets",
            tagline: "Your World of Remote Control",
            description:
              "Your ultimate destination for premium RC Cars, RC Planes, RC Ships, RC Excavators and all RC Gadgets.",
            phone: "+91 75 101 101 55",
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
            copyright_text:
              "© 2026 RC Gadgets. All rights reserved. Built for passion, driven by performance.",
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

      const isUuid =
        payload.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          payload.id
        );

      if (!isUuid) {
        delete payload.id;
      }

      const { data: savedData, error } = await (
        supabase.from("site_settings") as any
      )
        .upsert(payload)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (savedData) setSettings(savedData as SiteSettings);

      setStatusMsg({
        type: "success",
        text: "Site settings and store contacts updated successfully!",
      });
    } catch (err: any) {
      console.error("Error updating settings:", err);
      setStatusMsg({
        type: "error",
        text: err.message || "Failed to update site settings",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in">
        <AdminHeader
          title="Site &amp; Contacts Settings"
          subtitle="Manage store metadata, phone numbers, WhatsApp, store address, and brand assets"
        />
        <div className="p-16 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#FF5A00] animate-spin" />
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-8 animate-in fade-in">
      <AdminHeader
        title="Site &amp; Contacts Settings"
        subtitle="Manage store metadata, phone numbers, WhatsApp, store address, and brand assets"
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
        {/* Brand Information */}
        <div className="rounded-2xl bg-white border border-gray-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
          <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 border-l-2 border-[#FF5A00] pl-3">
            Brand &amp; General Info
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Business Name
              </label>
              <input
                type="text"
                required
                value={settings.business_name || ""}
                onChange={(e) =>
                  setSettings({ ...settings, business_name: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings.tagline || ""}
                onChange={(e) =>
                  setSettings({ ...settings, tagline: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Short Description / Bio
            </label>
            <textarea
              rows={3}
              value={settings.description || ""}
              onChange={(e) =>
                setSettings({ ...settings, description: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none resize-none transition-colors"
            />
          </div>

          {/* Logo & Favicon Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
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
        <div className="rounded-2xl bg-white border border-gray-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
          <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 border-l-2 border-[#FF5A00] pl-3">
            Contact &amp; Store Location (Kottakkal, Kerala)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Primary Phone Number
              </label>
              <input
                type="text"
                value={settings.phone || ""}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={settings.email || ""}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={settings.whatsapp_number || ""}
                onChange={(e) =>
                  setSettings({ ...settings, whatsapp_number: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                value={settings.address || ""}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                City / Town
              </label>
              <input
                type="text"
                value={settings.city || ""}
                onChange={(e) =>
                  setSettings({ ...settings, city: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                State &amp; Country
              </label>
              <input
                type="text"
                value={`${settings.state || "Kerala"}, ${settings.country || "India"}`}
                onChange={(e) => {
                  const parts = e.target.value.split(",");
                  setSettings({
                    ...settings,
                    state: parts[0]?.trim() || "Kerala",
                    country: parts[1]?.trim() || "India",
                  });
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="rounded-2xl bg-white border border-gray-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
          <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 border-l-2 border-[#FF5A00] pl-3">
            Social Media &amp; Copyright
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.instagram_url || ""}
                onChange={(e) =>
                  setSettings({ ...settings, instagram_url: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Facebook URL
              </label>
              <input
                type="url"
                value={settings.facebook_url || ""}
                onChange={(e) =>
                  setSettings({ ...settings, facebook_url: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                YouTube URL
              </label>
              <input
                type="url"
                value={settings.youtube_url || ""}
                onChange={(e) =>
                  setSettings({ ...settings, youtube_url: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Footer Copyright Text
            </label>
            <input
              type="text"
              value={settings.copyright_text || ""}
              onChange={(e) =>
                setSettings({ ...settings, copyright_text: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#FF5A00] focus:bg-white text-gray-900 text-sm outline-none transition-colors"
            />
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-6 z-30 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-gray-200 flex items-center justify-between shadow-xl">
          <span className="text-xs font-bold text-gray-600">
            Publish settings to live storefront &amp; footer
          </span>

          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-[#FF6A00] shadow-md shadow-[#FF5A00]/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save &amp; Publish Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
