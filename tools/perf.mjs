// Frame timing during the heaviest clicks, from file://. Headless, so treat as relative, not absolute.
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import path from "node:path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const url = pathToFileURL(path.join(root, "dist/index.html")).href;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
for (const n of [0, 5, 9, 26, 27, 28, 41]) {
  if (n === 0) { await p.goto(url); await p.reload(); }
  else { await p.goto(url + "#" + (n - 1 || "")); await p.reload(); await p.waitForTimeout(300); }
  await p.evaluate(() => { window.__f = []; let last = performance.now(); const loop = (t) => { window.__f.push(t - last); last = t; if (window.__f.length < 240) requestAnimationFrame(loop); }; requestAnimationFrame(loop); });
  if (n) await p.keyboard.press("ArrowRight");
  await p.waitForTimeout(4200);
  const f = await p.evaluate(() => window.__f.slice(2));
  f.sort((a, b) => a - b);
  const med = f[Math.floor(f.length / 2)], p95 = f[Math.floor(f.length * 0.95)], worst = f[f.length - 1];
  console.log(`click ${String(n).padStart(2)}: median ${med.toFixed(1)} ms, 95th ${p95.toFixed(1)} ms, worst ${worst.toFixed(1)} ms`);
}
await b.close();
