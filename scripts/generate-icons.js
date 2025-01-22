const sharp = require("sharp");
const path = require("path");

const sizes = [16, 32, 48, 128];
const inputFile = path.join(__dirname, "../src/assets/umami-logo.svg");

async function generateIcons() {
  for (const size of sizes) {
    // Gray version
    await sharp(inputFile)
      .resize(size, size)
      .tint({ r: 107, g: 114, b: 128 }) // Tailwind gray-500
      .png()
      .toFile(path.join(__dirname, `../src/assets/icon-${size}-gray.png`));

    // Red version
    await sharp(inputFile)
      .resize(size, size)
      .tint({ r: 239, g: 68, b: 68 }) // Tailwind red-500
      .png()
      .toFile(path.join(__dirname, `../src/assets/icon-${size}-red.png`));
  }
}

generateIcons().catch(console.error);
