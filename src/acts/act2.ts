// Act 2. Brasília. The idea this act introduces, and the rest of the talk reuses, is scale.

import { brasilia, ABOVE, axisPoints, type Plan } from "../draw/brasilia";
import { congresso } from "../draw/congresso";
import { hand, exact, type Pt } from "../draw/hand";
import { label, setTitleBlock, svg, type Sheet } from "../sheet";
import { gsap, t, clearPrevious, drawIn, fadeIn, wipe, FIG, GHOST_X, type Build } from "./common";

/** Draw the copper plan above the figure. Shared with Act 9: the same geometry, the same order. */
export function drawPlan(s: Sheet, tl: gsap.core.Timeline, at: number, id: string, speed = 1): Plan {
  const plan = brasilia(s.draw, "copper", ABOVE, id);
  t(plan.root);
  gsap.set([...plan.axis, ...plan.wings, ...plan.ring, ...plan.lake], { drawSVG: "0%" });
  gsap.set(plan.blocks, { opacity: 0 });
  drawIn(tl, plan.axis, at, 1.6 * speed);                                  // the long monumental axis
  drawIn(tl, plan.wings, at + 1.4 * speed, 2.4 * speed, 0.15);             // then the curved residential wings
  tl.to(plan.blocks, { opacity: 1, duration: 0.4, stagger: 0.04 * speed, ease: "sine.out" }, at + 2.6 * speed);
  drawIn(tl, [...plan.ring, ...plan.lake], at + 3.2 * speed, 1.4 * speed, 0.1);
  return plan;
}

/** Handoff from Act 1: the flattened lineage diagram re-forms into the plan.
 *  The spine becomes the monumental axis; the four data layers become the wings, the ring road and the lake. */
function reform(s: Sheet, tl: gsap.core.Timeline, lineage: SVGGElement): Plan {
  const M = lineage.getCTM()!;
  const bake = (el: SVGGeometryElement) => {             // the diagram was flattened by a transform: bake it into sheet coordinates
    const L = el.getTotalLength(), a = el.getPointAtLength(0), b = el.getPointAtLength(L);
    const A = new DOMPoint(a.x, a.y).matrixTransform(M), B = new DOMPoint(b.x, b.y).matrixTransform(M);
    return t(svg("path", { d: `M${A.x.toFixed(1)} ${A.y.toFixed(1)}L${B.x.toFixed(1)} ${B.y.toFixed(1)}`, stroke: "var(--blueprint)", "stroke-width": 2, fill: "none" }, s.draw)) as SVGPathElement;
  };
  const spine = bake(lineage.querySelector(".spine") as SVGGeometryElement);
  const floors = Array.from(lineage.querySelectorAll(".floor")) as SVGGeometryElement[];
  // Seven slab lines collapsed into four layers; take one of each pair
  const layers = [floors[0], floors[2], floors[4], floors[6]].filter(Boolean).map(bake);
  lineage.remove();
  const plan = brasilia(s.draw, "copper", ABOVE, "plan2");
  t(plan.root);
  const targets = [plan.wings[0], plan.wings[1], plan.ring[0], plan.lake[0]];
  gsap.set([...plan.axis, ...plan.wings, ...plan.ring, ...plan.lake], { opacity: 0 });
  gsap.set(plan.blocks, { opacity: 0 });
  tl.to(spine, { morphSVG: plan.axis[0].getAttribute("d")!, stroke: "var(--copper)", strokeWidth: 2.4, duration: 2.2, ease: "power2.inOut" }, 0.4);
  layers.forEach((l, i) => tl.to(l, { morphSVG: targets[i].getAttribute("d")!, stroke: "var(--copper)", strokeWidth: 1.8, duration: 2.4, ease: "power2.inOut" }, 0.5 + i * 0.1));
  // When the shapes arrive, the real plan takes over underneath, and the rest of the city fills in.
  tl.set([...plan.axis.slice(0, 1), ...targets], { opacity: 1 }, 3)
    .set([spine, ...layers], { display: "none" }, 3)
    .to(plan.axis.slice(1), { opacity: 1, duration: 0.8 }, 3)
    .to(plan.blocks, { opacity: 1, duration: 0.4, stagger: 0.03, ease: "sine.out" }, 3.2)
    .call(() => { spine.remove(); layers.forEach((l) => l.remove()); }, [], 4.5);
  return plan;
}

