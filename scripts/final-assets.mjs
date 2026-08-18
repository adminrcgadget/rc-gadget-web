import sharp from "sharp";

async function makeFinalAssets() {
  const poster = "logo/WhatsApp Image 2026-08-17 at 6.53.55 PM.jpeg";

  // 1. RC Car Track
  await sharp(poster)
    .extract({ left: 30, top: 820, width: 550, height: 215 })
    .webp({ quality: 95 })
    .toFile("public/assets/rc-car-track.webp");

  // 2. RC Adventure Track
  await sharp(poster)
    .extract({ left: 635, top: 820, width: 585, height: 215 })
    .webp({ quality: 95 })
    .toFile("public/assets/rc-adventure-track.webp");

  // 3. Hero Monster Truck
  await sharp(poster)
    .extract({ left: 0, top: 380, width: 420, height: 260 })
    .webp({ quality: 95 })
    .toFile("public/assets/hero-truck.webp");

  // 4. Coming Soon Multi-Vehicle collage (Planes, Speedboat, Excavator)
  await sharp(poster)
    .extract({ left: 425, top: 220, width: 820, height: 420 })
    .webp({ quality: 95 })
    .toFile("public/assets/coming-soon-composite.webp");

  console.log("Final assets saved successfully!");
}

makeFinalAssets().catch(console.error);
