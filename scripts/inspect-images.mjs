import sharp from "sharp";
import fs from "fs";
import path from "path";

async function inspect() {
  const files = [
    "logo/Screenshot 2026-08-18 121555.png",
    "logo/WhatsApp Image 2026-08-17 at 6.53.55 PM.jpeg",
    "logo/WhatsApp Image 2026-08-17 at 6.53.55 PM (1).jpeg",
    "logo/WhatsApp Image 2026-08-17 at 6.53.56 PM.jpeg",
  ];

  for (const f of files) {
    const meta = await sharp(f).metadata();
    console.log(f, "=>", meta.width, "x", meta.height);
  }
}

inspect();