// Click 5. "Let me take you to Brasília."
const plan: Build = (s, beat) => {
  const tl = gsap.timeline();
  const lineage = s.draw.querySelector(".lineage") as SVGGElement | null;
  clearPrevious(s, tl, 0, lineage ? [lineage] : []);
  tl.call(() => setTitleBlock(s, beat), [], 0.4);
  if (lineage) reform(s, tl, lineage);                    // the diagram above becomes Brasília
  else drawPlan(s, tl, 0.6, "plan2");

  // Credits, as a small cartouche beside the drawing. At reading size: they replace the spoken credit.
  const credit = t(svg("g", { class: "credit", opacity: 0 }, s.draw));
  label(credit, 1420, 150, "URBAN PLAN", { size: 16, weight: 600, spacing: 2.2 });
  label(credit, 1420, 200, "Lúcio Costa, 1957", { size: 44 });
  label(credit, 1420, 262, "BUILDINGS", { size: 16, weight: 600, spacing: 2.2 });
  label(credit, 1420, 312, "Oscar Niemeyer", { size: 44 });
  fadeIn(tl, credit, 5, 1);

  // The homage: the Congresso rises from the horizon of the plan, holds, and lies back down.
  const hz = 420, cx = 960;
  const { g: cg, horizon, slab, towers, dome, bowl } = congresso(s.draw, cx, hz, "cn");
  t(cg);
  gsap.set([horizon, slab, ...towers, dome, bowl], { drawSVG: "0%" });
  drawIn(tl, horizon, 6.2, 0.8);
  drawIn(tl, slab, 6.6, 0.6);
  drawIn(tl, towers, 7, 1.2, 0.15);
  drawIn(tl, [dome, bowl], 8, 1.2);
  tl.to(cg, { scaleY: 0, svgOrigin: `${cx} ${hz}`, duration: 1.4, ease: "power2.in" }, 11.2)   // hold 2 s, then it lies down
    .set(cg, { display: "none" }, 12.6);

  // A thin, warm glow runs once along the main axis, then settles.
  const ax = axisPoints(ABOVE);
  const glow = t(svg("path", { d: exact(ax), stroke: "var(--copper-light)", "stroke-width": 5, "stroke-linecap": "round", fill: "none", opacity: 0.85 }, s.draw));
  gsap.set(glow, { drawSVG: "0% 0%" });
  tl.to(glow, { drawSVG: "0% 18%", duration: 0.5, ease: "none" }, 12.8)
    .to(glow, { drawSVG: "82% 100%", duration: 1.6, ease: "sine.inOut" }, 13.3)
    .to(glow, { opacity: 0, duration: 0.8 }, 14.6)
    .set(glow, { display: "none" }, 15.4);
  return tl;
};

// Click 6. "Jan Gehl later coined a name…" Title, the footpath that never arrives, then the two scales.
const syndrome: Build = (s) => {
  const tl = gsap.timeline();
  const title = t(label(s.draw, 96, 1010, "The Brasília Syndrome.", { family: "serif", size: 60 }));
  fadeIn(tl, title, 0, 1.2);

  const pts: Pt[] = [[FIG.x + 22, FIG.ground - 4], [1030, 900], [1062, 820], [1040, 720], [1000, 630], [978, 560]];
  const path = t(svg("path", { d: hand(pts, "footpath", 0.8), stroke: "var(--ink)", "stroke-width": 2, fill: "none", "stroke-dasharray": "9 9", "stroke-linecap": "round" }, s.draw)) as SVGPathElement;
  const w = wipe(s, path, { x: 900, y: 540, w: 200, h: 400 }, "bottom");
  tl.to(w.rect, { ...w.to, duration: 6, ease: "sine.inOut" }, 1.2);

  const big = t(label(s.draw, 1420, 400, "1 : 50 000", { size: 44 }));
  const one = t(label(s.draw, GHOST_X - 20, 905, "1 : 1", { size: 44, anchor: "end" }));
  fadeIn(tl, [big, one], 7.4, 0.8, 0.6);
  return tl;
};

// The builders: small ink dots from the satellite towns at the edges, walking inward in lines.
const LINES: { from: Pt; to: Pt }[] = [
  { from: [40, 640], to: [600, 420] },
  { from: [1880, 600], to: [1330, 420] },
  { from: [260, 1060], to: [760, 440] },
  { from: [1660, 1060], to: [1180, 440] },
];
const PER = 11;

const builders: Build = (s) => {
  const tl = gsap.timeline();
  const g = t(svg("g", { class: "builders" }, s.draw));
  LINES.forEach((ln, li) => {
    for (let i = 0; i < PER; i++) {
      const d = svg("circle", { cx: ln.from[0], cy: ln.from[1], r: 4.5, fill: "var(--ink)", opacity: 0 }, g);
      const f = 0.42 + i * 0.05;                     // queue along the line, the first ones closest to the city
      const x = ln.from[0] + (ln.to[0] - ln.from[0]) * f, y = ln.from[1] + (ln.to[1] - ln.from[1]) * f;
      tl.to(d, { opacity: 1, duration: 0.4 }, 0.1 * li + i * 0.06)
        .to(d, { attr: { cx: x, cy: y }, duration: 4.2, ease: "sine.inOut" }, 0.5 + 0.1 * li + (PER - i) * 0.12);
    }
  });
  return tl;
};

// Click 8. "The city was finished." They leave. The plan stays perfect and empty. One line holds.
const finished: Build = (s) => {
  const tl = gsap.timeline();
  const dots = Array.from(s.draw.querySelectorAll(".builders circle"));
  dots.forEach((d, k) => {
    const ln = LINES[Math.floor(k / PER)];
    tl.to(d, { attr: { cx: ln.from[0], cy: ln.from[1] }, duration: 3.2, ease: "sine.inOut" }, (k % PER) * 0.08)
      .to(d, { opacity: 0, duration: 0.6 }, 2.8 + (k % PER) * 0.08);
  });
  const line = t(label(s.draw, 960, 505, "Built by people who could not afford to live in it.", { family: "serif", size: 56, anchor: "middle" }));
  fadeIn(tl, line, 3.2, 1.4);
  return tl;
};

export const ACT2: Record<number, Build> = { 5: plan, 6: syndrome, 7: builders, 8: finished };
