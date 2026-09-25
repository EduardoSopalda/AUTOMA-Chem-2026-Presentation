// Act 5. The carbon number. Real public figures, verified in notes/sources.md.

import { hand, exact } from "../draw/hand";
import { label, setTitleBlock, svg, type Sheet } from "../sheet";
import { gsap, t, clearPrevious, drawIn, fadeIn, wipe, GHOST_X, type Build } from "./common";

const SOURCE = "Scope 1, 2 and 3, 2025: 11,002 kt CO2e. Scope 3: 10,280 kt, so 93% (our calculation). Scope 2: 140 kt market based, 464 kt location based. Source: dsm-firmenich Integrated Annual Report 2025.";

// The structure under the number: a roof on six piles. The property line separates our walls from everything outside.
const ROOF_Y = 350, PILE_BOTTOM = 630, WALL_X = 700;
const PILES: { x: number; name: string[]; inside: boolean }[] = [
  { x: 330, name: ["Energy", "meters"], inside: true },
  { x: 560, name: ["Batch", "records"], inside: true },
  { x: 860, name: ["Supplier", "declarations"], inside: false },
  { x: 1110, name: ["Transport"], inside: false },
  { x: 1360, name: ["Allocation", "rules"], inside: false },
  { x: 1600, name: ["Assumptions"], inside: false },
];

// Click 19. "A carbon number looks like chemistry. It is not. It is a data product."
const number: Build = (s, beat) => {
  const tl = gsap.timeline();
  clearPrevious(s, tl, 0);
  tl.call(() => setTitleBlock(s, beat, SOURCE), [], 0.3);
  const num = t(label(s.draw, 960, 290, "11,002 kt CO2e", { family: "serif", size: 112, anchor: "middle", weight: 500 }));
  num.classList.add("number");
  fadeIn(tl, num, 0.4, 1.4);

  const chem = t(label(s.draw, 1400, 400, "Chemistry", { size: 44, anchor: "middle" }));
  chem.classList.add("chem");
  fadeIn(tl, chem, 1.4, 0.8);
  // On "It is not": a copper revision cloud circles the label, and it changes.
  const cloud = t(svg("path", { class: "cloud", d: revisionCloud(1400, 385, 170, 44), fill: "none", stroke: "var(--copper)", "stroke-width": 2.2, "stroke-linecap": "round" }, s.draw));
  gsap.set(cloud, { drawSVG: "0%" });
  drawIn(tl, cloud, 3, 1.4);
  const dp = t(label(s.draw, 1400, 400, "Data product", { size: 44, anchor: "middle" }));
  dp.classList.add("dp");
  gsap.set(dp, { opacity: 0 });
  tl.to(chem, { opacity: 0, duration: 0.5 }, 4.4).to(dp, { opacity: 1, duration: 0.6 }, 4.7);
  return tl;
};

