// Act 8. Back at ground level. In architectural drawings a dashed line means not yet built.
// The twin starts dashed and becomes solid only when people trust it.

import { hand, exact, type Pt } from "../draw/hand";
import { label, setTitleBlock, svg, type Sheet } from "../sheet";
import { gsap, t, clearPrevious, drawIn, fadeIn, wipe, FIG, GHOST_X, type Build } from "./common";

const TOP = 250, BASE = FIG.ground;
const PLANT = { x: 560, w: 120 };
const TWIN = { x: 1240, w: 120 };
const FEEDS = ["Sensors", "Equipment", "Lab results", "Maintenance", "Energy"];
const feedY = (i: number) => 320 + i * 84;

/** A process column in elevation: shell, head, skirt and trays. */
function column(x: number, w: number): Pt[][] {
  const r = w / 2, cx = x + r;
  const shell: Pt[] = [[x, BASE - 60], [x, TOP + 40], [cx - r * 0.7, TOP + 8], [cx, TOP], [cx + r * 0.7, TOP + 8], [x + w, TOP + 40], [x + w, BASE - 60]];
  const skirt: Pt[] = [[x + 14, BASE - 60], [x + 8, BASE], [x + w - 8, BASE], [x + w - 14, BASE - 60]];
  const trays: Pt[][] = Array.from({ length: 9 }, (_, i) => [[x, TOP + 90 + i * 64], [x + w, TOP + 90 + i * 64]]);
  return [shell, skirt, ...trays];
}

// Click 33. "Take digital twins…" The real plant in copper, its twin dashed in blue, feeds between. Then nothing moves.
const twins: Build = (s, beat) => {
  const tl = gsap.timeline();
  clearPrevious(s, tl, 0);
  tl.call(() => setTitleBlock(s, beat), [], 0.3);
  const plant = t(svg("g", { class: "plant" }, s.draw));
  column(PLANT.x, PLANT.w).forEach((pts, i) => {
    const p = svg("path", { d: hand(pts, "plant" + i, 0.9), stroke: "var(--copper)", "stroke-width": i < 2 ? 2.6 : 1.4, fill: "none" }, plant);
    gsap.set(p, { drawSVG: "0%" });
    drawIn(tl, p, 0.5 + (i < 2 ? 0 : 1.2 + i * 0.08), i < 2 ? 1.8 : 0.5);
  });
  // The twin is dashed: revealed with a wipe, top to bottom it stands "not yet built"
  const twin = t(svg("g", { class: "twin" }, s.draw)) as SVGGElement;
  column(TWIN.x, TWIN.w).forEach((pts, i) => svg("path", { d: exact(pts), stroke: "var(--blueprint)", "stroke-width": i < 2 ? 2.4 : 1.3, fill: "none", "stroke-dasharray": "12 8" }, twin));
  const w = wipe(s, twin, { x: TWIN.x - 10, y: TOP - 10, w: TWIN.w + 20, h: BASE - TOP + 20 }, "bottom");
  tl.to(w.rect, { ...w.to, duration: 2.4, ease: "power1.inOut" }, 1.8);

  const feeds = t(svg("g", { class: "feeds" }, s.draw));
  FEEDS.forEach((name, i) => {
    const y = feedY(i);
    const ln = svg("path", { class: `feed feed-${i}`, d: exact([[PLANT.x + PLANT.w, y], [TWIN.x, y]]), stroke: "var(--blueprint)", "stroke-width": 1.8, fill: "none" }, feeds);
    gsap.set(ln, { drawSVG: "0%" });
    drawIn(tl, ln, 4 + i * 0.25, 1);
    const lab = label(feeds, 960, y - 14, name, { size: 40, anchor: "middle", halo: true });
    lab.classList.add(`feed-label-${i}`);
    gsap.set(lab, { opacity: 0 });
    tl.to(lab, { opacity: 1, duration: 0.5 }, 4.4 + i * 0.25);
  });
  // "…whether anyone believes it." Then the engine holds: nothing moves.
  return tl;
};

// Click 34. AI speaks only as margin notes, in another hand. Three warm points on the real plant.
const notes: Build = (s) => {
  const tl = gsap.timeline();
  const m = t(svg("g", { class: "margin", opacity: 0 }, s.draw));
  label(m, TWIN.x + TWIN.w + 40, 420, "pattern found", { family: "serif", italic: true, size: 44, fill: "var(--blue-text)" });
  label(m, TWIN.x + TWIN.w + 40, 500, "behaviour predicted", { family: "serif", italic: true, size: 44, fill: "var(--blue-text)" });
  fadeIn(tl, m, 0.3, 1);
  const warm = t(svg("g", { class: "warm" }, s.draw));
  [["Energy", 430], ["Material loss", 600], ["Emissions", 770]].forEach(([name, y], i) => {
    const glow = svg("circle", { cx: PLANT.x + PLANT.w / 2, cy: y as number, r: 16, fill: "var(--copper-light)", opacity: 0 }, warm);
    const dot = svg("circle", { cx: PLANT.x + PLANT.w / 2, cy: y as number, r: 5, fill: "var(--copper)", opacity: 0 }, warm);
    const lab = label(warm, PLANT.x - 30, (y as number) + 14, name as string, { size: 40, anchor: "end" });
    gsap.set(lab, { opacity: 0 });
    tl.to(glow, { opacity: 0.55, duration: 0.8 }, 1.6 + i * 0.5)
      .to(dot, { opacity: 1, duration: 0.4 }, 1.6 + i * 0.5)
      .to(lab, { opacity: 1, duration: 0.6 }, 1.8 + i * 0.5);
  });
  return tl;
};

