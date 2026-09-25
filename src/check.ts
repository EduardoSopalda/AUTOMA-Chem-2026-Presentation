// Hidden preflight: open with ?check. Verifies every asset and font, times the first scene,
// and walks every beat to prove each one can be rebuilt. Never shown on stage.

import type { Engine } from "./engine";

const FONTS = ['500 72px "Source Serif 4"', '600 72px "Source Serif 4"', '400 16px "DM Sans"', '500 16px "DM Sans"', '600 16px "DM Sans"'];

export async function runCheck(engine: Engine, t0: number) {
  const box = document.createElement("div");
  box.className = "check";
  box.innerHTML = "<b>Preflight</b><br>Checking…";
  document.body.appendChild(box);

  await document.fonts.ready;
  const fonts = await Promise.all(FONTS.map(async (f) => [f, (await document.fonts.load(f)).length > 0] as const));
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("#sheet img"));
  const images = await Promise.all(imgs.map(async (im) => {
    try { await im.decode(); return [im.className, im.naturalWidth > 0] as const; } catch { return [im.className, false] as const; }
  }));
  const ready = performance.now() - t0;

  // Walk every beat instantly and time the slowest rebuild.
  let slowest = 0, slowAt = 0, errors = 0;
  const back = engine.i;
  for (let k = 0; k < engine.count; k++) {
    const s = performance.now();
    try { engine.goto(k, false); } catch (e) { errors++; console.error("beat", k, e); }
    const d = performance.now() - s;
    if (d > slowest) { slowest = d; slowAt = k; }
  }
  engine.goto(back, false);

  // Anything that reached the network would show up here.
  const external = performance.getEntriesByType("resource").map((r) => r.name).filter((n) => /^https?:/.test(n) && !n.startsWith(location.origin));

  const row = (ok: boolean, text: string) => `<div class="${ok ? "ok" : "bad"}">${ok ? "✓" : "✗"} ${text}</div>`;
  box.innerHTML = `<b>Preflight</b>` +
    fonts.map(([f, ok]) => row(ok, f)).join("") +
    images.map(([c, ok]) => row(ok, `image: ${c}`)).join("") +
    row(ready < 2000, `first scene ready in ${Math.round(ready)} ms`) +
    row(errors === 0, `${engine.count} beats rebuilt, ${errors} errors, slowest ${Math.round(slowest)} ms (beat ${slowAt})`) +
    row(external.length === 0, external.length ? `network calls: ${external.join(", ")}` : "no network calls");
}
