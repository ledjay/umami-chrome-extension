import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

// TypeScript requires different __dirname handling in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface IconConfig {
  size: number;
  color: {
    name: string;
    hex: string;
  };
}

const containerSizes = [16, 32, 48, 128] as const;
const colors = {
  gray: "#6B7280", // Tailwind gray-500
  red: "#EF4444", // Tailwind red-500
} as const;

const inputFile = path.join(__dirname, "../src/assets/umami-logo.svg");

async function colorSvg(svgContent: string, color: string): Promise<Buffer> {
  // Replace fill attribute with our color
  const coloredSvg = svgContent.replace(/fill="#[^"]*"/, `fill="${color}"`);
  return Buffer.from(coloredSvg);
}

async function generateIcon({ size, color }: IconConfig): Promise<void> {
  console.log(`Generating ${color.name} icon for size ${size}x${size}px...`);

  try {
    // Read the SVG file
    const svgContent = await fs.readFile(inputFile, "utf-8");

    // Color the SVG
    const coloredSvg = await colorSvg(svgContent, color.hex);

    // Convert to PNG at exact size
    await sharp(coloredSvg)
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toFile(
        path.join(__dirname, `../src/assets/icon-${size}-${color.name}.png`)
      );

    // Verify the size
    const verifySize = await sharp(
      path.join(__dirname, `../src/assets/icon-${size}-${color.name}.png`)
    ).metadata();

    if (verifySize.width === size && verifySize.height === size) {
      console.log(
        `✓ Successfully generated ${color.name} icon at exact ${size}x${size}px`
      );
    } else {
      throw new Error(
        `Generated icon size mismatch. Expected ${size}x${size}, got ${verifySize.width}x${verifySize.height}`
      );
    }
  } catch (error) {
    console.error(
      `✗ Error generating ${color.name} icon for size ${size}x${size}px:`,
      error
    );
    throw error;
  }
}

async function generateIcons(): Promise<void> {
  console.log("Starting icon generation...");
  console.log(`Input file: ${inputFile}`);

  const iconConfigs: IconConfig[] = containerSizes.flatMap((size) => [
    { size, color: { name: "gray", hex: colors.gray } },
    { size, color: { name: "red", hex: colors.red } },
  ]);

  try {
    await Promise.all(iconConfigs.map(generateIcon));
    console.log("\n✨ All icons generated successfully!");
  } catch (error) {
    console.error("\n❌ Error generating icons:", error);
    process.exit(1);
  }
}

generateIcons();
