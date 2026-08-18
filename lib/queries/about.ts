import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AboutSection } from "@/types/database";

export const defaultAbout: AboutSection = {
  id: "c0000000-0000-0000-0000-000000000001",
  eyebrow: "ABOUT RC GADGETS",
  heading: "MORE THAN A STORE, IT'S AN EXPERIENCE!",
  description: "RC Gadgets is your ultimate destination for everything remote control. From high-performance RC cars to precision planes, powerful excavators to premium accessories, we bring the best of RC world to Kottakkal. Get ready for a whole new experience!",
  image_url: null,
  button_text: "READ MORE",
  button_url: "#contact",
  is_active: true,
  created_at: "",
  updated_at: "",
};

export async function getAboutSection(): Promise<AboutSection> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("about_section")
      .select("*")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      if (error) console.warn("Supabase about_section notice:", error.message);
      return defaultAbout;
    }

    return data as AboutSection;
  } catch (err) {
    console.error("Failed to fetch about_section:", err);
    return defaultAbout;
  }
}
