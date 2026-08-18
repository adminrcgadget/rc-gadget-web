import sharp from "sharp";
import fs from "fs";

async function finalizeComingSoonAsset() {
  const p2 = "logo/WhatsApp Image 2026-08-17 at 6.53.56 PM.jpeg";

  // Plane + Boat + Excavator diagonal composite (x: 200 to 800, top: 620 to 765)
  await sharp(p2)
    .extract({ left: 200, top: 620, width: 600, height: 145 })
    .webp({ quality: 95 })
    .toFile("public/assets/coming-soon-composite.webp");

  console.log("public/assets/coming-soon-composite.webp finalized!");
}

finalizeComingSoonAsset().catch(console.error);
