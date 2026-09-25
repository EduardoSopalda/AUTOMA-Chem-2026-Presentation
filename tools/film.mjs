// Frame sequence of one click, for review: settle on click n-1, press Right, capture every `step` ms.
// Usage: node tools/film.mjs <click> [seconds=8] [frames=8]
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import path from "node:path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const [n, secs = "8", count = "8"] = process.argv.slice(2).map(Number);
const url = pathToFileURL(path.join(root, "dist/index.html")).href;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
if (n === 0) { await p.goto(url); await p.reload(); }
else { await p.goto(url + "#" + (n - 1 || "")); await p.reload(); await p.waitForTimeout(300); await p.keyboard.press("ArrowRight"); }
const shots = [];
const t0 = Date.now();
for (let i = 0; i < count; i++) {
  const due = t0 + (i * secs * 1000) / (count - 1);
  const wait = due - Date.now(); if (wait > 0) await p.waitForTimeout(wait);
  shots.push(await p.screenshot({ scale: "css", type: "png", clip: { x: 0, y: 0, width: 1920, height: 1080 } }));
}
const { default: sharp } = await import("sharp").catch(() => ({ default: null }));
const fs = await import("node:fs");
shots.forEach((buf, i) => fs.writeFileSync(path.join(root, "frames/out", `film-${String(n).padStart(2, "0")}-${i}.png`), buf));
console.log(`frames/out/film-${String(n).padStart(2, "0")}-0..${count - 1}.png`, "errors:", errs.length ? errs : "none");
await b.close();
