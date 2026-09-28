// Frame accurate preview of the opening: steps the film and every animation to each frame's exact time,
// screenshots it, and leaves a numbered image sequence for ffmpeg. No screen recorder, so no compression artefacts.
// Usage: node tools/render_opening.mjs <film-that-headless-chromium-can-decode.webm> <out-dir> [fps=24] [before=3] [after=29]
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import path from "node:path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const [film, out, fps = "24", before = "3", after = "29"] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
await p.goto(pathToFileURL(path.join(root, "opening/index.html")).href);
await p.evaluate((src) => { const f = document.getElementById("film"); f.src = src; f.load(); }, pathToFileURL(film).href);
await p.waitForFunction(() => document.getElementById("film").readyState >= 3);
await p.evaluate(() => document.fonts.ready);
let n = 0;
const shot = async () => { await p.screenshot({ path: path.join(out, String(n++).padStart(5, "0") + ".png") }); };
for (let i = 0; i < +before * +fps; i++) await shot();
// Click, then freeze time: from here every frame is set explicitly.
await p.evaluate(() => { const f = document.getElementById("film"); f.play = () => Promise.resolve(); });
await p.keyboard.press("Space");
// Every animation of the click is exposed by the page as window.__anims; pause them and step each one directly.
await p.evaluate(() => { window.__anims.forEach((a) => a.pause(0)); document.getElementById("film").pause(); });
for (let i = 0; i <= +after * +fps; i++) {
  const t = i / +fps;
  await p.evaluate(async (t) => {
    window.__anims.forEach((a) => a.time(Math.max(0, t - a.delay()), false));   // a tween's time excludes its delay
    const f = document.getElementById("film");
    const target = Math.min(t, f.duration - 0.01);
    if (Math.abs(f.currentTime - target) > 0.001) { f.currentTime = target; await new Promise((r) => f.addEventListener("seeked", r, { once: true })); }
  }, t);
  await shot();
}
console.log("frames:", n, "errors:", errs.length ? errs : "none");
await b.close();
