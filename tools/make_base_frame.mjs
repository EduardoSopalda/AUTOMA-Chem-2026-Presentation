// Regenerates act1/base-frame.png: Act 0's last frame without the films, so Act 1 starts on exactly the frame
// the opening hands over (deck.html dissolves between them). Keeps the man, the paper and the type.
// Checked on 30 Sep 2026: from the unchanged opening it reproduced the old base-frame to a mean difference of 0.085.
// Also enforces the foot datum: no type below the name block may start above y 936 (the man's soles, 928, + 8).
// Usage: node tools/make_base_frame.mjs   (needs Google Chrome for the H.264 films)
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DATUM = 936, TOP_RIGHT = [".rule-right", ".name", ".role", ".event"];   // Edu's layout: the name block sits top right
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto(pathToFileURL(path.join(root, "opening/index.html")).href);
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
const bad = await p.evaluate(([datum, exempt]) => [...document.querySelectorAll("#type > *")]
  .filter((e) => !exempt.some((c) => e.matches(c)) && e.getBoundingClientRect().top < datum).map((e) => e.className), [DATUM, TOP_RIGHT]);
if (bad.length) { console.error("Above the foot datum:", bad); process.exit(1); }
await p.keyboard.press("Space"); await p.waitForTimeout(300);
await p.evaluate(() => {
  (window.__anims || []).forEach((a) => a.progress(1));                       // the click's end state
  for (const id of ["film", "film2"]) document.getElementById(id).style.visibility = "hidden";
  document.getElementById("man").style.opacity = 1; document.getElementById("paper").style.opacity = 1;
});
await p.waitForTimeout(300);
await p.screenshot({ path: path.join(root, "act1/base-frame.png") });
await b.close();
console.log("act1/base-frame.png written; foot datum respected");
