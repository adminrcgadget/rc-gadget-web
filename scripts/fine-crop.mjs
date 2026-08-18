import sharp from "sharp";

async function preciseCrop() {
  const poster = "logo/WhatsApp Image 2026-08-17 at 6.53.55 PM.jpeg";
  const poster2 = "logo/WhatsApp Image 2026-08-17 at 6.53.56 PM.jpeg";

  // 1. RC CAR TRACK - purely the asphalt race track photo (inside the orange border)
  // Let's extract from y: 690 to 980, x: 28 to 585
  await sharp(poster)
    .extract({ left: 32, top: 692, width: 550, height: 285 })
    .webp({ quality: 95 })
    .toFile("public/assets/rc-car-track.webp");

  // 2. RC ADVENTURE TRACK - purely the outdoor scale rock/wood obstacle course photo
  // Let's extract from y: 690 to 980, x: 635 to 1220
  await sharp(poster)
    .extract({ left: 635, top: 692, width: 585, height: 285 })
    .webp({ quality: 95 })
    .toFile("public/assets/rc-adventure-track.webp");

  // 3. COMING SOON MULTI-VEHICLE COLLAGE (Plane + Speedboat + Excavator)
  await sharp(poster)
    .extract({ left: 425, top: 225, width: 820, height: 400 })
    .webp({ quality: 95 })
    .toFile("public/assets/coming-soon-composite.webp");

  // 4. HERO VEHICLE - Monster Buggy
  // In poster (6.53.55 PM), the large truck on the left is at x: 0 to 420, y: 380 to 650
  await sharp(poster)
    .extract({ left: 0, top: 380, width: 420, height: 270 })
    .webp({ quality: 95 })
    .toFile("public/assets/hero-truck-clean.webp");

  console.log("Precise cropping completed!");
}

preciseCrop().catch(console.error);
