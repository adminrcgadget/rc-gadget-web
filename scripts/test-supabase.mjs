import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ezqsgvzzghilwhqutybs.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_F07drhcC7YCP6CetjTVlFg_UxXbcjwA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing Supabase connection to:", supabaseUrl);
  try {
    const { data, error } = await supabase.from("site_settings").select("*").limit(1);
    if (error) {
      console.log("Notice: Table query response (Table may not be migrated yet or is empty):", error.message);
    } else {
      console.log("Success! Connected and fetched site_settings:", data);
    }
  } catch (err) {
    console.error("Connection error:", err);
  }
}

test();
