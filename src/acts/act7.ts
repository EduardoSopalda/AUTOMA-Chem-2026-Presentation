// Act 7. The road to the shiny city. The twist: the shiny city on the hill is Brasília all along.

import { hand, exact, cubic, along, type Pt } from "../draw/hand";
import { congresso } from "../draw/congresso";
import { getField, move, state, N } from "../draw/field";
import { label, setTitleBlock, svg, type Sheet } from "../sheet";
import { gsap, t, drawIn, fadeIn, FIG, type Build } from "./common";

const HILL = { x: 1420, y: 330 };
const CITY_HZ = 300;
const roadFrom = (start: Pt) => cubic(start, [start[0] + 180, start[1] - 60], [1180, 520], [HILL.x - 30, CITY_HZ + 30], 120);
const START_MID: Pt = [700, 720], START_FEET: Pt = [FIG.x + 30, FIG.ground - 6];
const ROWS = 125, ACROSS = 16;

/** Lay the 2,000 relevant points as paving stones along the road. */
function road(start: Pt) {
  const pts = roadFrom(start);
  return (k: number): [number, number, number] => {
    const row = Math.floor(k / ACROSS), col = k % ACROSS;
    const u = row / (ROWS - 1);
    const { p, deg } = along(pts, u);
    const a = (deg + 90) * Math.PI / 180, off = (col / (ACROSS - 1) - 0.5) * (56 - 26 * u);   // the road narrows as it climbs
    return [p[0] + Math.cos(a) * off, p[1] + Math.sin(a) * off, u];
  };
}

function relevantIndex(s: Sheet) {
  const f = getField(s);
  const idx = new Int32Array(N).fill(-1);
  let k = 0;
  for (let i = 0; i < N; i++) if (f.relevant[i]) idx[i] = k++;
  return { f, idx };
}

// Click 28. "Everyone wants the shiny city on the hill." The stones line up into a road that climbs.
const city: Build = (s, beat) => {
  const tl = gsap.timeline();
  tl.call(() => setTitleBlock(s, beat), [], 0.2);
  const { f, idx } = relevantIndex(s);
  tl.to(s.draw.querySelectorAll(":scope > .t"), { opacity: 0, duration: 0.8, onComplete: function () { this.targets().forEach((e: Element) => e.remove()); } }, 0);
  state(tl, f, { waste: 0, glow: 0 }, 0, 1);
  const lay = road(START_MID);
  move(tl, f, (i) => { const r = lay(idx[i]); f.u[i] = r[2]; return [r[0], r[1]]; }, 0.4, 2.6, (i) => f.relevant[i] === 1, 3.4);

  // The hill as contour lines, and the city on top: the only time the drawing shines, and slightly too perfect.
  const hill = t(svg("g", { class: "hill" }, s.draw));
  for (let k = 0; k < 6; k++) {
    const rx = 120 + k * 58, ry = 44 + k * 24, cy = HILL.y + 40 + k * 26;
    const pts: Pt[] = Array.from({ length: 49 }, (_, i) => { const a = (i / 48) * Math.PI * 2; return [HILL.x + rx * Math.cos(a) + Math.sin(a * 3 + k) * 6, cy + ry * Math.sin(a)]; });
    const c = svg("path", { d: exact(pts), stroke: "var(--grey)", "stroke-width": 1, opacity: 0.55, fill: "none" }, hill);
    gsap.set(c, { drawSVG: "0%" });
    drawIn(tl, c, 1 + k * 0.15, 1.2);
  }
  const sky = t(svg("g", { class: "skyline" }, s.draw));
  const glow = svg("path", { d: "", stroke: "var(--copper-light)", "stroke-width": 9, opacity: 0, fill: "none", "stroke-linejoin": "round" }, sky);
  const towers: Pt[] = [[HILL.x - 110, CITY_HZ], [HILL.x - 110, CITY_HZ - 60], [HILL.x - 80, CITY_HZ - 60], [HILL.x - 80, CITY_HZ - 110], [HILL.x - 50, CITY_HZ - 110],
    [HILL.x - 50, CITY_HZ - 40], [HILL.x - 20, CITY_HZ - 40], [HILL.x - 20, CITY_HZ - 150], [HILL.x + 10, CITY_HZ - 150], [HILL.x + 10, CITY_HZ - 70],
    [HILL.x + 40, CITY_HZ - 70], [HILL.x + 40, CITY_HZ - 120], [HILL.x + 70, CITY_HZ - 120], [HILL.x + 70, CITY_HZ - 50], [HILL.x + 110, CITY_HZ - 50], [HILL.x + 110, CITY_HZ]];
  glow.setAttribute("d", exact(towers));
  const line = svg("path", { d: hand(towers, "skyline", 0.5), stroke: "var(--copper)", "stroke-width": 2.4, fill: "none" }, sky);
  gsap.set(line, { drawSVG: "0%" });
  drawIn(tl, line, 2.2, 1.6);
  tl.to(glow, { opacity: 0.45, duration: 1.2 }, 3.4);
  const labs = t(svg("g", { class: "dest", opacity: 0 }, s.draw));
  ["Autonomous plant.", "Digital twin.", "Real time intelligence.", "AI agents."].forEach((w, i) =>
    label(labs, HILL.x - 160, 150 + i * 52, w, { size: 40, anchor: "end", fill: "var(--copper)", halo: true }));
  fadeIn(tl, labs, 4, 0.8);
  return tl;
};