/** A revision cloud: a chain of small arcs around an ellipse, as on a marked up drawing. */
function revisionCloud(cx: number, cy: number, rx: number, ry: number, n = 16) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2, x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
    if (i === 0) d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
    else d += `A${(rx * 0.24).toFixed(1)} ${(rx * 0.24).toFixed(1)} 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

// Click 20. "Behind one apparently simple number…" The number becomes a roof on piles; the property line cuts through.
const piles: Build = (s) => {
  const tl = gsap.timeline();
  const gone = s.draw.querySelectorAll(".dp, .chem, .cloud");
  tl.to(gone, { opacity: 0, duration: 0.6, onComplete: () => gone.forEach((e) => e.remove()) }, 0);
  const g = t(svg("g", { class: "structure" }, s.draw));
  const roof = svg("path", { d: hand([[250, ROOF_Y], [1680, ROOF_Y]], "a5-roof", 1), stroke: "var(--copper)", "stroke-width": 3, fill: "none" }, g);
  gsap.set(roof, { drawSVG: "0%" });
  drawIn(tl, roof, 0.4, 1.4);
  PILES.forEach((p, i) => {
    // Outside our walls, each source draws its line its own way: the definitions don't match.
    const style: Record<string, number> = p.inside ? { "stroke-width": 2.2 } : [{ "stroke-width": 1.4 }, { "stroke-width": 3 }, { "stroke-width": 2, opacity: 0.7 }, { "stroke-width": 1.2 }][i - 2];
    const pile = svg("path", { class: "pile", d: exact([[p.x, ROOF_Y], [p.x, PILE_BOTTOM]]), stroke: "var(--blueprint)", fill: "none", ...style }, g);
    const foot = svg("path", { d: exact([[p.x - 22, PILE_BOTTOM], [p.x + 22, PILE_BOTTOM]]), stroke: "var(--blueprint)", "stroke-width": 2, fill: "none" }, g);
    gsap.set([pile, foot], { drawSVG: "0%" });
    drawIn(tl, [pile, foot], 1.4 + i * 0.25, 0.9);
    const lab = svg("g", { class: "pile-label", opacity: 0 }, g);
    p.name.forEach((w, k) => label(lab, p.x, PILE_BOTTOM + 50 + k * 44, w, { size: 36, anchor: "middle", halo: true }));
    fadeIn(tl, lab, 1.8 + i * 0.25, 0.6);
  });
  // The property line: dash dot, revealed with a wipe (DrawSVG can't reveal a dashed line)
  const wall = t(svg("path", { class: "wall", d: exact([[WALL_X, 330], [WALL_X, 780]]), stroke: "var(--ink)", "stroke-width": 2, "stroke-dasharray": "34 9 4 9", fill: "none" }, s.draw)) as SVGPathElement;
  const w = wipe(s, wall, { x: WALL_X - 10, y: 330, w: 20, h: 450 }, "bottom");
  tl.to(w.rect, { ...w.to, duration: 1.6, ease: "power1.inOut" }, 3.4);
  const out = t(label(s.draw, 1235, 520, "93% outside our walls", { size: 44, anchor: "middle", halo: true }));
  out.classList.add("outside");
  fadeIn(tl, out, 4.8, 0.8);
  return tl;
};

// Click 21. "The challenge is being able to explain that number." Scope 2 splits in two.
const scope2: Build = (s) => {
  const tl = gsap.timeline();
  tl.to(s.draw.querySelectorAll(".structure, .wall, .number"), { opacity: 0.1, duration: 0.8 }, 0)
    .to(s.draw.querySelectorAll(".outside"), { opacity: 0, duration: 0.5 }, 0);
  const g = t(svg("g", { class: "scope2" }, s.draw));
  // The energy meters pile splits in two: one copper, one blue.
  const x = PILES[0].x;
  const a = svg("path", { d: hand([[x, ROOF_Y], [x - 40, PILE_BOTTOM]], "a5-mb", 0.8), stroke: "var(--copper)", "stroke-width": 2.6, fill: "none" }, g);
  const b = svg("path", { d: exact([[x, ROOF_Y], [x + 40, PILE_BOTTOM]]), stroke: "var(--blueprint)", "stroke-width": 2.6, fill: "none" }, g);
  gsap.set([a, b], { drawSVG: "0%" });
  drawIn(tl, [a, b], 0.6, 1.2);
  const l1 = label(g, 960, 470, "140 kt market based", { size: 52, anchor: "middle", fill: "var(--copper)", halo: true });
  const l2 = label(g, 960, 548, "464 kt location based", { size: 52, anchor: "middle", fill: "var(--blue-text)", halo: true });
  const l3 = label(g, 960, 650, "Same electricity. Two correct answers.", { family: "serif", size: 52, anchor: "middle", halo: true });
  gsap.set([l1, l2, l3], { opacity: 0 });
  fadeIn(tl, [l1, l2], 1.4, 0.8, 0.5);
  fadeIn(tl, l3, 3, 1);
  return tl;
};

// Click 22. "Someone has to know which source is right." The callouts return, rewritten. Lineage turns solid blue, each line with an owner.
const owners: Build = (s) => {
  const tl = gsap.timeline();
  tl.to(s.draw.querySelectorAll(".scope2"), { opacity: 0, duration: 0.6 }, 0)
    .to(s.draw.querySelectorAll(".structure, .number, .wall, .outside"), { opacity: 1, duration: 0.8 }, 0.3);
  const g = t(svg("g", { class: "owners" }, s.draw));
  PILES.forEach((p, i) => {
    const line = svg("path", { d: exact([[p.x, ROOF_Y], [p.x, PILE_BOTTOM]]), stroke: "var(--blueprint)", "stroke-width": 3, fill: "none" }, g);
    const tick = svg("circle", { cx: p.x, cy: PILE_BOTTOM - 36, r: 7, fill: "var(--blueprint)" }, g);   // an owner on every line
    gsap.set(line, { drawSVG: "0%" }); gsap.set(tick, { opacity: 0 });
    drawIn(tl, line, 0.6 + i * 0.12, 0.9);
    tl.to(tick, { opacity: 1, duration: 0.3 }, 1.3 + i * 0.12);
  });
  const c = t(svg("g", { class: "callouts", opacity: 0 }, s.draw));
  label(c, GHOST_X - 30, 850, "Know. Understand.", { size: 44, anchor: "end", fill: "var(--copper)" });
  label(c, GHOST_X - 30, 904, "Challenge. Explain.", { size: 44, anchor: "end", fill: "var(--copper)" });
  fadeIn(tl, c, 1.8, 0.8);
  return tl;
};

// Click 23. "You cannot report what you cannot trace." Everything quietens. One line. Protected silence.
const trace: Build = (s: Sheet) => {
  const tl = gsap.timeline();
  tl.to(s.draw.querySelectorAll(":scope > .t:not(.scope2)"), { opacity: 0.06, duration: 1.4, ease: "sine.inOut" }, 0)
    .to(s.draw.querySelectorAll(".scope2"), { opacity: 0, duration: 0.8 }, 0);
  const line = t(label(s.draw, 960, 520, "You cannot report what you cannot trace.", { family: "serif", size: 76, anchor: "middle", halo: true }));
  fadeIn(tl, line, 1.2, 1.4);
  return tl;
};

export const ACT5: Record<number, Build> = { 19: number, 20: piles, 21: scope2, 22: owners, 23: trace };
