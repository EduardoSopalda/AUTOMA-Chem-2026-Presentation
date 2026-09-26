// Act 1. The Architect. Edu's own wall section makes "not as a metaphor" literally true.
// Only the lines that move are traced as SVG; the rest of the scan appears gently beneath.

import sectionUrl from "../../assets/architecture/crops/section-left.png";
import { hand, exact, type Pt } from "../draw/hand";
import { label, svg } from "../sheet";
import { gsap, t, clearPrevious, drawIn, ghost, copperFilter, GHOST_X, FIG, type Build } from "./common";

// Placement of the left section of the scan (crop px) on the sheet: ground floor on the figure's ground line.
const S = 1.2, CX = 94, CGROUND = 478;
const X0 = 700 - CX * S, Y0 = FIG.ground - CGROUND * S;
const P = (x: number, y: number): Pt => [X0 + x * S, Y0 + y * S];
const FLOORS = [128, 140, 230, 242, 325, 340, 470];           // slab lines, measured on the scan
const LAYERS = [134, 236, 332, 470];                           // each slab becomes one data layer
const COL_TOP = 32, COL_BOTTOM = 478;


// Click 2. "I drew buildings. Then I spent twenty years designing something else."
const section: Build = (s) => {
  const tl = gsap.timeline();
  clearPrevious(s, tl, 0);
  copperFilter(s.draw);
  const scan = t(svg("image", { class: "scan", href: sectionUrl, x: X0, y: Y0, width: 190 * S, height: 634 * S, filter: "url(#to-copper)", opacity: 0, preserveAspectRatio: "none" }, s.draw));
  tl.to(scan, { opacity: 0.35, duration: 2, ease: "sine.inOut" }, 0.2);

  const g = t(svg("g", { class: "lineage" }, s.draw));
  const floors = FLOORS.map((y, i) => svg("path", {
    class: "floor", "data-y": y, d: hand([P(0, y), P(165, y)], "floor" + i, 0.7),
    stroke: "var(--copper)", "stroke-width": 2, fill: "none", "vector-effect": "non-scaling-stroke",
  }, g));
  const col = svg("path", {                                     // from foundation to roof
    class: "spine", d: hand([P(CX, COL_BOTTOM), P(CX, COL_TOP)], "column", 0.5),
    stroke: "var(--copper)", "stroke-width": 3.4, fill: "none", "vector-effect": "non-scaling-stroke",
  }, g);
  gsap.set([...floors, col], { drawSVG: "0%" });
  drawIn(tl, floors, 0.8, 1.2, 0.18);                           // floors first
  drawIn(tl, col, 2.8, 2.2);                                    // then the red steel column

  // "…something else." The building fades around the column. It turns blue: a data spine, floors become layers.
  const at = 8;
  tl.to(scan, { opacity: 0, duration: 1.6, ease: "sine.inOut" }, at);
  floors.forEach((f) => {
    const y = Number(f.getAttribute("data-y"));
    const layer = LAYERS.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a));
    tl.to(f, { attr: { d: exact([P(-110, layer), P(270, layer)]) }, stroke: "var(--blueprint)", duration: 1.8, ease: "power2.inOut" }, at + 0.6);
  });
  tl.to(col, { attr: { d: exact([P(CX, COL_BOTTOM), P(CX, COL_TOP)]) }, stroke: "var(--blueprint)", duration: 1.6, ease: "power2.inOut" }, at + 0.4);
  const nodes = LAYERS.map((y) => svg("circle", { cx: P(CX, y)[0], cy: P(CX, y)[1], r: 7, fill: "var(--paper)", stroke: "var(--blueprint)", "stroke-width": 2, opacity: 0 }, g));
  tl.to(nodes, { opacity: 1, duration: 0.5, stagger: 0.15 }, at + 2.2);
  return tl;
};

// Click 3. "We design from above." The diagram lifts to the top of the frame and flattens into a plan.
const above: Build = (s) => {
  const tl = gsap.timeline();
  const g = s.draw.querySelector(".lineage");
  if (g) {
    // Flatten about the top of the spine, and move it over the centre of the sheet, at the height of every plan to come.
    const [sx, sy] = P(CX, COL_TOP);
    tl.to(g, { scaleY: 0.42, x: 960 - sx, y: 110 - sy, svgOrigin: `${sx} ${sy}`, duration: 3, ease: "power2.inOut" }, 0.2);
  }
  return tl;
};

// Click 4. "Someone has to extract the data, interpret it…" Five callouts, then the dimension line with no label.
const callouts: Build = (s) => {
  const tl = gsap.timeline();
  const c = t(svg("g", { class: "callouts1" }, s.draw));
  const words = ["Extract.", "Interpret.", "Challenge.", "Trust.", "Tell it that it is wrong."];
  const items = words.map((w, i) => label(c, GHOST_X - 30, 700 + i * 50, w, { size: 40, anchor: "end", fill: "var(--copper)" }));
  gsap.set(items, { opacity: 0 });
  tl.to(items, { opacity: 1, duration: 0.6, stagger: 0.7 }, 0.2);
  // "…the distance between the beautiful plan and ground level." Drawn in full ink, then it settles to a ghost.
  const gl = ghost(s);
  gsap.set(gl, { opacity: 0.7 });
  const parts = Array.from(gl.children);
  gsap.set(parts, { drawSVG: "0%" });
  drawIn(tl, parts[0], 5, 2.4);
  drawIn(tl, parts.slice(1), 7.2, 0.5, 0.1);
  tl.to(gl, { opacity: 0.12, duration: 2.5, ease: "sine.inOut" }, 9);
  return tl;
};

export const ACT1: Record<string, Build> = { 2: section, 3: above, 4: callouts };
