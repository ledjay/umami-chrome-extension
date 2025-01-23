import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

// TypeScript requires different __dirname handling in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface StoreAssetConfig {
  name: string;
  width: number;
  height: number;
}

const storeAssets: StoreAssetConfig[] = [
  {
    name: "screenshot",
    width: 1280,
    height: 800,
  },
  {
    name: "promotional-small",
    width: 440,
    height: 280,
  },
];

async function generateStoreAssets(): Promise<void> {
  console.log("Starting store assets generation...");

  const inputFile = path.join(__dirname, "../screenshots/screenshot.png");
  const outputDir = path.join(__dirname, "../screenshots/generated");

  try {
    // Create the output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    for (const asset of storeAssets) {
      console.log(
        `Generating ${asset.name} (${asset.width}x${asset.height})...`
      );

      await sharp(inputFile)
        .resize(asset.width, asset.height, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 1 }, // White background
        })
        .png({
          compressionLevel: 9,
          force: true,
          palette: false, // 24-bit color as required
        })
        .toFile(path.join(outputDir, `${asset.name}.png`));

      console.log(`✓ Successfully generated ${asset.name}`);
    }

    console.log(
      "\n✨ All store assets generated successfully in screenshots/generated!"
    );
  } catch (error) {
    console.error("\n❌ Error generating store assets:", error);
    process.exit(1);
  }
}

generateStoreAssets();
