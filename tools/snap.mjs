// Usage: node tools/snap.mjs <url-or-file> <out.png> [width] [height]
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import path from "node:path";
const [src, out, w = "1920", h = "1080"] = process.argv.slice(2);
const url = /^https?:|^file:/.test(src) ? src : pathToFileURL(path.resolve(src)).href;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto(url); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
await p.screenshot({ path: out }); await b.close();
