// Screenshot the settled end state of chosen clicks from the built deck, plus a contact sheet.
// Usage: node tools/shots.mjs 0 1 5 6 7 8 39 40 41 42 43 [--proj]
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import path from "node:path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const args = process.argv.slice(2);
const proj = args.includes("--proj");
const beats = args.filter((a) => /^\d+$/.test(a)).map(Number);
const url = pathToFileURL(path.join(root, "dist/index.html")).href;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
const files = [];
for (const n of beats) {
  await p.goto(url + "#" + (n || "")); await p.reload();
  await p.waitForTimeout(250);
  if (n === 0) { await p.keyboard.press("End"); await p.keyboard.press("Home"); }
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(250);
  if (proj) await p.addStyleTag({ content: "#sheet{filter:contrast(.82) brightness(1.05) saturate(.8)}" });
  const f = path.join(root, "frames/out", `beat-${String(n).padStart(2, "0")}${proj ? "-proj" : ""}.png`);
  await p.screenshot({ path: f }); files.push(f);
}
console.log(files.map((f) => path.relative(root, f)).join("\n"), "\nerrors:", errs.length ? errs : "none");
await b.close();
