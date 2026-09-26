// Act 4. Sustainability has the same problem. Ambition at the top, evidence on the ground.

import { hand, exact, type Pt } from "../draw/hand";
import { label, setTitleBlock, svg, type Sheet } from "../sheet";
import { gsap, t, drawIn, fadeIn, FIG, type Build } from "./common";

const LINE_Y = 150;
const HANG = [{ x: 480, w: "Emissions." }, { x: 760, w: "Sourcing." }, { x: 1040, w: "Circularity." }, { x: 1320, w: "Footprints." }];
// Ground level network. "People" is the same word that settled at the figure's feet.
const NODES: { name: string; p: Pt; lx: number; ly: number; anchor: "start" | "middle" | "end" }[] = [
  { name: "Businesses.", p: [300, 700], lx: 300, ly: 660, anchor: "middle" },
  { name: "Processes.", p: [560, 830], lx: 560, ly: 890, anchor: "middle" },
  { name: "Systems.", p: [1180, 690], lx: 1180, ly: 650, anchor: "middle" },
  { name: "Suppliers.", p: [1500, 760], lx: 1500, ly: 720, anchor: "middle" },
  { name: "People.", p: [FIG.x, FIG.ground + 14], lx: FIG.x, ly: FIG.ground + 62, anchor: "middle" },
];
const EDGES: [number, number][] = [[0, 1], [1, 4], [4, 2], [2, 3], [0, 2], [1, 2]];

function gradient(s: Sheet) {
  let d = s.draw.querySelector("defs");
  if (!d) d = svg("defs", {}, s.draw);
  if (!d.querySelector("#plumb")) {
    // In sheet units: a vertical line has no width, so a bounding box gradient would not render.
    const g = svg("linearGradient", { id: "plumb", x1: 0, y1: LINE_Y + 100, x2: 0, y2: FIG.ground, gradientUnits: "userSpaceOnUse" }, d);
    svg("stop", { offset: "0%", "stop-color": "#762F0B" }, g);
    svg("stop", { offset: "100%", "stop-color": "#5F92B8" }, g);
  }
}

// Click 15. "We set ambitions, targets and roadmaps." The plaza grid lifts and becomes the copper target line.
const target: Build = (s, beat) => {
  const tl = gsap.timeline();
  tl.call(() => setTitleBlock(s, beat), [], 0.3);
  // Lift the plaza out of the masterplan; everything else of Act 3 leaves. The desire paths wait, hidden, for Act 4's network.
  const plaza = s.draw.querySelector(".plaza");
  if (plaza) { s.draw.appendChild(plaza); t(plaza); }
  const rest = Array.from(s.draw.querySelectorAll(":scope > .t")).filter((e) => e !== plaza);
  tl.to(rest, { opacity: 0, duration: 0.8, onComplete: () => rest.forEach((e) => { if (!e.classList.contains("used")) e.remove(); }) }, 0);
  if (plaza) tl.to(plaza, { opacity: 0.6, scaleY: 0.02, y: LINE_Y - 300, svgOrigin: "960 300", duration: 1.6, ease: "power2.inOut" }, 0.2)
    .to(plaza, { opacity: 0, duration: 0.4, onComplete: () => plaza.remove() }, 1.7);
  const g = t(svg("g", { class: "target" }, s.draw));
  const line = svg("path", { d: hand([[300, LINE_Y], [1620, LINE_Y]], "target", 0.6), stroke: "var(--copper)", "stroke-width": 2.6, fill: "none" }, g);
  gsap.set(line, { drawSVG: "50% 50%" });
  tl.to(line, { drawSVG: "0% 100%", duration: 1.6, ease: "power2.inOut" }, 1.4);
  const ticks = Array.from({ length: 11 }, (_, i) => svg("path", { d: exact([[300 + i * 132, LINE_Y - 12], [300 + i * 132, LINE_Y + 12]]), stroke: "var(--copper)", "stroke-width": 1.6 }, g));
  gsap.set(ticks, { opacity: 0 });
  tl.to(ticks, { opacity: 1, duration: 0.3, stagger: 0.05 }, 2.6);
  HANG.forEach((h, i) => {
    const hang = svg("path", { d: exact([[h.x, LINE_Y], [h.x, LINE_Y + 40]]), stroke: "var(--copper)", "stroke-width": 1.4 }, g);
    const l = label(g, h.x, LINE_Y + 84, h.w, { size: 40, anchor: "middle", fill: "var(--copper)" });
    l.classList.add("hang");
    gsap.set([hang, l], { opacity: 0 });
    tl.to([hang, l], { opacity: 1, duration: 0.5 }, 3.2 + i * 0.3);
  });
  return tl;
};

