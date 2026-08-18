import sharp from "sharp";

async function findExactY() {
  const poster = "logo/WhatsApp Image 2026-08-17 at 6.53.55 PM.jpeg";
  // The poster height is 1254.
  // The bottom section is:
  // Let's crop top: 850, height: 200
  await sharp(poster)
    .extract({ left: 30, top: 850, width: 550, height: 180 })
    .webp({ quality: 95 })
    .toFile("public/assets/track-850.webp");

  // Let's also crop the entire track card with the orange frame:
  // In the design mockup that the user sent, the track card in the website has:
  // Title: RC CAR TRACK / FOR SPEED LOVERS
  // Photo inside: the track!
  // If the photo itself already had the text embedded in the original poster, or if we extract from y: 820:
  await sharp(poster)
    .extract({ left: 30, top: 820, width: 550, height: 210 })
    .webp({ quality: 95 })
    .toFile("public/assets/track-820.webp");
  
  // Adventure track at y: 820
  await sharp(poster)
    .extract({ left: 635, top: 820, width: 585, height: 210 })
    .webp({ quality: 95 })
    .toFile("public/assets/track-adv-820.webp");

  console.log("Slices created");
}

findExactY().catch(console.error);
