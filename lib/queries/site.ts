import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SiteSettings } from "@/types/database";

export const defaultSiteSettings: SiteSettings = {
  id: "a0000000-0000-0000-0000-000000000001",
  business_name: "RC Gadgets",
  tagline: "Your World of Remote Control",
  description: "Built for passion. Driven by performance. RC Gadgets – where excitement begins!",
  phone: "75 101 101 55",
  email: "rcgadgetsstore@gmail.com",
  address: "Parambilangadi",
  city: "Kottakkal",
  state: "Kerala",
  country: "India",
  logo_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045184/rc-gadgets/assets/logo.webp",
  favicon_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045184/rc-gadgets/assets/logo.webp",
  instagram_url: "https://www.instagram.com/rc_gadgetsstore/",
  facebook_url: "https://www.facebook.com/share/19FeP3z6KV/",
  youtube_url: "https://www.youtube.com",
  whatsapp_number: "+917510110155",
  copyright_text: "© 2026 RC Gadgets. All Rights Reserved.",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      if (error) console.warn("Supabase site_settings notice:", error.message);
      return defaultSiteSettings;
    }

    return data as SiteSettings;
  } catch (err) {
    console.error("Failed to fetch site_settings:", err);
    return defaultSiteSettings;
  }
}
