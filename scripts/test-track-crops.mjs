import sharp from "sharp";

async function testTrackCrops() {
  const poster = "logo/WhatsApp Image 2026-08-17 at 6.53.55 PM.jpeg";

  // Test purely the track below the text:
  // Let's crop from y: 800 to 1030 (height 230), x: 30 to 585
  await sharp(poster)
    .extract({ left: 30, top: 780, width: 555, height: 250 })
    .webp({ quality: 95 })
    .toFile("public/assets/test-track-car.webp");

  // Adventure track from y: 780 to 1030, x: 635 to 1220
  await sharp(poster)
    .extract({ left: 635, top: 780, width: 585, height: 250 })
    .webp({ quality: 95 })
    .toFile("public/assets/test-track-adv.webp");

  console.log("Track test crops generated!");
}

testTrackCrops().catch(console.error);
