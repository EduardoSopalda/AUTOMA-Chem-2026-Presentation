// Phase 3: render the three style frames, normal and under projector simulation, at 1920 by 1080.
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { mkdirSync } from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const out = path.join(root, "frames", "out");
mkdirSync(out, { recursive: true });
const url = (p) => pathToFileURL(path.join(root, p)).href;

// The title card as it is, with the two approved changes: DM Sans for the system voice, and the figure.
const coverCss = `
  @font-face { font-family: "DM Sans"; src: url("fonts/DMSans-400.woff2") format("woff2"); font-weight: 400; }
  @font-face { font-family: "DM Sans"; src: url("fonts/DMSans-500.woff2") format("woff2"); font-weight: 500; }
  @font-face { font-family: "DM Sans"; src: url("fonts/DMSans-600.woff2") format("woff2"); font-weight: 600 700; }
  :root { --ui: "DM Sans", system-ui, sans-serif; }
  .styleframe-figure { position: absolute; left: 894px; top: 812px; height: 120px; z-index: 3; }
`;
const projCss = `
  .frame { filter: contrast(0.82) brightness(1.05) saturate(0.8); }
  .frame::after { content: ""; position: absolute; inset: 0; z-index: 9; pointer-events: none;
    background: radial-gradient(60% 55% at 50% 45%, rgba(255,236,205,0.28), rgba(255,236,205,0) 70%); mix-blend-mode: screen; }
`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

async function shoot(name, target, css = "") {
  await page.goto(target);
  if (css) await page.addStyleTag({ content: css });
  if (name.startsWith("cover")) {
    await page.evaluate(() => {
      const img = document.createElement("img");
      img.src = "assets/figure/figure.svg"; img.className = "styleframe-figure"; img.alt = "";
      document.querySelector(".frame").appendChild(img);
    });
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(out, name + ".png") });
  console.log("frames/out/" + name + ".png");
}

await shoot("cover", url("index.html"), coverCss);
await shoot("cover-projector", url("index.html"), coverCss + projCss);
await shoot("act5", url("frames/frames.html") + "?f=act5");
await shoot("act5-projector", url("frames/frames.html") + "?f=act5&proj");
await shoot("act8", url("frames/frames.html") + "?f=act8");
await shoot("act8-projector", url("frames/frames.html") + "?f=act8&proj");
await browser.close();
