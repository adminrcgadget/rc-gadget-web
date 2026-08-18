import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Experience } from "@/types/database";

export const defaultExperiences: Experience[] = [
  {
    id: "exp-1",
    title: "RC CAR TRACK",
    subtitle: "FOR SPEED LOVERS",
    description: "Indoor asphalt racing circuit with high-grip banked curves designed for high-speed touring and drift battles.",
    image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045187/rc-gadgets/assets/rc-car-track.webp",
    button_text: "Learn More",
    button_url: "#contact",
    sort_order: 1,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "exp-2",
    title: "RC ADVENTURE TRACK",
    subtitle: "BUILT FOR EXTREME FUN",
    description: "Extreme rock crawling trail with timber bridges, boulders, and suspension obstacle zones.",
    image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045186/rc-gadgets/assets/rc-adventure-track.webp",
    button_text: "Learn More",
    button_url: "#contact",
    sort_order: 2,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
];

export async function getExperiences(): Promise<Experience[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.warn("Supabase experiences notice:", error.message);
      return defaultExperiences;
    }

    return data as Experience[];
  } catch (err) {
    console.error("Failed to fetch experiences:", err);
    return defaultExperiences;
  }
}
