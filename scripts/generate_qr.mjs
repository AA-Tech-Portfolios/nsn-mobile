#!/usr/bin/env node
import QRCode from "qrcode";

const [, , url, outputPath = "expo-qr-code.png"] = process.argv;

if (!url) {
  console.error('Usage: node scripts/generate_qr.mjs "exps://..." [output.png]');
  process.exit(1);
}

// Expo QR codes need enough resolution to survive browser zoom and screenshots.
await QRCode.toFile(outputPath, url, { width: 512 });
console.log(`QR code saved to ${outputPath}`);
