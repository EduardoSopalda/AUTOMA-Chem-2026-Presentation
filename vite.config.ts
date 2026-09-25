import { defineConfig, type Plugin } from "vite";
import { readFileSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";

// Stage rule: the build must open from a double click. Browsers refuse external module
// scripts on file://, so everything is inlined into one self contained dist/index.html.
function singleFile(): Plugin {
  let outDir = "dist";
  return {
    name: "single-file",
    apply: "build",
    configResolved(c) { outDir = c.build.outDir; },
    closeBundle() {
      const htmlPath = path.join(outDir, "index.html");
      let html = readFileSync(htmlPath, "utf8");
      const assets = path.join(outDir, "assets");
      for (const f of readdirSync(assets)) {
        const code = readFileSync(path.join(assets, f), "utf8");
        const ref = `./assets/${f}`;
        if (f.endsWith(".js")) {
          html = html.replace(new RegExp(`<script[^>]*src="${ref.replace(/[.]/g, "\\.")}"[^>]*></script>`),
            () => `<script type="module">${code.replace(/<\/script/g, "<\\/script")}</script>`);
        } else if (f.endsWith(".css")) {
          html = html.replace(new RegExp(`<link[^>]*href="${ref.replace(/[.]/g, "\\.")}"[^>]*>`),
            () => `<style>${code}</style>`);
        }
      }
      if (/\.\/assets\//.test(html)) throw new Error("single-file: an asset was not inlined");
      writeFileSync(htmlPath, html);
      rmSync(assets, { recursive: true });
    },
  };
}

export default defineConfig({
  base: "./",
  publicDir: false,
  build: {
    outDir: "dist",
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    modulePreload: false,
    chunkSizeWarningLimit: 4000,
  },
  plugins: [singleFile()],
});
