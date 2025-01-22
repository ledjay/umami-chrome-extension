import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";
import { resolve } from "path";
import { copyFileSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-files",
      writeBundle() {
        // Copy manifest
        copyFileSync(
          resolve(__dirname, "manifest.json"),
          resolve(__dirname, "dist/manifest.json")
        );

        // Copy icons
        [16, 32, 48, 128].forEach((size) => {
          ["gray", "red"].forEach((color) => {
            copyFileSync(
              resolve(__dirname, `src/assets/icon-${size}-${color}.png`),
              resolve(__dirname, `dist/assets/icon-${size}-${color}.png`)
            );
          });
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    headers: {
      "Content-Type": "application/javascript",
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name]-[hash][extname]`,
      },
    },
  },
});
