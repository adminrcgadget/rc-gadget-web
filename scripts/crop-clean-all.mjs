import sharp from "sharp";

async function cropAllClean() {
  const p1 = "logo/WhatsApp Image 2026-08-17 at 6.53.55 PM.jpeg";
  const p2 = "logo/WhatsApp Image 2026-08-17 at 6.53.56 PM.jpeg";
  const p3 = "logo/WhatsApp Image 2026-08-17 at 6.53.55 PM (1).jpeg";

  // 1. Logo
  await sharp("logo/Screenshot 2026-08-18 121555.png")
    .webp({ quality: 95 })
    .toFile("public/assets/logo.webp");

  // 2. Individual Categories from the 5 diagonal slashes of p2 (1254x1254)
  // The 5 vehicle slashes are between y: 420 and 760
  // RC Car: x: 0 to 280
  await sharp(p2)
    .extract({ left: 0, top: 430, width: 280, height: 325 })
    .webp({ quality: 95 })
    .toFile("public/assets/cat-car.webp");

  // RC Plane: x: 220 to 480
  await sharp(p2)
    .extract({ left: 220, top: 430, width: 240, height: 325 })
    .webp({ quality: 95 })
    .toFile("public/assets/cat-plane.webp");

  // RC Ship: x: 410 to 650
  await sharp(p2)
    .extract({ left: 410, top: 430, width: 230, height: 325 })
    .webp({ quality: 95 })
    .toFile("public/assets/cat-ship.webp");

  // RC Excavator: x: 590 to 830
  await sharp(p2)
    .extract({ left: 590, top: 430, width: 230, height: 325 })
    .webp({ quality: 95 })
    .toFile("public/assets/cat-excavator.webp");

  // RC Gadget / Controller: x: 790 to 1020
  await sharp(p2)
    .extract({ left: 790, top: 430, width: 220, height: 325 })
    .webp({ quality: 95 })
    .toFile("public/assets/cat-gadget.webp");

  // 3. Full 5-vehicle diagonal banner row
  await sharp(p2)
    .extract({ left: 0, top: 420, width: 1040, height: 340 })
    .webp({ quality: 95 })
    .toFile("public/assets/categories-diagonal-strip.webp");

  // 4. Hero RC Monster Buggy (from p1 x: 0 to 425, y: 390 to 640)
  await sharp(p1)
    .extract({ left: 0, top: 390, width: 425, height: 250 })
    .webp({ quality: 95 })
    .toFile("public/assets/hero-buggy.webp");

  // 5. Coming Soon Multi-Vehicle Composite (Plane, Speedboat, Excavator ONLY without the text)
  // In p1: Plane is at x: 520 to 700, y: 230 to 360. Speedboat is at x: 425 to 620, y: 460 to 570. Excavator is at x: 625 to 810, y: 390 to 540.
  // The 3 vehicles together are in x: 425 to 820, y: 230 to 580
  await sharp(p1)
    .extract({ left: 425, top: 230, width: 400, height: 350 })
    .webp({ quality: 95 })
    .toFile("public/assets/coming-soon-vehicles-clean.webp");

  // 6. RC Car Track (Asphalt race circuit)
  await sharp(p1)
    .extract({ left: 30, top: 820, width: 550, height: 215 })
    .webp({ quality: 95 })
    .toFile("public/assets/rc-car-track.webp");

  // 7. RC Adventure Track (Off-road rock course)
  await sharp(p1)
    .extract({ left: 635, top: 820, width: 585, height: 215 })
    .webp({ quality: 95 })
    .toFile("public/assets/rc-adventure-track.webp");

  console.log("All clean assets extracted and cropped successfully!");
}

cropAllClean().catch(console.error);
