// Act 6. Why don't we just use AI? AI never gets a picture. Only a voice (a margin note) and a consequence.

import { exact, type Pt } from "../draw/hand";
import { label, setTitleBlock, svg } from "../sheet";
import { getField, move, state } from "../draw/field";
import { gsap, t, fadeIn, wipe, type Build } from "./common";

const C: Pt = [960, 430];                          // where "batch" sits
const DEFS = ["production run", "lot number", "shipping unit", "recipe version", "data load", "blend", "campaign", "QC sample"];
const LINE_X = 700;                                // the property line, drawn before the documents enter

// Click 24. "And then, inevitably, someone says: why don't we just use AI?"
const note: Build = (s, beat) => {
  const tl = gsap.timeline();
  tl.call(() => setTitleBlock(s, beat), [], 0.2);
  // Handoff: the foundation lines of Act 5 regroup around the word "batch" (planted in Act 3)
  const piles = Array.from(s.draw.querySelectorAll(".structure .pile"));
  piles.forEach((p, i) => {
    const a = (i / piles.length) * Math.PI * 2 - Math.PI / 2;
    tl.to(p, { attr: { d: exact([[C[0] + Math.cos(a) * 70, C[1] + Math.sin(a) * 50], [C[0] + Math.cos(a) * 120, C[1] + Math.sin(a) * 86]]) }, opacity: 1, duration: 1.4, ease: "power2.inOut" }, 0.2);
  });
  const rest = Array.from(s.draw.querySelectorAll(":scope > .t")).filter((e) => !e.classList.contains("structure"));
  tl.to(rest, { opacity: 0, duration: 0.8, onComplete: () => rest.forEach((e) => e.remove()) }, 0);
  tl.to(s.draw.querySelectorAll(".structure > :not(.pile)"), { opacity: 0, duration: 0.6 }, 0)
    .to(s.draw.querySelectorAll(".structure"), { opacity: 1, duration: 0.6 }, 0);
  const batch = t(label(s.draw, C[0], C[1] + 20, "batch", { size: 60, anchor: "middle", weight: 500 }));
  batch.classList.add("batch");
  fadeIn(tl, batch, 1.2, 0.8);
  // AI speaks only as a margin note, in another hand, in blue
  const m = t(label(s.draw, 1824, 160, "Why don't we just use AI?", { family: "serif", italic: true, size: 48, anchor: "end", fill: "var(--blue-text)" }));
  m.classList.add("margin");
  fadeIn(tl, m, 2.2, 1);
  return tl;
};

// Click 25. "If five people use the word batch to mean eight different things…" One fan, then the echoes.
const fan: Build = (s) => {
  const tl = gsap.timeline();
  tl.to(s.draw.querySelectorAll(".structure"), { opacity: 0, duration: 0.6 }, 0);
  const g = t(svg("g", { class: "fan" }, s.draw));
  DEFS.forEach((d, i) => {
    const a = (i / DEFS.length) * Math.PI * 2 - Math.PI / 2 + 0.2;
    const end: Pt = [C[0] + Math.cos(a) * 400, C[1] + Math.sin(a) * 262];
    const br = svg("path", { d: exact([[C[0] + Math.cos(a) * 80, C[1] + Math.sin(a) * 50], end]), stroke: "var(--ink)", "stroke-width": 1.4 }, g);
    gsap.set(br, { drawSVG: "0%" });
    drawOne(tl, br, 0.2 + i * 0.05);
    const l = label(g, end[0] + Math.cos(a) * 16, end[1] + Math.sin(a) * 16 + 14, d, { size: 44, anchor: Math.cos(a) > 0.2 ? "start" : Math.cos(a) < -0.2 ? "end" : "middle", halo: true });
    gsap.set(l, { opacity: 0 });
    tl.to(l, { opacity: 1, duration: 0.5 }, 0.6 + i * 0.05);
  });
  // "It can simply scale it up." The branches echo outward: dozens, then hundreds.
  const echoes = t(svg("g", { class: "echoes" }, s.draw));
  [[24, 460, 0.5], [72, 600, 0.32], [220, 760, 0.2]].forEach(([n, r, o], k) => {
    const ring = svg("g", { opacity: 0 }, echoes);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      svg("path", { d: exact([[C[0] + Math.cos(a) * r, C[1] + Math.sin(a) * r * 0.62], [C[0] + Math.cos(a) * (r + 30), C[1] + Math.sin(a) * (r + 30) * 0.62]]), stroke: "var(--ink)", "stroke-width": 1 }, ring);
    }
    tl.to(ring, { opacity: o, duration: 0.8 }, 3 + k * 0.9);
  });
  return tl;
};
function drawOne(tl: gsap.core.Timeline, el: Element, at: number) { tl.fromTo(el, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.7, ease: "power2.out" }, at); }

