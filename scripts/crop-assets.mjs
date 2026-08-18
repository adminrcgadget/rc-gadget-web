import sharp from "sharp";
import fs from "fs";
import path from "path";

async function cropAssets() {
  const assetsDir = "public/assets";
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // 1. Clean Logo
  await sharp("logo/Screenshot 2026-08-18 121555.png")
    .webp({ quality: 95 })
    .toFile("public/assets/logo.webp");

  // 2. RC Car Track (bottom left of 6.53.55 PM.jpeg)
  await sharp("logo/WhatsApp Image 2026-08-17 at 6.53.55 PM.jpeg")
    .extract({ left: 30, top: 645, width: 575, height: 385 })
    .webp({ quality: 95 })
    .toFile("public/assets/rc-car-track.webp");

  // 3. RC Adventure Track (bottom right of 6.53.55 PM.jpeg)
  await sharp("logo/WhatsApp Image 2026-08-17 at 6.53.55 PM.jpeg")
    .extract({ left: 630, top: 645, width: 590, height: 385 })
    .webp({ quality: 95 })
    .toFile("public/assets/rc-adventure-track.webp");

  // 4. Coming soon middle composite (Planes, Boat, Excavator)
  await sharp("logo/WhatsApp Image 2026-08-17 at 6.53.55 PM.jpeg")
    .extract({ left: 450, top: 220, width: 780, height: 490 })
    .webp({ quality: 95 })
    .toFile("public/assets/coming-soon-vehicles.webp");

  // 5. Full Coming Soon Banner Background
  await sharp("logo/WhatsApp Image 2026-08-17 at 6.53.55 PM.jpeg")
    .extract({ left: 0, top: 120, width: 1254, height: 600 })
    .webp({ quality: 95 })
    .toFile("public/assets/coming-soon-banner.webp");

  // 6. Hero Monster Truck from 6.53.56 PM
  await sharp("logo/WhatsApp Image 2026-08-17 at 6.53.56 PM.jpeg")
    .extract({ left: 0, top: 480, width: 450, height: 450 })
    .webp({ quality: 95 })
    .toFile("public/assets/hero-truck.webp");

  // 7. Full multi-vehicle showcase banner from 6.53.56 PM
  await sharp("logo/WhatsApp Image 2026-08-17 at 6.53.56 PM.jpeg")
    .extract({ left: 0, top: 400, width: 1254, height: 550 })
    .webp({ quality: 95 })
    .toFile("public/assets/vehicles-diagonal.webp");

  // 8. Copy full background artwork for Hero section
  await sharp("logo/WhatsApp Image 2026-08-17 at 6.53.55 PM.jpeg")
    .webp({ quality: 95 })
    .toFile("public/assets/hero-bg.webp");

  console.log("All assets cropped and converted to high-definition WebP successfully!");
}

cropAssets().catch(console.error);