/** Reveal a dashed line with a mask, since DrawSVG can't reveal a dash pattern. Returns the mask stroke to animate. */
function maskedDash(s: Sheet, d: string, attrs: Record<string, string | number>) {
  let defs = s.draw.querySelector("defs");
  if (!defs) defs = svg("defs", {}, s.draw);
  const id = "m" + Math.random().toString(36).slice(2, 8);
  const m = svg("mask", { id, maskUnits: "userSpaceOnUse", x: 0, y: 0, width: 1920, height: 1080 }, defs);
  const reveal = svg("path", { d, stroke: "#fff", "stroke-width": 12, fill: "none" }, m);
  const dashed = t(svg("path", { d, mask: `url(#${id})`, fill: "none", ...attrs }, s.draw));
  return { reveal, dashed };
}

// Click 29. "But we do not get there by teleportation." A dashed arc leaps from the figure to the city, then erases itself.
const teleport: Build = (s) => {
  const tl = gsap.timeline();
  const d = `M${FIG.x} ${FIG.top - 6}Q${(FIG.x + HILL.x) / 2} -120 ${HILL.x} ${CITY_HZ - 170}`;
  const { reveal, dashed } = maskedDash(s, d, { stroke: "var(--ink)", "stroke-width": 2, "stroke-dasharray": "10 10" });
  gsap.set(reveal, { drawSVG: "0%" });
  tl.to(reveal, { drawSVG: "0% 100%", duration: 1.1, ease: "power2.out" }, 0.2)
    .to(reveal, { drawSVG: "100% 100%", duration: 1.1, ease: "power2.in" }, 1.8)
    .set(dashed, { display: "none" }, 3);
  return tl;
};

// Click 30. "The road to that city is paved with data." Section B–B; the layers under the road; the road begins at his feet.
const paved: Build = (s) => {
  const tl = gsap.timeline();
  const { f, idx } = relevantIndex(s);
  const pts = roadFrom(START_FEET);                     // the cut crosses the road where it will run, from his feet
  const { p, deg } = along(pts, 0.42);
  const a = (deg + 90) * Math.PI / 180;
  const A: Pt = [p[0] - Math.cos(a) * 90, p[1] - Math.sin(a) * 90], B: Pt = [p[0] + Math.cos(a) * 90, p[1] + Math.sin(a) * 90];
  const cut = t(svg("g", { class: "cutB" }, s.draw));
  svg("path", { d: exact([A, B]), stroke: "var(--ink)", "stroke-width": 2.2, "stroke-dasharray": "30 8 5 8", fill: "none" }, cut);
  label(cut, A[0] - 10, A[1] - 12, "B", { size: 44, anchor: "end", weight: 600 });
  label(cut, B[0] + 10, B[1] + 34, "B", { size: 44, weight: 600 });
  gsap.set(cut, { opacity: 0 });
  tl.to(cut, { opacity: 1, duration: 0.6 }, 0.2);
  // The pavement in section, labelled from the bottom up
  const sec = t(svg("g", { class: "pavement" }, s.draw));
  const layers = ["Definitions.", "Ownership.", "Lineage.", "Quality.", "Context."];
  layers.forEach((w, i) => {
    const y = 880 - i * 50;
    const r = svg("rect", { x: 150, y: y - 44, width: 560, height: 44, fill: "var(--blue-pale)", "fill-opacity": 0.12 + i * 0.05, stroke: "var(--blueprint)", "stroke-width": 1.6 }, sec);
    const l = label(sec, 170, y - 10, w, { size: 36, fill: "var(--blue-text)" });
    gsap.set([r, l], { opacity: 0 });
    tl.to([r, l], { opacity: 1, duration: 0.5 }, 1 + i * 0.35);
  });
  // "…people who know what a number actually means." The road begins at the figure's feet.
  const lay = road(START_FEET);
  move(tl, f, (i) => { const r = lay(idx[i]); f.u[i] = r[2]; return [r[0], r[1]]; }, 3.6, 2.2, (i) => f.relevant[i] === 1);
  return tl;
};

// Click 31. "If that road is built from data nobody trusts…" Stones pale and crack; the road stops short of the hill.
const cracks: Build = (s) => {
  const tl = gsap.timeline();
  const f = getField(s);
  tl.to(s.draw.querySelectorAll(".pavement, .cutB"), { opacity: 0.2, duration: 0.8 }, 0);
  state(tl, f, { crack: 1, alpha: 0.6 }, 0.3, 1.8);
  state(tl, f, { reach: 0.72 }, 1, 2);
  return tl;
};

// Click 32. "We have simply built another Brasília." The glow fades. The skyline resolves into the Congresso. No words.
const another: Build = (s) => {
  const tl = gsap.timeline();
  const sky = s.draw.querySelector(".skyline");
  tl.to(s.draw.querySelectorAll(".skyline path"), { opacity: 0, duration: 1.4, ease: "sine.inOut" }, 0)
    .to(s.draw.querySelectorAll(".dest"), { opacity: 0, duration: 1 }, 0);
  const c = congresso(s.draw, HILL.x, CITY_HZ, "cn7", 1.1);
  t(c.g);
  const parts = [c.horizon, ...c.plinth, ...c.towers, ...c.joint, c.dome, ...c.bowl];
  gsap.set(parts, { drawSVG: "0%" });
  drawIn(tl, [c.horizon, ...c.plinth], 0.8, 0.8);
  drawIn(tl, [...c.towers, ...c.joint], 1.4, 1.1, 0.1);
  drawIn(tl, [c.dome, ...c.bowl], 2.2, 1.1);
  if (sky) tl.call(() => sky.remove(), [], 3.4);
  return tl;
};

export const ACT7: Record<number, Build> = { 28: city, 29: teleport, 30: paved, 31: cracks, 32: another };
