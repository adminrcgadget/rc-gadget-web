import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Banner } from "@/types/database";

export const defaultBanners: Banner[] = [
  {
    id: "banner-1",
    title: "Promotional Banner 1",
    subtitle: "",
    description: "",
    image_url: null,
    desktop_image_url: null,
    mobile_image_url: null,
    button_text: "Explore Now",
    button_url: "#featured-products",
    position: "featured",
    is_active: true,
    sort_order: 1,
    created_at: "",
    updated_at: "",
  },
];

export async function getActiveBanners(): Promise<Banner[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.warn("Supabase banners notice:", error.message);
      return defaultBanners;
    }

    // Allow banners where is_active is null or true (only drop explicit false)
    const active = data.filter((b: any) => b.is_active !== false);
    return (active.length > 0 ? active : data) as Banner[];
  } catch (err) {
    console.error("Failed to fetch banners:", err);
    return defaultBanners;
  }
}
