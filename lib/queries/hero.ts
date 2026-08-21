import { createServerSupabaseClient } from "@/lib/supabase/server";
import { HeroSection } from "@/types/database";

export const defaultHero: HeroSection = {
  id: "b0000000-0000-0000-0000-000000000001",
  eyebrow: null,
  heading_line_1: "YOUR WORLD OF REMOTE CONTROL",
  heading_line_2: "REMOTE",
  heading_line_3: "CONTROL",
  description: "Premium RC Cars, Planes, Ships, Excavators and all RC Gadgets.",
  highlighted_text: "FULL_BANNER",
  primary_button_text: "SHOP NOW",
  primary_button_url: "#shop-by-category",
  secondary_button_text: "CONTACT US",
  secondary_button_url: "#contact",
  background_image_url: null,
  foreground_image_url: null,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export async function getHeroSlides(): Promise<HeroSection[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("hero_section")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.warn("Supabase hero_section notice:", error.message);
      return [defaultHero];
    }

    const active = data.filter((item: any) => item.is_active !== false);
    return (active.length > 0 ? active : data) as HeroSection[];
  } catch (err) {
    console.error("Failed to fetch hero slides:", err);
    return [defaultHero];
  }
}

export async function getHero(): Promise<HeroSection> {
  const slides = await getHeroSlides();
  return slides[0] || defaultHero;
}
