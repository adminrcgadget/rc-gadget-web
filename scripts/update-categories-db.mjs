import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ezqsgvzzghilwhqutybs.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_F07drhcC7YCP6CetjTVlFg_UxXbcjwA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectAndUpdate() {
  console.log("Fetching categories from Supabase...");
  const { data, error } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
  
  if (error) {
    console.error("Error fetching categories:", error);
    return;
  }
  
  console.log("Current categories in DB:", data);

  const categoryUpdates = [
    {
      name_pattern: /car/i,
      name: "RC CARS",
      short_description: "High speed. High control. Built to dominate.",
      image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045166/rc-gadgets/assets/cat-car.webp",
      sort_order: 1
    },
    {
      name_pattern: /plane|air/i,
      name: "RC PLANES",
      short_description: "Fly higher. Go farther. Experience freedom.",
      image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045169/rc-gadgets/assets/cat-plane.webp",
      sort_order: 2
    },
    {
      name_pattern: /ship|boat/i,
      name: "RC SHIPS",
      short_description: "Smooth on water. Power in every wave.",
      image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045170/rc-gadgets/assets/cat-ship.webp",
      sort_order: 3
    },
    {
      name_pattern: /excavator|truck/i,
      name: "RC EXCAVATORS",
      short_description: "Heavy duty power. Built for real work.",
      image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045167/rc-gadgets/assets/cat-excavator.webp",
      sort_order: 4
    },
    {
      name_pattern: /gadget|all/i,
      name: "ALL RC GADGETS",
      short_description: "Controllers, batteries, parts & more.",
      image_url: "https://res.cloudinary.com/r28lk4ms/image/upload/v1787045168/rc-gadgets/assets/cat-gadget.webp",
      sort_order: 5
    }
  ];

  if (data && data.length > 0) {
    for (const cat of data) {
      const match = categoryUpdates.find(u => u.name_pattern.test(cat.name));
      if (match) {
        console.log(`Updating category ${cat.id} (${cat.name}) with proper image: ${match.image_url}`);
        const { error: updateErr } = await supabase.from("categories").update({
          name: match.name,
          short_description: match.short_description,
          image_url: match.image_url,
          is_active: true
        }).eq("id", cat.id);
        
        if (updateErr) {
          console.error(`Failed to update ${cat.id}:`, updateErr.message);
        } else {
          console.log(`Successfully updated ${match.name}`);
        }
      }
    }
  } else {
    console.log("No categories found in DB, inserting default categories...");
    for (const item of categoryUpdates) {
      const { error: insertErr } = await supabase.from("categories").insert({
        name: item.name,
        short_description: item.short_description,
        image_url: item.image_url,
        sort_order: item.sort_order,
        is_active: true
      });
      if (insertErr) {
        console.error("Insert error:", insertErr.message);
      }
    }
  }

  // Fetch updated
  const { data: updated } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
  console.log("Final DB categories:", updated);
}

inspectAndUpdate();
