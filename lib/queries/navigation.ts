import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NavigationItem } from "@/types/database";

export const defaultNavigationItems: NavigationItem[] = [
  { id: "1", label: "Home", href: "#hero", sort_order: 1, is_visible: true, created_at: "", updated_at: "" },
  { id: "2", label: "Our World", href: "#our-world", sort_order: 2, is_visible: true, created_at: "", updated_at: "" },
  { id: "3", label: "Coming Soon", href: "#coming-soon", sort_order: 3, is_visible: true, created_at: "", updated_at: "" },
  { id: "4", label: "About", href: "#about", sort_order: 4, is_visible: true, created_at: "", updated_at: "" },
  { id: "5", label: "Features", href: "#features", sort_order: 5, is_visible: true, created_at: "", updated_at: "" },
  { id: "6", label: "Experience", href: "#experience", sort_order: 6, is_visible: true, created_at: "", updated_at: "" },
  { id: "7", label: "Contact", href: "#contact", sort_order: 7, is_visible: true, created_at: "", updated_at: "" },
];

export async function getNavigationItems(): Promise<NavigationItem[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("navigation_items")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.warn("Supabase navigation_items notice:", error.message);
      return defaultNavigationItems;
    }

    return data as NavigationItem[];
  } catch (err) {
    console.error("Failed to fetch navigation_items:", err);
    return defaultNavigationItems;
  }
}
