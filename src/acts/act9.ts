// Act 9. Back to Brasília. Everything reserved earlier pays off here. Then the coda.

import elevationUrl from "../../assets/architecture/crops/elevation.png";
import photoUrl from "../../assets/architecture/crops/photo.jpg";
import nurserySvg from "../../assets/architecture/nursery-plan-lines.svg?raw";
import { label, setTitleBlock, svg } from "../sheet";
import { drawPlan } from "./act2";
import { gsap, t, clearPrevious, fadeIn, unDraw, wipe, copperFilter, FIG, GHOST_X, GHOST_TOP, type Build } from "./common";
import { ABOVE } from "../draw/brasilia";

// Click 39. "So let me take you back to Brasília." The plan returns exactly as in Act 2. The ghost line darkens.
const back: Build = (s, beat) => {
  const tl = gsap.timeline();
  clearPrevious(s, tl, 0);
  tl.call(() => setTitleBlock(s, beat), [], 0.4);
  drawPlan(s, tl, 0.8, "plan9", 0.8);
  const g = s.draw.querySelector(".ghost");
  if (g) tl.to(g, { opacity: 0.5, duration: 2, ease: "sine.inOut" }, 2.5);
  return tl;
};


// Click 40. "I think we can." Edu's elevation draws in copper, then becomes the photograph of the building today.
const building: Build = (s) => {
  const tl = gsap.timeline();
  copperFilter(s.draw);
  const box = { x: 380, y: 470, w: 194, h: 260 };
  const elev = t(svg("image", { href: elevationUrl, x: box.x, y: box.y, width: box.w, height: box.h, filter: "url(#to-copper)", preserveAspectRatio: "xMidYMid meet" }, s.draw)) as SVGImageElement;
  const w = wipe(s, elev, box, "bottom");
  tl.to(w.rect, { ...w.to, duration: 2.6, ease: "power1.inOut" }, 0.2);

  // The only photograph in the talk: small, like a print pinned to the board, toned toward the paper.
  const pw = 300, ph = 185, px = 327, py = 510;
  const print = t(svg("g", { class: "print", opacity: 0, transform: `rotate(-1.2 ${px + pw / 2} ${py + ph / 2})` }, s.draw));
  svg("image", { href: photoUrl, x: px, y: py, width: pw, height: ph, preserveAspectRatio: "xMidYMid slice",
    style: "filter: sepia(0.35) saturate(0.7) contrast(0.92); mix-blend-mode: multiply" }, print);
  svg("rect", { x: px, y: py, width: pw, height: ph, fill: "none", stroke: "var(--ink)", "stroke-width": 1 }, print);
  svg("circle", { cx: px + pw / 2, cy: py + 9, r: 4.5, fill: "var(--copper)" }, print);
  tl.to(print, { opacity: 1, duration: 1.6, ease: "sine.inOut" }, 3.8)
    .to(elev, { opacity: 0, duration: 1.6, ease: "sine.inOut" }, 3.8);
  return tl;
};

// The nursery school plan for 72 children: Edu's real lines, from the vector PDF.
const NURSERY = { x: 1240, y: 380, s: 0.644, w: 870, h: 600 };
const PLACA = { x: 1452, y: 692, rx: 46, ry: 34 };   // the plaça d'accés, in sheet coordinates

