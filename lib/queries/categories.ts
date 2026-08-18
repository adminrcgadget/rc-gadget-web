import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Category } from "@/types/database";

export const defaultCategories: Category[] = [
  {
    id: "cat-1",
    name: "RC CARS",
    short_description: "High-speed brushless buggies & scale 4WD racers.",
    icon_url: null,
    image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045166/rc-gadgets/assets/cat-car.webp",
    sort_order: 1,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "cat-2",
    name: "RC PLANES",
    short_description: "Aerobatic aircraft & precision scale jets.",
    icon_url: null,
    image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045169/rc-gadgets/assets/cat-plane.webp",
    sort_order: 2,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "cat-3",
    name: "RC SHIPS",
    short_description: "Brushless speed boats & scale battleships.",
    icon_url: null,
    image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045170/rc-gadgets/assets/cat-ship.webp",
    sort_order: 3,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "cat-4",
    name: "RC EXCAVATORS",
    short_description: "Heavy-duty full-metal hydraulic diggers.",
    icon_url: null,
    image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045167/rc-gadgets/assets/cat-excavator.webp",
    sort_order: 4,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "cat-5",
    name: "AND ALL RC GADGETS",
    short_description: "Pro-level radio systems, telemetry & accessories.",
    icon_url: null,
    image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045168/rc-gadgets/assets/cat-gadget.webp",
    sort_order: 5,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
];

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.warn("Supabase categories notice:", error.message);
      return defaultCategories;
    }

    return data as Category[];
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    return defaultCategories;
  }
}
