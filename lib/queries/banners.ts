import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Banner } from "@/types/database";

export const defaultBanners: Banner[] = [
  {
    id: "banner-1",
    title: "COMING SOON",
    subtitle: "INTO NEW IN KOTTAKKAL",
    description: "FIRST IN MALAPPURAM",
    image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045173/rc-gadgets/assets/coming-soon-composite.webp",
    desktop_image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045173/rc-gadgets/assets/coming-soon-composite.webp",
    mobile_image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045173/rc-gadgets/assets/coming-soon-composite.webp",
    button_text: "Get In Touch",
    button_url: "#contact",
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
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.warn("Supabase banners notice:", error.message);
      return defaultBanners;
    }

    return data as Banner[];
  } catch (err) {
    console.error("Failed to fetch banners:", err);
    return defaultBanners;
  }
}