// Click 35. "If the equipment data is incomplete…" One feed breaks, Yield splits, energy lands on the wrong node. The twin stays dashed.
const falter: Build = (s) => {
  const tl = gsap.timeline();
  tl.to(s.draw.querySelectorAll(".margin"), { opacity: 0.35, duration: 0.6 }, 0);
  const eq = s.draw.querySelector(".feed-1");
  if (eq) tl.to(eq, { drawSVG: "0% 48%", duration: 1, ease: "power2.in" }, 0.3);          // breaks halfway
  const en = s.draw.querySelector(".feed-4");
  if (en) tl.to(en, { attr: { d: exact([[PLANT.x + PLANT.w, feedY(4)], [TWIN.x, feedY(4) - 140]]) }, duration: 1.2, ease: "power2.inOut" }, 1);
  const y = t(svg("g", { class: "yield" }, s.draw));
  const a = label(y, PLANT.x + PLANT.w / 2, TOP - 40, "Yield", { size: 44, anchor: "middle", fill: "var(--copper)" });
  const b = label(y, TWIN.x + TWIN.w / 2, TOP - 40, "Yield", { size: 44, anchor: "middle", fill: "var(--blue-text)" });
  gsap.set([a, b], { opacity: 0 });
  fadeIn(tl, [a, b], 1.8, 0.8, 0.3);
  return tl;
};

// Click 36. "…when the operator on the night shift trusts what it tells them…" Trust resolves the twin.
const trust: Build = (s: Sheet) => {
  const tl = gsap.timeline();
  const dusk = t(svg("rect", { class: "dusk", x: 0, y: 0, width: 1920, height: 1080, fill: "var(--ink)", opacity: 0, "pointer-events": "none" }, s.draw));
  s.draw.insertBefore(dusk, s.draw.firstChild);
  tl.to(dusk, { opacity: 0.06, duration: 2.5, ease: "sine.inOut" }, 0);
  const night = t(label(s.draw, FIG.x, 796, "Night shift, 03:10.", { size: 40, anchor: "middle" }));
  fadeIn(tl, night, 0.8, 0.8);
  // Clause by clause, the dashed twin is drawn solid
  const solid = t(svg("g", { class: "twin-solid" }, s.draw));
  const parts = column(TWIN.x, TWIN.w).map((pts, i) => {
    const p = svg("path", { d: exact(pts), stroke: "var(--blueprint)", "stroke-width": i < 2 ? 2.6 : 1.4, fill: "none" }, solid);
    gsap.set(p, { drawSVG: "0%" });
    return p;
  });
  drawIn(tl, parts.slice(0, 2), 1.4, 2.2);
  drawIn(tl, parts.slice(2), 2.6, 0.5, 0.15);
  tl.to(s.draw.querySelectorAll(".twin"), { opacity: 0, duration: 1.2 }, 3.6);
  // The broken feed mends, the energy line finds its node, Yield becomes one
  const eq = s.draw.querySelector(".feed-1");
  if (eq) tl.to(eq, { drawSVG: "0% 100%", duration: 1 }, 2.4);
  const en = s.draw.querySelector(".feed-4");
  if (en) tl.to(en, { attr: { d: exact([[PLANT.x + PLANT.w, feedY(4)], [TWIN.x, feedY(4)]]) }, duration: 1 }, 2.8);
  const ys = s.draw.querySelectorAll(".yield text");
  if (ys.length === 2) {
    tl.to(ys, { attr: { x: 960 }, duration: 1.4, ease: "power2.inOut" }, 3.6)
      .to(ys[0], { opacity: 0, duration: 0.6 }, 4.6)
      .to(ys[1], { fill: "var(--ink)", duration: 0.6 }, 4.6);
  }
  const acc = t(label(s.draw, FIG.x, 748, "Accountable", { size: 40, anchor: "middle", fill: "var(--copper)" }));
  const one = t(label(s.draw, GHOST_X - 20, 905, "1 : 1", { size: 44, anchor: "end" }));
  fadeIn(tl, acc, 5.4, 0.8);
  fadeIn(tl, one, 6.6, 0.8);
  return tl;
};

// Click 37. "Agents do not own risk." Everything fades except the figure.
const fade: Build = (s) => {
  const tl = gsap.timeline();
  tl.to(s.draw.querySelectorAll(":scope > .t"), { opacity: 0, duration: 1.8, ease: "sine.inOut" }, 0);
  return tl;
};

// Click 38. "Humans do. Always." Three words in serif. Protected silence, five seconds.
const humans: Build = (s) => {
  const tl = gsap.timeline();
  s.draw.querySelectorAll(":scope > .t").forEach((e) => (e as SVGElement).style.display = "none");
  const line = t(label(s.draw, 960, 600, "Humans do. Always.", { family: "serif", size: 84, anchor: "middle" }));
  fadeIn(tl, line, 0, 1);
  return tl;
};

export const ACT8: Record<number, Build> = { 33: twins, 34: notes, 35: falter, 36: trust, 37: fade, 38: humans };