// Click 41. "And I think it is worth doing." The dots walk into the plaça d'accés and gather there.
const nursery: Build = (s) => {
  const tl = gsap.timeline();
  const doc = new DOMParser().parseFromString(nurserySvg, "image/svg+xml");
  const g = t(svg("g", { class: "nursery", transform: `translate(${NURSERY.x} ${NURSERY.y}) scale(${NURSERY.s})` }, s.draw));
  const light = doc.querySelector("path.light")?.getAttribute("d") ?? "";
  const heavy = doc.querySelector("path.heavy")?.getAttribute("d") ?? "";
  svg("path", { d: light, fill: "none", stroke: "var(--copper)", "stroke-width": 0.6, opacity: 0.55, "vector-effect": "non-scaling-stroke" }, g);
  svg("path", { d: heavy, fill: "none", stroke: "var(--copper)", "stroke-width": 1.4, "vector-effect": "non-scaling-stroke" }, g);
  const holder = t(svg("g", {}, s.draw));
  holder.appendChild(g);
  const w = wipe(s, holder, { x: NURSERY.x, y: NURSERY.y, w: NURSERY.w * NURSERY.s, h: NURSERY.h * NURSERY.s }, "left");
  tl.to(w.rect, { ...w.to, duration: 2.8, ease: "power1.inOut" }, 0.2);

  const dots = t(svg("g", { class: "gather" }, s.draw));
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + (i % 3) * 0.3, rr = 0.35 + ((i * 37) % 10) / 16;
    const sx = NURSERY.x - 30 - (i % 5) * 16, sy = 640 + Math.floor(i / 5) * 40;       // from the street on the left
    const d = svg("circle", { cx: sx, cy: sy, r: 4.5, fill: "var(--ink)", opacity: 0 }, dots);
    tl.to(d, { opacity: 1, duration: 0.4 }, 3 + i * 0.05)
      .to(d, { attr: { cx: PLACA.x + Math.cos(a) * PLACA.rx * rr, cy: PLACA.y + Math.sin(a) * PLACA.ry * rr }, duration: 3.4, ease: "sine.inOut" }, 3.3 + i * 0.09);
  }
  return tl;
};

// Click 42. "Frameworks are necessary." The plan lowers until it meets the figure. The dimension line gets its label.
const meets: Build = (s) => {
  const tl = gsap.timeline();
  tl.to(s.draw.querySelectorAll(".print, .nursery, .gather, :scope > image"), { opacity: 0, duration: 1.2, ease: "sine.inOut" }, 0);
  const plan = s.draw.querySelector("#plan9");
  const dy = FIG.top - 12 - (ABOVE.y + 325 * ABOVE.s);                            // plan bottom comes to rest just above his head
  if (plan) tl.to(plan, { y: dy, duration: 4, ease: "power2.inOut" }, 0.8);
  const g = s.draw.querySelector(".ghost");
  if (g) {
    const q = (c: string) => g.querySelector(c)!;
    tl.to(q(".g-main"), { attr: { y1: GHOST_TOP + dy }, duration: 4, ease: "power2.inOut" }, 0.8)
      .to(q(".g-top"), { attr: { y1: GHOST_TOP + 12 + dy, y2: GHOST_TOP - 12 + dy }, duration: 4, ease: "power2.inOut" }, 0.8)
      .to(q(".g-topext"), { attr: { y1: GHOST_TOP + dy, y2: GHOST_TOP + dy }, duration: 4, ease: "power2.inOut" }, 0.8)
      .to(g, { opacity: 0.9, duration: 1.5 }, 4.2);
  }
  const lab = t(svg("g", { class: "verdict", opacity: 0 }, s.draw));
  const mid = (GHOST_TOP + dy + FIG.ground) / 2;
  ["Useful.", "Trusted.", "Sustainable in practice."].forEach((w, i) =>
    label(lab, GHOST_X - 40, mid - 44 + i * 56, w, { family: "serif", size: 48, anchor: "end" }));
  svg("path", { d: `M${GHOST_X - 32} ${mid - 58}H${GHOST_X - 4}`, stroke: "var(--ink)", "stroke-width": 1.5 }, lab);
  fadeIn(tl, lab, 5.2, 1.4);
  return tl;
};

// Click 43. The coda. Everything un-draws back into paper, then the question returns.
const coda: Build = (s, beat) => {
  const tl = gsap.timeline();
  tl.call(() => setTitleBlock(s, beat), [], 0);
  const lines = Array.from(s.draw.querySelectorAll("#plan9 path, #plan9 rect"));
  unDraw(tl, lines.reverse(), 0, 1.4, 0.03);
  tl.to(s.draw.querySelectorAll(".verdict, .ghost, .t:not(#plan9)"), { opacity: 0, duration: 1.2, ease: "sine.inOut" }, 0.4);
  const q = document.createElement("div");
  q.className = "coda t";
  q.textContent = "What is one word in your organisation that means something different depending on which floor you are standing on?";
  gsap.set(q, { opacity: 0 });
  tl.call(() => s.words.appendChild(q), [], 2.6);
  fadeIn(tl, q, 2.7, 1.8);
  return tl;
};

export const ACT9: Record<number, Build> = { 39: back, 40: building, 41: nursery, 42: meets, 43: coda };