// Click 26. "Around ten thousand documents went in… roughly two thousand were actually relevant…"
const documents: Build = (s) => {
  const tl = gsap.timeline();
  const f = getField(s);
  f.st.shown = 0; f.draw();
  tl.to(s.draw.querySelectorAll(".fan, .echoes, .batch"), { opacity: 0, duration: 1 }, 0.4);
  state(tl, f, { shown: 1 }, 0.3, 2.2);                        // the echoes break into 10,000 points
  const ten = t(label(s.draw, 150, 110, "10,000 documents", { size: 44, halo: true }));
  fadeIn(tl, ten, 1.6, 0.8);
  state(tl, f, { waste: 0.35 }, 3.6, 1.4);                      // 8,000 fade to pale
  state(tl, f, { blue: 1 }, 4.2, 1.2);                          // 2,000 turn blue
  const tags = t(svg("g", { class: "tags", opacity: 0 }, s.draw));
  [["Duplicate", 290, 250], ["Superseded draft", 830, 440], ["final_v4_FINAL_2.pptx", 1370, 640]].forEach(([w, x, y]) =>
    label(tags, x as number, y as number, w as string, { size: 36, halo: true, fill: "var(--grey)" }));
  fadeIn(tl, tags, 5, 0.8);
  state(tl, f, { glow: 1 }, 6, 1.6);                            // "All of it was consuming tokens and energy."
  return tl;
};

// Click 27. "So filtering before you embed…" The line comes first. Then batch gets one meaning.
const filter: Build = (s) => {
  const tl = gsap.timeline();
  const f = getField(s);
  tl.to(s.draw.querySelectorAll(".tags"), { opacity: 0, duration: 0.6 }, 0);
  const wall = t(svg("path", { d: exact([[LINE_X, 120], [LINE_X, 800]]), stroke: "var(--ink)", "stroke-width": 2, "stroke-dasharray": "34 9 4 9", fill: "none" }, s.draw)) as SVGPathElement;
  const w = wipe(s, wall, { x: LINE_X - 10, y: 120, w: 20, h: 680 }, "bottom");
  tl.to(w.rect, { ...w.to, duration: 1.2, ease: "power1.inOut" }, 0.2);
  // The 8,000 stay outside, pale; only the 2,000 cross
  // Two independent hashes, so x and y don't correlate into lines
  const r = (i: number, k: number) => { const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
  move(tl, f, (i) => f.relevant[i]
    ? [LINE_X + 60 + r(i, 1) * 1040, 150 + r(i, 2) * 620]
    : [160 + r(i, 3) * (LINE_X - 200), 150 + r(i, 4) * 620], 1.4, 2.4);
  state(tl, f, { waste: 0.18, glow: 0.4 }, 2.4, 1.2);
  const words = t(svg("g", { class: "line-words", opacity: 0 }, s.draw));
  ["Governance.", "Cost.", "Sustainability."].forEach((w2, i) => label(words, LINE_X + 20, 260 + i * 60, w2, { size: 44, halo: true }));
  fadeIn(tl, words, 3.4, 0.8);
  // "…agreeing on what a word means." Batch returns; eight meanings collapse into one glossary entry.
  const gl = t(svg("g", { class: "glossary", opacity: 0 }, s.draw));
  label(gl, 780, 540, "batch:", { size: 60, halo: true, weight: 500 });
  svg("path", { d: exact([[780, 556], [950, 556]]), stroke: "var(--ink)", "stroke-width": 2 }, gl);
  label(gl, 780, 624, "one production run, from charge to discharge.", { size: 44, halo: true, fill: "var(--blue-text)" });
  fadeIn(tl, gl, 5.2, 1);
  return tl;
};

export const ACT6: Record<number, Build> = { 24: note, 25: fan, 26: documents, 27: filter };
