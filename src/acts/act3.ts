// Act 3. When the drawing meets the ground. The move from plan to ground is a section cut, never a zoom.

import figureUrl from "../../assets/figure/figure.svg";
import { hand, exact, type Pt } from "../draw/hand";
import { label, setTitleBlock, svg, type Sheet } from "../sheet";
import { gsap, t, clearPrevious, drawIn, fadeIn, wipe, FIG, type Build } from "./common";

// The symmetrical masterplan, at the height of every plan in the talk.
const BLOCKS = [
  { name: ["Policy."], x: 520, y: 170, w: 300, h: 110, side: "left" },
  { name: ["Controls."], x: 520, y: 320, w: 300, h: 110, side: "left" },
  { name: ["Committee."], x: 1100, y: 170, w: 300, h: 110, side: "right" },
  { name: ["Operating", "model."], x: 1100, y: 320, w: 300, h: 110, side: "right" },
];
const PLAZA = { x: 860, y: 200, cell: 50, n: 4 };          // the RACI matrix, 4 by 4, is the grand plaza
const RACI: [number, number, string][] = [[0, 0, "R"], [1, 0, "A"], [2, 1, "C"], [3, 1, "I"], [0, 2, "A"], [1, 2, "R"], [3, 2, "C"], [2, 3, "R"], [0, 3, "I"], [3, 3, "A"]];

// Click 9. "We build governance in a very similar way." The wings straighten into copper blocks; the RACI draws itself.
const masterplan: Build = (s, beat) => {
  const tl = gsap.timeline();
  const plan = s.draw.querySelector("#plan2");
  clearPrevious(s, tl, 0, plan ? [plan] : []);
  tl.call(() => setTitleBlock(s, beat), [], 0.3);
  const g = t(svg("g", { class: "master" }, s.draw));

  // Nothing thrown away: every small block of the city slides into the straight rows of governance.
  if (plan) {
    const rects = Array.from(plan.querySelectorAll("rect"));
    const slots: Pt[] = [];
    BLOCKS.forEach((b) => { for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) slots.push([b.x + 22 + c * 36, b.y + 20 + r * 30]); });
    rects.forEach((rc, i) => {
      const [x, y] = slots[Math.floor((i * slots.length) / rects.length)];
      rc.removeAttribute("transform");
      tl.fromTo(rc, { attr: { x: Number(rc.getAttribute("x")), y: Number(rc.getAttribute("y")) } },
        { attr: { x, y, width: 20, height: 16 }, duration: 2.2, ease: "power2.inOut" }, 0.4 + (i % 12) * 0.03);
      g.appendChild(rc);
    });
    tl.to(plan, { opacity: 0, duration: 1, onComplete: () => plan.remove() }, 0.4);
  }
  // The block outlines and their names
  BLOCKS.forEach((b, i) => {
    const o = svg("path", { d: hand([[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.h], [b.x, b.y + b.h], [b.x, b.y]], "blk" + i, 0.8), stroke: "var(--copper)", "stroke-width": 2.2, fill: "none", class: "outline" }, g);
    gsap.set(o, { drawSVG: "0%" });
    drawIn(tl, o, 2.2 + i * 0.2, 1.2);
    const lab = svg("g", { opacity: 0 }, g);
    b.name.forEach((w, k) => label(lab, b.side === "left" ? b.x - 24 : b.x + b.w + 24, b.y + 64 + k * 44 - (b.name.length - 1) * 22, w, { size: 40, anchor: b.side === "left" ? "end" : "start" }));
    fadeIn(tl, lab, 2.8 + i * 0.2, 0.6);
  });
  // The plaza: a RACI matrix draws itself, then R, A, C and I drop into their cells with satisfying precision.
  const pz = svg("g", { class: "plaza" }, g);
  const { x, y, cell, n } = PLAZA;
  const lines: SVGElement[] = [];
  for (let i = 0; i <= n; i++) {
    lines.push(svg("path", { d: exact([[x + i * cell, y], [x + i * cell, y + n * cell]]), stroke: "var(--copper)", "stroke-width": 1.6 }, pz));
    lines.push(svg("path", { d: exact([[x, y + i * cell], [x + n * cell, y + i * cell]]), stroke: "var(--copper)", "stroke-width": 1.6 }, pz));
  }
  gsap.set(lines, { drawSVG: "0%" });
  drawIn(tl, lines, 3.6, 0.8, 0.06);
  RACI.forEach(([c, r, ch], i) => {
    const l = label(pz, x + c * cell + cell / 2, y + r * cell + 36, ch, { size: 32, anchor: "middle", weight: 600, fill: "var(--copper)" });
    tl.fromTo(l, { opacity: 0, attr: { y: y + r * cell - 10 } }, { opacity: 1, attr: { y: y + r * cell + 36 }, duration: 0.35, ease: "back.out(2)" }, 5 + i * 0.14);
  });
  return tl;
};

