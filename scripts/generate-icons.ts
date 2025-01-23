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

// Visual weight adjustment factor (approximately 90% of container size)
// This helps achieve equal visual weight as per the guidelines
const visualWeightFactor = 0.9;

async function colorSvg(svgContent: string, color: string): Promise<Buffer> {
  // Replace all fill and stroke attributes with our color
  const coloredSvg = svgContent
    .replace(/fill="[^"]*"/g, `fill="${color}"`)
    .replace(/stroke="[^"]*"/g, `stroke="${color}"`);

  return Buffer.from(coloredSvg);
}

async function generateIcon({ size, color }: IconConfig): Promise<void> {
  const actualSize = Math.round(size * visualWeightFactor);
  const padding = Math.floor((size - actualSize) / 2);

  console.log(
    `Generating ${color.name} icon for size ${size}px (actual size: ${actualSize}px)`
  );

  try {
    // Read the SVG file
    const svgContent = await fs.readFile(inputFile, "utf-8");

    // Color the SVG
    const coloredSvg = await colorSvg(svgContent, color.hex);

    // Get metadata to calculate proper dimensions
    const metadata = await sharp(coloredSvg).metadata();
    const aspectRatio = metadata.width! / metadata.height!;

    // Calculate dimensions that maintain aspect ratio
    let resizeWidth = actualSize;
    let resizeHeight = actualSize;

    if (aspectRatio > 1) {
      resizeHeight = Math.round(actualSize / aspectRatio);
    } else {
      resizeWidth = Math.round(actualSize * aspectRatio);
    }

    await sharp(coloredSvg)
      .resize(resizeWidth, resizeHeight, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .extend({
        top: padding + Math.floor((actualSize - resizeHeight) / 2),
        bottom: padding + Math.ceil((actualSize - resizeHeight) / 2),
        left: padding + Math.floor((actualSize - resizeWidth) / 2),
        right: padding + Math.ceil((actualSize - resizeWidth) / 2),
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(
        path.join(__dirname, `../src/assets/icon-${size}-${color.name}.png`)
      );

    console.log(
      `✓ Successfully generated ${color.name} icon for size ${size}px`
    );
  } catch (error) {
    console.error(
      `✗ Error generating ${color.name} icon for size ${size}px:`,
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
