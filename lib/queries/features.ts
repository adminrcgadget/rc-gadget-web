import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Feature } from "@/types/database";

export const defaultFeatures: Feature[] = [
  {
    id: "f-1",
    title: "PREMIUM QUALITY",
    description: "Carefully selected products for the best performance.",
    icon_url: null,
    sort_order: 1,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "f-2",
    title: "TRUSTED BRANDS",
    description: "We work with the world's leading RC brands.",
    icon_url: null,
    sort_order: 2,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "f-3",
    title: "EXPERT SUPPORT",
    description: "Expert guidance whenever you need it.",
    icon_url: null,
    sort_order: 3,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "f-4",
    title: "FAST & SAFE DELIVERY",
    description: "Secure packaging and reliable delivery.",
    icon_url: null,
    sort_order: 4,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
];

export async function getFeatures(): Promise<Feature[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("features")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.warn("Supabase features notice:", error.message);
      return defaultFeatures;
    }

    // Filter out explicitly inactive (is_active === false), but allow null (treat as active)
    const active = data.filter((f: any) => f.is_active !== false);
    return (active.length > 0 ? active : data) as Feature[];
  } catch (err) {
    console.error("Failed to fetch features:", err);
    return defaultFeatures;
  }
}
