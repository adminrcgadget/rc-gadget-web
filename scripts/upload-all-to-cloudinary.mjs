import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Configure Cloudinary with user credentials
cloudinary.config({
  cloud_name: "r28lk4ms",
  api_key: "668366647883424",
  api_secret: "hy4B5MKcxEJHDnTdovU1KNP-JUg",
  secure: true,
});

async function uploadAll() {
  const assetsDir = "public/assets";
  if (!fs.existsSync(assetsDir)) {
    console.error("Assets directory not found");
    return;
  }

  const files = fs.readdirSync(assetsDir);
  console.log(`Uploading ${files.length} assets to Cloudinary (cloud: r28lk4ms)...`);

  const results = {};

  for (const file of files) {
    const filePath = path.join(assetsDir, file);
    try {
      const res = await cloudinary.uploader.upload(filePath, {
        folder: "rc-gadgets/assets",
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });
      console.log(`✓ ${file} => ${res.secure_url}`);
      results[file] = res.secure_url;
    } catch (err) {
      console.error(`✗ Error uploading ${file}:`, err.message);
    }
  }

  // Save the map to a JSON file for reference
  fs.writeFileSync("public/assets/cloudinary-urls.json", JSON.stringify(results, null, 2));
  console.log("\nAll assets uploaded to Cloudinary successfully! Map saved to public/assets/cloudinary-urls.json");
}

uploadAll().catch(console.error);
