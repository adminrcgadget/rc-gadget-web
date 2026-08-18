import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SocialLink } from "@/types/database";

export const defaultSocialLinks: SocialLink[] = [
  {
    id: "soc-1",
    platform: "Instagram",
    label: "@rc_gadgetsstore",
    url: "https://www.instagram.com/rc_gadgetsstore/",
    icon: "Instagram",
    sort_order: 1,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "soc-2",
    platform: "Facebook",
    label: "RC Gadgets",
    url: "https://www.facebook.com/share/19FeP3z6KV/",
    icon: "Facebook",
    sort_order: 2,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "soc-3",
    platform: "YouTube",
    label: "RC Gadgets",
    url: "https://www.youtube.com",
    icon: "Youtube",
    sort_order: 3,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "soc-4",
    platform: "WhatsApp",
    label: "+91 75 101 101 55",
    url: "https://wa.me/917510110155",
    icon: "MessageCircle",
    sort_order: 4,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
];

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.warn("Supabase social_links notice:", error.message);
      return defaultSocialLinks;
    }

    return data as SocialLink[];
  } catch (err) {
    console.error("Failed to fetch social_links:", err);
    return defaultSocialLinks;
  }
}