// Click 10. "Seen from above…" Three viewpoints along the top edge, sight lines onto the plan.
const sight: Build = (s) => {
  const tl = gsap.timeline();
  const g = t(svg("g", { class: "sight" }, s.draw));
  const who: [string, number, Pt[]][] = [
    ["Auditor.", 560, [[670, 225], [960, 250]]],
    ["Regulator.", 960, [[760, 375], [1160, 225]]],
    ["Steering committee.", 1360, [[1250, 375], [960, 350]]],
  ];
  who.forEach(([name, x, targets], i) => {
    const l = label(g, x, 110, name, { size: 40, anchor: "middle" });
    gsap.set(l, { opacity: 0 });
    tl.to(l, { opacity: 1, duration: 0.6 }, i * 0.4);
    targets.forEach((p, k) => {
      const ln = svg("path", { d: exact([[x, 126], p]), stroke: "var(--ink)", "stroke-width": 1, opacity: 0.55, fill: "none" }, g);
      gsap.set(ln, { drawSVG: "0%" });
      drawIn(tl, ln, 0.5 + i * 0.4 + k * 0.1, 0.9);
    });
  });
  return tl;
};

// Click 11. "Then the framework reaches the plant." A section line A–A cuts across the plan. Hold for the pause.
const cut: Build = (s) => {
  const tl = gsap.timeline();
  tl.to(s.draw.querySelectorAll(".sight"), { opacity: 0.25, duration: 0.6 }, 0);
  const y = 300;
  const g = t(svg("g", { class: "cutline" }, s.draw)) as SVGGElement;
  svg("path", { d: exact([[270, y], [1790, y]]), stroke: "var(--ink)", "stroke-width": 2.4, "stroke-dasharray": "40 10 6 10", fill: "none" }, g);
  for (const x of [270, 1790]) {
    svg("path", { d: `M${x} ${y}V${y + 44}M${x - 9} ${y + 30}L${x} ${y + 44}L${x + 9} ${y + 30}`, stroke: "var(--ink)", "stroke-width": 2.4, fill: "none" }, g);
    label(g, x, y - 18, "A", { size: 44, anchor: "middle", weight: 600 });
  }
  const w = wipe(s, g, { x: 240, y: y - 70, w: 1580, h: 130 }, "left");
  tl.to(w.rect, { ...w.to, duration: 1.6, ease: "power1.inOut" }, 0.3);
  return tl;
};

// Click 12. "The policy may be too long to cross…" Copper turns blue; the section appears below at 1 : 1.
const WALLS = [{ x: 330, w: 530, h: 190, name: "Policy" }, { x: 1150, w: 70, h: 260, name: "" }];
const ground = (s: Sheet): number => { void s; return FIG.ground; };

const section: Build = (s) => {
  const tl = gsap.timeline();
  tl.to(s.draw.querySelectorAll(".master .outline, .plaza path, #plan2 rect, .master rect"), { stroke: "var(--blueprint)", duration: 1.2 }, 0)
    .to(s.draw.querySelectorAll(".plaza text"), { fill: "var(--blue-text)", duration: 1.2 }, 0);
  const G = ground(s);
  const g = t(svg("g", { class: "section" }, s.draw));
  const gl = svg("path", { d: exact([[250, G], [1345, G]]), stroke: "var(--blueprint)", "stroke-width": 2.4, fill: "none" }, g);
  gsap.set(gl, { drawSVG: "0%" });
  drawIn(tl, gl, 1, 1.2);
  WALLS.forEach((w, i) => {
    const r = svg("path", { d: exact([[w.x, G], [w.x, G - w.h], [w.x + w.w, G - w.h], [w.x + w.w, G]]), stroke: "var(--blueprint)", "stroke-width": 2.4, fill: "var(--blue-pale)", "fill-opacity": 0.25 }, g);
    gsap.set(r, { drawSVG: "0%", fillOpacity: 0 });
    drawIn(tl, r, 1.6 + i * 0.3, 1.2);
    tl.to(r, { fillOpacity: 0.25, duration: 0.8 }, 2.6 + i * 0.3);
    if (w.name) { const l = label(g, w.x + w.w / 2, G - w.h / 2 + 14, w.name, { size: 40, anchor: "middle", fill: "var(--blue-text)" }); gsap.set(l, { opacity: 0 }); tl.to(l, { opacity: 1, duration: 0.6 }, 2.8); }
  });
  // The process is the wide gap the figure stands in
  const gapLab = label(g, 1005, G - 300, "Process", { size: 40, anchor: "middle", fill: "var(--blue-text)", halo: true });
  const gapDim = svg("path", { d: `M868 ${G - 316}H1142M868 ${G - 326}V${G - 306}M1142 ${G - 326}V${G - 306}`, stroke: "var(--blue-text)", "stroke-width": 1.4, fill: "none" }, g);
  gsap.set([gapLab, gapDim], { opacity: 0 });
  tl.to([gapLab, gapDim], { opacity: 1, duration: 0.6 }, 3.2);
  const tue = svg("g", { opacity: 0 }, g);
  label(tue, 1005, G - 220, "Tuesday, 07:40.", { size: 40, anchor: "middle" });
  label(tue, 1005, G - 172, "Plant running.", { size: 40, anchor: "middle" });
  fadeIn(tl, tue, 4, 0.8);
  // Two figures, one each side of a wall. Same word, two meanings, three years.
  const twin = svg("image", { href: figureUrl, x: 1250, y: FIG.top, height: 120, width: 72, opacity: 0 }, g);
  tl.to(twin, { opacity: 1, duration: 0.8 }, 7);
  const b1 = label(g, FIG.x, FIG.top - 24, "batch", { size: 44, anchor: "middle", fill: "var(--copper)" });
  const b2 = label(g, 1286, FIG.top - 24, "batch", { size: 44, anchor: "middle", fill: "var(--blue-text)" });
  const dim = svg("path", { d: `M${FIG.x + 60} ${FIG.top - 36}H1236M${FIG.x + 60} ${FIG.top - 46}V${FIG.top - 26}M1236 ${FIG.top - 46}V${FIG.top - 26}`, stroke: "var(--ink)", "stroke-width": 1.4, fill: "none" }, g);
  const yrs = label(g, 1113, FIG.top - 52, "3 years", { size: 40, anchor: "middle", halo: true });
  gsap.set([b1, b2, dim, yrs], { opacity: 0 });
  tl.to([b1, b2], { opacity: 1, duration: 0.6, stagger: 0.3 }, 7.8)
    .to([dim, yrs], { opacity: 1, duration: 0.6 }, 8.6)
    .to(tue, { opacity: 0, duration: 0.6 }, 7.4);
  return tl;
};

