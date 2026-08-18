import { createServerSupabaseClient } from "@/lib/supabase/server";
import { HeroSection } from "@/types/database";

export const defaultHero: HeroSection = {
  id: "b0000000-0000-0000-0000-000000000001",
  eyebrow: null,
  heading_line_1: "YOUR WORLD OF",
  heading_line_2: "REMOTE",
  heading_line_3: "CONTROL",
  description: "Premium RC Cars, Planes, Ships, Excavators and all RC Gadgets.",
  highlighted_text: "BUILT FOR PASSION. DRIVEN BY PERFORMANCE.",
  primary_button_text: "LEARN MORE",
  primary_button_url: "#about",
  secondary_button_text: "CONTACT US",
  secondary_button_url: "#contact",
  background_image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045181/rc-gadgets/assets/hero-main-banner.webp",
  foreground_image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045183/rc-gadgets/assets/hero-truck.webp",
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export async function getHero(): Promise<HeroSection> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("hero_section")
      .select("*")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      if (error) console.warn("Supabase hero_section notice:", error.message);
      return defaultHero;
    }

    return data as HeroSection;
  } catch (err) {
    console.error("Failed to fetch hero_section:", err);
    return defaultHero;
  }
}
