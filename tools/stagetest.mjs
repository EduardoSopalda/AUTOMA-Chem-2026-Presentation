// Opens the built deck from file://, like a double click, and exercises it.
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import path from "node:path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const deckUrl = pathToFileURL(path.join(root, "dist/index.html")).href;
const out = (n) => path.join(root, "frames/out", n);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await ctx.newPage();
const errs = []; page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
const net = []; page.on("request", (r) => { if (!r.url().startsWith("file:") && !r.url().startsWith("data:")) net.push(r.url()); });

await page.goto(deckUrl + "?check");
await page.waitForSelector(".check div", { timeout: 15000 });
console.log(await page.innerText(".check"));
await page.screenshot({ path: out("engine-check.png") });

await page.goto(deckUrl);
await page.waitForTimeout(500);
await page.keyboard.press("End"); await page.keyboard.press("Home"); await page.waitForTimeout(300);
await page.screenshot({ path: out("engine-cover-end.png") });

// Clicker: Page Down through Act 1 into Act 5's silence
for (let k = 0; k < 23; k++) { await page.keyboard.press("PageDown"); await page.waitForTimeout(170); }
await page.waitForTimeout(1500);
console.log("hash after 23 PageDown:", new URL(page.url()).hash, "hold class:", await page.$eval("#sheet", (e) => e.classList.contains("hold")));
await page.screenshot({ path: out("engine-act5-hold.png") });

// Reload mid talk: must come back to the same beat
await page.reload(); await page.waitForTimeout(500);
console.log("after reload:", new URL(page.url()).hash);

// Blank to paper
await page.keyboard.press("b"); await page.waitForTimeout(100);
const bg = await page.evaluate(() => getComputedStyle(document.getElementById("blank")).backgroundColor);
console.log("blank visible:", await page.isVisible("#blank"), bg);
await page.keyboard.press("b");

// Presenter window from file://, then forward a key from it
const [pres] = await Promise.all([ctx.waitForEvent("page"), page.keyboard.press("p")]);
await pres.waitForTimeout(1500);
console.log("presenter now:", (await pres.innerText(".now .meta")).trim());
await pres.keyboard.press("PageDown"); await page.waitForTimeout(800);
console.log("deck after key in presenter:", new URL(page.url()).hash);
await pres.setViewportSize({ width: 1280, height: 800 });
await pres.screenshot({ path: out("engine-presenter.png") });

// Jump keys
await page.bringToFront(); await page.keyboard.press("8"); await page.waitForTimeout(300);
console.log("key 8 ->", new URL(page.url()).hash);

console.log("errors:", errs.length ? errs : "none", "| non-file requests:", net.length ? net : "none");
await b.close();
