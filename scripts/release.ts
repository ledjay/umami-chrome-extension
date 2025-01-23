import { execSync } from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

interface PackageJson {
  version: string;
  [key: string]: any;
}

async function promptVersion(currentVersion: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      `Current version is ${currentVersion}\nEnter new version (or press enter to use current): `,
      (answer) => {
        rl.close();
        resolve(answer.trim() || currentVersion);
      }
    );
  });
}

async function updateVersion(version: string) {
  console.log("📝 Updating version in package.json and manifest.json...");
  
  // Update package.json
  const packageJsonPath = path.join(rootDir, "package.json");
  const packageJson = JSON.parse(
    await fs.readFile(packageJsonPath, "utf-8")
  ) as PackageJson;
  packageJson.version = version;
  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");

  // Update manifest.json
  const manifestPath = path.join(rootDir, "manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"));
  manifest.version = version;
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
}

async function buildExtension() {
  console.log("🏗️  Building extension...");
  execSync("pnpm build", { stdio: "inherit", cwd: rootDir });
}

async function generateIcons() {
  console.log("🎨 Generating icons...");
  execSync("pnpm generate-icons", { stdio: "inherit", cwd: rootDir });
}

async function createZip(version: string) {
  const distDir = path.join(rootDir, "dist");
  const releasesDir = path.join(rootDir, "releases");
  const zipName = `umami-exclude-myself-v${version}.zip`;
  const zipPath = path.join(releasesDir, zipName);

  console.log(`📦 Creating ${zipName}...`);
  
  // Create releases directory if it doesn't exist
  try {
    await fs.mkdir(releasesDir, { recursive: true });
  } catch (error) {
    // Ignore if directory already exists
  }

  // Remove existing zip if it exists
  try {
    await fs.unlink(zipPath);
  } catch (error) {
    // Ignore if file doesn't exist
  }

  // Create zip
  execSync(`cd "${distDir}" && zip -r "${zipPath}" .`, {
    stdio: "inherit",
  });

  console.log(`✨ Release package created: releases/${zipName}`);
}

async function main() {
  try {
    console.log("🚀 Starting release process...");

    // Read current version
    const packageJson = JSON.parse(
      await fs.readFile(path.join(rootDir, "package.json"), "utf-8")
    ) as PackageJson;
    
    // Get new version
    const newVersion = await promptVersion(packageJson.version);
    
    // Update version in files
    await updateVersion(newVersion);
    
    // Generate icons
    await generateIcons();
    
    // Build the extension
    await buildExtension();
    
    // Create zip
    await createZip(newVersion);
    
    console.log("✅ Release process completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during release process:", error);
    process.exit(1);
  }
}

main();