// Click 16. "But eventually the ambition has to become evidence." Plumb lines fall to the ground, copper to blue.
const evidence: Build = (s) => {
  const tl = gsap.timeline();
  gradient(s);
  const g = t(svg("g", { class: "plumbs" }, s.draw));
  HANG.forEach((h, i) => {
    const p = svg("path", { class: "plumb", d: exact([[h.x, LINE_Y + 100], [h.x, FIG.ground]]), stroke: "url(#plumb)", "stroke-width": 2, fill: "none" }, g);
    gsap.set(p, { drawSVG: "0%" });
    drawIn(tl, p, 0.3 + i * 0.2, 1.6);
  });
  const ev = t(label(s.draw, 250, FIG.ground - 12, "Evidence.", { size: 44, fill: "var(--blue-text)", halo: true }));
  fadeIn(tl, ev, 2.2, 0.8);
  // People. Planet. Progress. The three words from the cover return; People settles at the figure's feet.
  const ppp = t(svg("g", { class: "ppp" }, s.draw));
  const words = [["People.", 620], ["Planet.", 900], ["Progress.", 1180]].map(([w, x]) => {
    const l = label(ppp, x as number, 560, w as string, { size: 44, anchor: "middle", fill: "var(--copper)", halo: true });
    gsap.set(l, { opacity: 0 });
    return l;
  });
  tl.to(words, { opacity: 1, duration: 0.6, stagger: 0.3 }, 3.2)
    .to(words[0], { attr: { x: FIG.x, y: FIG.ground + 62 }, duration: 1.6, ease: "power2.inOut" }, 5);
  words[0].classList.add("people");
  return tl;
};

// Click 17. "…created across businesses, processes, systems, suppliers and people." The network, and a dot that changes on the way.
const network: Build = (s) => {
  const tl = gsap.timeline();
  tl.to(s.draw.querySelectorAll(".ppp text:not(.people)"), { opacity: 0.25, duration: 0.6 }, 0);
  const g = t(svg("g", { class: "network" }, s.draw));
  const old = s.draw.querySelectorAll(".used path");                // the desire paths return, now as the network's first edges
  tl.to(old, { opacity: 0, duration: 0.6 }, 0);
  EDGES.forEach(([a, b], i) => {
    const A = NODES[a].p, B = NODES[b].p, mid: Pt = [(A[0] + B[0]) / 2 + (i % 2 ? 40 : -40), (A[1] + B[1]) / 2 - 30];
    const e = svg("path", { class: "edge", d: hand([A, mid, B], "edge" + i, 1), stroke: "var(--blueprint)", "stroke-width": 2, fill: "none" }, g);
    gsap.set(e, { drawSVG: "0%" });
    drawIn(tl, e, 0.4 + i * 0.2, 1.1);
  });
  NODES.forEach((n, i) => {
    if (n.name === "People.") return;                                 // already on the sheet, at his feet
    const c = svg("circle", { cx: n.p[0], cy: n.p[1], r: 8, fill: "var(--paper)", stroke: "var(--blueprint)", "stroke-width": 2 }, g);
    const l = label(g, n.lx, n.ly, n.name, { size: 40, anchor: n.anchor, fill: "var(--blue-text)", halo: true });
    gsap.set([c, l], { opacity: 0 });
    tl.to([c, l], { opacity: 1, duration: 0.5 }, 1.2 + i * 0.2);
  });
  // One copper dot travels node to node, changing very slightly at each stop. It arrives recognisable, but different.
  const dot = svg("circle", { cx: NODES[0].p[0], cy: NODES[0].p[1], r: 9, fill: "var(--copper)", opacity: 0 }, g);
  const route = [0, 1, 4, 2, 3];
  const tints = ["#762F0B", "#7a3a1c", "#6f4a3a", "#5f5a5a", "#4f6b80"];
  tl.to(dot, { opacity: 1, duration: 0.4 }, 2.8);
  route.slice(1).forEach((k, i) => {
    tl.to(dot, { attr: { cx: NODES[k].p[0], cy: NODES[k].p[1], r: 9 - i * 0.8 }, fill: tints[i + 1], duration: 1.1, ease: "sine.inOut" }, 3.2 + i * 1.3);
  });
  return tl;
};

// Click 18. "Where did it come from? Who owns it?…" The inspection checklist. Accountable goes to the person.
const checklist: Build = (s) => {
  const tl = gsap.timeline();
  const g = t(svg("g", { class: "checklist" }, s.draw));
  const words = ["Source.", "Owner.", "Definition.", "Conflict.", "Accountable."].map((w, i) => {
    const l = label(g, 1500, 330 + i * 56, w, { size: 40, fill: "var(--blue-text)", halo: true });
    gsap.set(l, { opacity: 0 });
    return l;
  });
  tl.to(words, { opacity: 1, duration: 0.5, stagger: 0.5 }, 0.2);
  // "…who is prepared to stand behind it" Only a person can stand behind a number.
  tl.to(words[4], { attr: { x: FIG.x + 50, y: FIG.top + 40 }, fill: "var(--copper)", duration: 1.8, ease: "power2.inOut" }, 3.4);
  // "…stop being two separate conversations." The plumb lines lock into the network: one structure.
  const plumbs = Array.from(s.draw.querySelectorAll(".plumb"));
  const targets: Pt[] = [NODES[0].p, NODES[1].p, NODES[2].p, NODES[3].p];
  plumbs.forEach((p, i) => tl.to(p, { attr: { d: exact([[HANG[i].x, LINE_Y + 100], targets[i]]) }, duration: 1.4, ease: "power2.inOut" }, 5.6));
  return tl;
};

export const ACT4: Record<number, Build> = { 15: target, 16: evidence, 17: network, 18: checklist };
