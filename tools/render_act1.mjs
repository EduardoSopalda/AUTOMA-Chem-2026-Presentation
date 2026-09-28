// Frame accurate render of Act 1's three clicks, with a short hold after each (as if Edu were talking).
// Usage: node tools/render_act1.mjs <out-dir> [fps=24]
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import path from "node:path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const [out, fps = "24"] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
await p.goto(pathToFileURL(path.join(root, "act1/act1.html")).href);
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
const C = await p.evaluate(() => window.CLICK);
let n = 0;
const shot = async () => p.screenshot({ path: path.join(out, String(n++).padStart(5, "0") + ".png") });
for (const [c, hold] of [[1, 0.8], [2, 0.9], [3, 1.6]]) {
  for (let i = 0; i <= Math.ceil((C[c] + hold) * +fps); i++) { await p.evaluate(([c, t]) => setState(c, t), [c, Math.min(i / +fps, C[c] + 0.01)]); await shot(); }
}
console.log("clicks", JSON.stringify(C), "frames", n, "errors", errs.length ? errs : "none");
await b.close();
