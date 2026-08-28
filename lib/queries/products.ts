import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Product } from "@/types/database";

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Supabase products error:", error.message);
      return [];
    }

    return (data || []) as Product[];
  } catch (err) {
    console.error("Failed to fetch products from Supabase:", err);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`Supabase error fetching product ${id}:`, error.message);
      return null;
    }

    return (data || null) as Product | null;
  } catch (err) {
    console.error(`Failed to fetch product with id ${id}:`, err);
    return null;
  }
}

export async function getRelatedProducts(
  currentId: string,
  categoryName: string,
  limit: number = 4
): Promise<Product[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("category_name", categoryName)
      .neq("id", currentId)
      .limit(limit);

    if (error) {
      console.error("Supabase error fetching related products:", error.message);
      return [];
    }

    return (data || []) as Product[];
  } catch (err) {
    console.error("Failed to fetch related products:", err);
    return [];
  }
}
