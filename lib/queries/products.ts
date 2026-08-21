import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Product } from "@/types/database";

export const defaultProducts: Product[] = [
  {
    id: "p-1",
    title: "Traxxas X-Maxx 8S 4WD Brushless Monster Truck",
    category_name: "RC Cars",
    brand_name: "Traxxas",
    price: 79999,
    original_price: 89999,
    rating: 4.9,
    reviews_count: 128,
    badge: "HOT",
    image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045166/rc-gadgets/assets/cat-car.webp",
    description: "Unstoppable 8S power, mammoth size, and award-winning durability.",
    stock_quantity: 5,
    is_bestseller: true,
    is_new_arrival: false,
    is_top_rated: true,
    is_active: true,
    sort_order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: "p-2",
    title: "DJI Mini 4 Pro Drone with RC-N2 Controller",
    category_name: "RC Drones",
    brand_name: "DJI",
    price: 84990,
    original_price: 92000,
    rating: 4.9,
    reviews_count: 96,
    badge: "NEW",
    image_url: null,
    description: "Omnidirectional obstacle sensing, 4K/60fps HDR video, and 34-min flight time.",
    stock_quantity: 8,
    is_bestseller: true,
    is_new_arrival: true,
    is_top_rated: true,
    is_active: true,
    sort_order: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: "p-3",
    title: "FMS 1400mm P-51D Mustang V8 RC Plane",
    category_name: "RC Planes",
    brand_name: "FMS",
    price: 32999,
    original_price: 38000,
    rating: 4.8,
    reviews_count: 74,
    badge: "POPULAR",
    image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045169/rc-gadgets/assets/cat-plane.webp",
    description: "Scale detail, functional flaps, retractable landing gear, and high-speed brushless power.",
    stock_quantity: 4,
    is_bestseller: true,
    is_new_arrival: false,
    is_top_rated: true,
    is_active: true,
    sort_order: 3,
    created_at: "",
    updated_at: "",
  },
  {
    id: "p-4",
    title: "Traxxas Rustler 4x4 VXL Brushless RC Car",
    category_name: "RC Cars",
    brand_name: "Traxxas",
    price: 29999,
    original_price: 34500,
    rating: 4.8,
    reviews_count: 89,
    badge: "SALE",
    image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045166/rc-gadgets/assets/cat-car.webp",
    description: "65+ mph stadium truck performance with Velineon brushless power.",
    stock_quantity: 12,
    is_bestseller: true,
    is_new_arrival: false,
    is_top_rated: false,
    is_active: true,
    sort_order: 4,
    created_at: "",
    updated_at: "",
  },
  {
    id: "p-5",
    title: "Volantex RC Vector SR80 Brushless RC Boat",
    category_name: "RC Boats",
    brand_name: "Volantex",
    price: 23999,
    original_price: 27999,
    rating: 4.9,
    reviews_count: 64,
    badge: "HOT",
    image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045170/rc-gadgets/assets/cat-ship.webp",
    description: "Auto-roll back function, water-cooled brushless motor hitting speeds over 70 km/h.",
    stock_quantity: 6,
    is_bestseller: true,
    is_new_arrival: false,
    is_top_rated: true,
    is_active: true,
    sort_order: 5,
    created_at: "",
    updated_at: "",
  },
  {
    id: "p-6",
    title: "FlySky FS-GT5 6CH Transmitter & Receiver",
    category_name: "Accessories",
    brand_name: "FlySky",
    price: 6499,
    original_price: 7999,
    rating: 4.8,
    reviews_count: 112,
    badge: "BEST",
    image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045168/rc-gadgets/assets/cat-gadget.webp",
    description: "6-channel ultra-fast AFHDS 2A protocol with built-in gyro receiver (FS-BS6).",
    stock_quantity: 20,
    is_bestseller: true,
    is_new_arrival: false,
    is_top_rated: true,
    is_active: true,
    sort_order: 6,
    created_at: "",
    updated_at: "",
  },
];

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.warn("Supabase products notice:", error.message);
      return defaultProducts;
    }

    return data as Product[];
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return defaultProducts;
  }
}