// The desire paths go around the plaza, never into it.
const ROUTES: Pt[][] = [
  [[470, 470], [700, 450], [850, 175], [1070, 175], [1220, 450], [1450, 470]],
  [[470, 470], [720, 470], [860, 440], [1060, 440], [1200, 470], [1450, 470]],
];

// Click 13. "I have been the person with the beautiful drawing…" Back to the plan. People walk around the plaza.
const around: Build = (s) => {
  const tl = gsap.timeline();
  tl.to(s.draw.querySelectorAll(".section, .cutline, .sight"), { opacity: 0, duration: 1 }, 0)
    .to(s.draw.querySelectorAll(".master .outline, .plaza path, .master rect"), { stroke: "var(--copper)", duration: 1 }, 0)
    .to(s.draw.querySelectorAll(".plaza text"), { fill: "var(--copper)", duration: 1 }, 0);
  const g = t(svg("g", { class: "desire" }, s.draw));
  ROUTES.forEach((pts, r) => {
    const p = svg("path", { class: "route", d: hand(pts, "route" + r, 1.2), stroke: "var(--ink)", "stroke-width": 2, "stroke-dasharray": "8 8", fill: "none" }, g) as SVGPathElement;
    const w = wipe(s, p, { x: 440, y: 150, w: 1040, h: 350 }, "left");
    tl.to(w.rect, { ...w.to, duration: 5, ease: "none" }, 1 + r * 0.6);
    const len = p.getTotalLength?.() ?? 1200;
    for (let i = 0; i < 5; i++) {
      const d = svg("circle", { r: 4.5, fill: "var(--ink)", opacity: 0 }, g);
      const walk = { f: 0 };
      tl.to(d, { opacity: 1, duration: 0.3 }, 1 + r * 0.6 + i * 0.5)
        .to(walk, { f: 1, duration: 5, ease: "none", onUpdate: () => {
          const pt = p.getPointAtLength(walk.f * len);
          d.setAttribute("cx", String(pt.x)); d.setAttribute("cy", String(pt.y));
        } }, 1 + r * 0.6 + i * 0.5)
        .to(d, { opacity: 0, duration: 0.4 }, 5.6 + r * 0.6 + i * 0.5);
    }
  });
  return tl;
};

// Click 14. "So I stopped being interested only in whether a framework was complete." Complete. Used.
const used: Build = (s) => {
  const tl = gsap.timeline();
  const g = t(svg("g", { class: "used" }, s.draw));
  ROUTES.forEach((pts, r) => {
    const p = svg("path", { d: hand(pts, "route" + r, 1.2), stroke: "var(--blueprint)", "stroke-width": 3, fill: "none" }, g);
    gsap.set(p, { drawSVG: "0%" });
    drawIn(tl, p, 0.8 + r * 0.3, 2);
  });
  tl.to(s.draw.querySelectorAll(".desire .route"), { opacity: 0, duration: 1 }, 2.6)
    .to(s.draw.querySelectorAll(".plaza"), { opacity: 0.3, duration: 1.2 }, 2.6);
  const c = label(g, 960, 520, "Complete.", { size: 44, anchor: "middle", fill: "var(--copper)" });
  const u = label(g, 1450, 530, "Used.", { size: 44, anchor: "middle", fill: "var(--blue-text)" });
  gsap.set([c, u], { opacity: 0 });
  tl.to(c, { opacity: 1, duration: 0.6 }, 0.2).to(u, { opacity: 1, duration: 0.6 }, 2.2);
  return tl;
};

export const ACT3: Record<number, Build> = { 9: masterplan, 10: sight, 11: cut, 12: section, 13: around, 14: used };
