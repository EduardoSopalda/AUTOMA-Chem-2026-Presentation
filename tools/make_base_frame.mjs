// Regenerates act1/base-frame.png: Act 0's last frame without the films, so Act 1 starts on exactly the frame
// the opening hands over (deck.html dissolves between them). Keeps the man, the paper and the type.
// Checked on 30 Sep 2026: from the unchanged opening it reproduced the old base-frame to a mean difference of 0.085.
// Also enforces Act 0's two rules. At rest, no type outside the name block starts above y 936 (the man's soles, 928, + 8).
// Along the title's whole move, sampled at 60 fps, nothing overlaps the man (x 795-985, y 756-928).
// Usage: node tools/make_base_frame.mjs   (needs Google Chrome for the H.264 films)
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DATUM = 936, TOP_RIGHT = [".idblock"];   // Edu's layout: the name block sits top right
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto(pathToFileURL(path.join(root, "opening/index.html")).href);
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
await p.keyboard.press("Space"); await p.waitForTimeout(300);
const check = await p.evaluate(([datum, exempt]) => {
  const tl = window.__anims[0]; tl.pause();
  const box = (el) => el.getBoundingClientRect();
  const over = []; for (let i = 0; i <= Math.ceil(tl.duration() * 60); i++) { tl.seek(i / 60);
    for (const el of document.querySelectorAll("#tgroup > *")) { const r = box(el); if (r.bottom > 756 && r.top < 928 && r.right > 795 && r.left < 985) { over.push(i / 60); break; } } }
  tl.progress(1);                                                               // the click's end state
  const above = [...document.querySelectorAll("#type > *, #tgroup > *")].filter((e) => !exempt.some((c) => e.matches(c)) && e.id !== "tgroup"
    && getComputedStyle(e).opacity !== "0" && box(e).top < datum).map((e) => e.className);
  return { over, above };
}, [DATUM, TOP_RIGHT]);
if (check.above.length) { console.error("Above the foot datum at rest:", check.above); process.exit(1); }
if (check.over.length) { console.error("The title crosses the man at", check.over.slice(0, 5), "s"); process.exit(1); }
await p.evaluate(() => {
  for (const id of ["film", "film2"]) document.getElementById(id).style.visibility = "hidden";
  document.getElementById("man").style.opacity = 1; document.getElementById("paper").style.opacity = 1;
});
await p.waitForTimeout(300);
await p.screenshot({ path: path.join(root, "act1/base-frame.png") });
await b.close();
console.log("act1/base-frame.png written; foot datum respected at rest; the title never crosses the man");
