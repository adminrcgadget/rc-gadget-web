import sharp from "sharp";

async function cropPureVehicles() {
  const p2 = "logo/WhatsApp Image 2026-08-17 at 6.53.56 PM.jpeg";

  // Plane + Boat + Excavator (x: 200 to 800, top: 620 to 765)
  await sharp(p2)
    .extract({ left: 200, top: 620, width: 600, height: 145 })
    .webp({ quality: 95 })
    .toFile("public/assets/coming-soon-vehicles-clean.webp");

  console.log("Pure vehicle artwork without any letters cropped!");
}

cropPureVehicles().catch(console.error);
